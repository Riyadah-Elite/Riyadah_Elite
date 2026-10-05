import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { TournamentDetailsPage } from "./TournamentDetailsPage";
import { TournamentRegistrationPage } from "./TournamentRegistrationPage";
import { PlayerTournamentsPage } from "./PlayerTournamentsPage";
import { TournamentDiscoveryPage } from "./TournamentDiscoveryPage";
import * as apiModule from "../lib/api";

describe("Tournament Pages & Player Participation (Phase 2)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const mockTournament: apiModule.TournamentItem = {
    id: "tourn_val_1",
    slug: "valorant-champions-cup-saudi",
    title: "Valorant Champions Cup Saudi",
    game: "Valorant",
    organizer: "Saudi Esports Federation",
    format: "5v5 Single Elimination",
    bracketType: "Single Elimination",
    platform: "PC Windows",
    region: "Middle East / MENA",
    prizePool: "SAR 25,000",
    entryFee: "Free",
    teamSize: 5,
    maxParticipants: 64,
    participantCount: 16,
    startDate: "2026-11-01T18:00:00.000Z",
    rules: ["Anti-cheat compliance mandatory", "Discord match check-in required"],
    description: "The premier competitive Valorant community tournament in Saudi Arabia.",
    bannerUrl: "https://example.com/banner.jpg",
    status: "REGISTRATION_OPEN",
    isFull: false,
  };

  const mockUser: apiModule.UserProfile = {
    id: "usr_val_1",
    fullName: "Fahad Al-Harbi",
    username: "fahad_gamer",
    email: "fahad@riyadah.gg",
    role: "PLAYER",
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  describe("TournamentDiscoveryPage", () => {
    it("renders tournament catalog and live search/filter UI with live API data", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            tournaments: [mockTournament],
          },
        },
      } as any);

      render(
        <MemoryRouter initialEntries={["/tournaments"]}>
          <Routes>
            <Route path="/tournaments" element={<TournamentDiscoveryPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/AVAILABLE TOURNAMENTS/i)).toBeInTheDocument();
      });

      expect(screen.getAllByText("Valorant Champions Cup Saudi").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Free").length).toBeGreaterThan(0);
    });
  });

  describe("TournamentDetailsPage", () => {
    it("renders tournament details and registration CTA when open", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            tournament: mockTournament,
          },
        },
      } as any);

      render(
        <MemoryRouter initialEntries={["/tournaments/valorant-champions-cup-saudi"]}>
          <Routes>
            <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText("Valorant Champions Cup Saudi").length).toBeGreaterThan(0);
      });

      expect(screen.getByText(/Organized by Saudi Esports Federation/i)).toBeInTheDocument();
      expect(screen.getByText(/SAR 25,000/i)).toBeInTheDocument();
      expect(screen.getByText("Register for Tournament →")).toBeInTheDocument();
    });

    it("displays honest error state when tournament not found", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: false,
        error: "Tournament not found or does not exist",
      });

      render(
        <MemoryRouter initialEntries={["/tournaments/unknown-tourney"]}>
          <Routes>
            <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Tournament Unavailable/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/Back to Tournaments Catalog/i)).toBeInTheDocument();
    });
  });

  describe("TournamentRegistrationPage", () => {
    it("renders identity snapshot, participation options, and registration form", async () => {
      localStorage.setItem("riyadah_auth_token", "fake-test-token");

      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint === "/player/overview") {
          return {
            ok: true,
            data: {
              status: "ok",
              data: {
                user: mockUser,
                profile: { discordHandle: "fahad#1234" },
                metrics: { activeTests: 0, pendingApplications: 0, completedTests: 0, testerScore: 90 },
                applications: [],
              },
            },
          };
        }
        if (endpoint.startsWith("/tournaments/")) {
          return {
            ok: true,
            data: {
              status: "ok",
              data: { tournament: mockTournament },
            },
          };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter initialEntries={["/tournaments/valorant-champions-cup-saudi/register"]}>
          <Routes>
            <Route path="/tournaments/:id/register" element={<TournamentRegistrationPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/1. Player Identity Snapshot/i)).toBeInTheDocument();
      });

      expect(screen.getByText("Fahad Al-Harbi")).toBeInTheDocument();
      expect(screen.getByText("fahad@riyadah.gg")).toBeInTheDocument();
      expect(screen.getByText(/Complete Registration →/i)).toBeInTheDocument();
    });
  });

  describe("PlayerTournamentsPage", () => {
    it("renders registered tournaments workspace and stats", async () => {
      const mockRegistration: apiModule.TournamentRegistrationItem = {
        id: "reg_101",
        tournamentId: mockTournament.id,
        userId: mockUser.id,
        registrationMode: "SOLO",
        status: "CONFIRMED",
        inGameHandle: "Fahad#KSA",
        preferredRoles: ["Duelist"],
        ticketCode: "TCK-VAL-9921",
        agreedRules: true,
        agreedAntiCheat: true,
        createdAt: "2026-10-01T12:00:00.000Z",
        tournament: mockTournament,
      };

      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint.startsWith("/player/tournaments")) {
          return {
            ok: true,
            data: {
              status: "ok",
              data: {
                registrations: [mockRegistration],
                metrics: { total: 1, upcoming: 1, active: 0, completed: 0 },
              },
            },
          };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter initialEntries={["/player/tournaments"]}>
          <PlayerTournamentsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("TOURNAMENTS WORKSPACE")).toBeInTheDocument();
      });

      expect(screen.getByText("NEXT TOURNAMENT")).toBeInTheDocument();
      expect(screen.getAllByText("Valorant Champions Cup Saudi").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/TCK-VAL-9921/i).length).toBeGreaterThan(0);
    });

    it("displays honest empty state when no tournaments registered", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            registrations: [],
            metrics: { total: 0, upcoming: 0, active: 0, completed: 0 },
          },
        },
      } as any);

      render(
        <MemoryRouter initialEntries={["/player/tournaments"]}>
          <PlayerTournamentsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("NO TOURNAMENTS FOUND")).toBeInTheDocument();
      });
      expect(screen.getByText(/Browse Tournaments Catalog →/i)).toBeInTheDocument();
    });
  });
});
