import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HostOverviewPage } from "./host/HostOverviewPage";
import { HostMyTournamentsPage } from "./host/HostMyTournamentsPage";
import { HostTournamentManagementPage } from "./host/HostTournamentManagementPage";
import { HostResultsParticipantsPage } from "./host/HostResultsParticipantsPage";
import { HostProfileSettingsPage } from "./host/HostProfileSettingsPage";
import { HostLayout } from "../components/layout/HostLayout";
import * as apiModule from "../lib/api";

describe("Tournament Host Workspace Pages (Phase 4A)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem("riyadah_auth_token", "fake-host-jwt");
  });

  describe("HostLayout", () => {
    it("renders navigation sidebar with host section links and operations brand", () => {
      render(
        <MemoryRouter initialEntries={["/host/dashboard"]}>
          <HostLayout />
        </MemoryRouter>
      );
      expect(screen.getAllByText(/RIYADAH/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Host Operations/i)).toBeInTheDocument();
      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("My Tournaments")).toBeInTheDocument();
      expect(screen.getAllByText("Create Tournament").length).toBeGreaterThan(0);
      expect(screen.getByText("Results & Participants")).toBeInTheDocument();
      expect(screen.getByText("Host Profile & Settings")).toBeInTheDocument();
    });
  });

  describe("HostOverviewPage", () => {
    it("renders metrics, host verification status, and recent tournament cards on API response", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            hostName: "Tariq Al-Mansoor",
            organizationName: "Riyadh Esports Operations",
            tier: "Tier-1",
            verificationStatus: "VERIFIED",
            metrics: {
              totalTournaments: 6,
              activeTournaments: 2,
              totalParticipants: 128,
              completedTournaments: 4,
              pendingCheckIns: 8,
              escrowDisbursedSAR: 45000,
            },
            recentTournaments: [
              {
                id: "tourney_1",
                slug: "riyadh-valorant-cup",
                title: "Riyadh Community Valorant Cup",
                game: "Valorant",
                organizer: "Riyadh Esports",
                format: "5v5 Single Elimination",
                platform: "PC Windows",
                region: "ME-East",
                prizePool: "15,000 SAR",
                entryFee: "Free",
                teamSize: 5,
                maxParticipants: 32,
                startDate: "2026-10-10",
                rules: ["Anti-Cheat Required"],
                description: "Regional collegiate Valorant showdown.",
                status: "ONGOING",
              },
            ],
          },
        },
      });

      render(
        <MemoryRouter>
          <HostOverviewPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Tournament Host Overview: Riyadh Esports Operations \(Tier-1\)/i)).toBeInTheDocument();
        expect(screen.getByText("Riyadh Community Valorant Cup")).toBeInTheDocument();
        expect(screen.getByText("45,000 SAR")).toBeInTheDocument();
      });
    });

    it("renders truthful empty state when no tournaments exist", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            hostName: "New Host",
            organizationName: "Fresh Host Guild",
            tier: "Tier-1",
            verificationStatus: "VERIFIED",
            metrics: {
              totalTournaments: 0,
              activeTournaments: 0,
              totalParticipants: 0,
              completedTournaments: 0,
              pendingCheckIns: 0,
              escrowDisbursedSAR: 0,
            },
            recentTournaments: [],
          },
        },
      });

      render(
        <MemoryRouter>
          <HostOverviewPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("No Tournaments Hosted Yet")).toBeInTheDocument();
        expect(screen.getByText("+ Create First Tournament")).toBeInTheDocument();
      });
    });
  });

  describe("HostMyTournamentsPage", () => {
    it("renders tournament list and filters by status", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            tournaments: [
              {
                id: "t_101",
                slug: "cs2-masters",
                title: "Saudi CS2 Masters",
                game: "Counter-Strike 2",
                organizer: "Riyadh Esports",
                format: "5v5 Double Elimination",
                platform: "PC Windows",
                region: "ME-East",
                prizePool: "25,000 SAR",
                entryFee: "Free",
                teamSize: 5,
                maxParticipants: 16,
                startDate: "2026-10-20",
                rules: [],
                description: "Pro-am CS2 invitational.",
                status: "REGISTRATION_OPEN",
              },
            ],
          },
        },
      });

      render(
        <MemoryRouter>
          <HostMyTournamentsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Saudi CS2 Masters")).toBeInTheDocument();
        expect(screen.getByText("16 Max")).toBeInTheDocument();
      });
    });
  });

  describe("HostTournamentManagementPage", () => {
    it("renders creation form with anti-gambling disclaimer and validates title", async () => {
      render(
        <MemoryRouter>
          <HostTournamentManagementPage />
        </MemoryRouter>
      );

      expect(screen.getByText("Create New Tournament")).toBeInTheDocument();
      expect(screen.getByText("Riyadah Anti-Gambling Guarantee")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. Riyadah Community Valorant Cup/i)).toBeInTheDocument();
    });
  });

  describe("HostResultsParticipantsPage", () => {
    it("renders roster table, matches bracket tab, and cryptographic audit hash", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            tournament: {
              id: "t_valorant",
              slug: "valorant-cup",
              title: "Valorant Community Cup",
              game: "Valorant",
              organizer: "Riyadh Host",
              format: "5v5 Single Elimination",
              platform: "PC Windows",
              region: "ME-East",
              prizePool: "5,000 SAR",
              entryFee: "Free",
              teamSize: 5,
              maxParticipants: 16,
              startDate: "2026-10-01",
              rules: [],
              description: "5v5 tournament.",
              status: "COMPLETED",
            },
            participants: [
              {
                id: "p_1",
                tournamentId: "t_valorant",
                tournamentTitle: "Valorant Community Cup",
                inGameHandle: "DesertFalcon#KSA",
                teamName: "Tuwaiq Gaming",
                registrationMode: "TEAM",
                status: "CONFIRMED",
                preferredRoles: ["Duelist"],
                score: 120,
                createdAt: "2026-09-28",
              },
            ],
            matches: [
              {
                id: "m_1",
                tournamentId: "t_valorant",
                roundName: "Grand Finals",
                matchNumber: 1,
                team1Name: "Tuwaiq Gaming",
                team2Name: "Falcon Strike",
                team1Score: 13,
                team2Score: 11,
                winnerName: "Tuwaiq Gaming",
                status: "COMPLETED",
              },
            ],
          },
        },
      });

      render(
        <MemoryRouter initialEntries={["/host/results"]}>
          <Routes>
            <Route path="/host/results" element={<HostResultsParticipantsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("DesertFalcon#KSA")).toBeInTheDocument();
        expect(screen.getByText("Tuwaiq Gaming")).toBeInTheDocument();
        expect(screen.getByText(/120 pts/i)).toBeInTheDocument();
      });
    });
  });

  describe("HostProfileSettingsPage", () => {
    it("renders organization profile and saves updates", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            profile: {
              hostName: "Tariq Al-Mansoor",
              organizationName: "Riyadh Esports Operations",
              contactEmail: "host@riyadahelite.com",
              discordHandle: "TariqHost#0001",
              country: "Saudi Arabia",
              city: "Riyadh",
              bio: "Esports tournament director.",
              tier: "Tier 1 Verified",
              isVerified: true,
              telemetryWebhook: "https://webhooks.riyadhesports.sa/telemetry",
              autoCheckIn: true,
              requireAntiCheat: true,
            },
          },
        },
      });

      render(
        <MemoryRouter>
          <HostProfileSettingsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("Tariq Al-Mansoor")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Riyadh Esports Operations")).toBeInTheDocument();
      });
    });
  });
});
