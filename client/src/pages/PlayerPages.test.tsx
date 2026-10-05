import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlayerDashboardPage } from "./PlayerDashboardPage";
import { GameTestingDashboardPage } from "./GameTestingDashboardPage";
import { PlayerProfilePage } from "./PlayerProfilePage";
import { PlayerSettingsPage } from "./PlayerSettingsPage";
import * as apiModule from "../lib/api";

describe("Player Workspace Pages", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("PlayerDashboardPage", () => {
    it("renders overview metrics when api succeeds", async () => {
      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint === "/player/overview") {
          return {
            ok: true,
            data: {
              status: "ok",
              data: {
                user: {
                  id: "usr_1",
                  fullName: "Rahul Tariq",
                  username: "rahul",
                  email: "rahul@example.com",
                  role: "PLAYER",
                  isVerified: true,
                  createdAt: "2026-01-01T00:00:00.000Z",
                },
                profile: {
                  testerScore: 94,
                  totalGamesTested: 5,
                  hardwareGpu: "RTX 4070",
                },
                metrics: {
                  activeTests: 1,
                  pendingApplications: 2,
                  completedTests: 3,
                  testerScore: 94,
                },
                applications: [
                  {
                    id: "app_1",
                    userId: "usr_1",
                    opportunityId: "opp_1",
                    status: "ACCEPTED",
                    platform: "PC",
                    primaryGames: ["Competitive / Ranked"],
                    hardwareGpu: "RTX 4070",
                    hardwareCpu: "Ryzen 7 7800X3D",
                    hardwareRam: "32GB",
                    availabilityHours: "10-15 Hours/Wk",
                    agreedNda: true,
                    agreedTelemetry: true,
                    createdAt: "2026-09-01T00:00:00.000Z",
                    opportunity: {
                      id: "opp_1",
                      slug: "cyber-drift",
                      title: "Cyber Drift: Neon Rivals",
                      studio: "Riyadh Interactive",
                      genre: "Sim Racing",
                      platform: "PC Windows",
                      stage: "Closed Beta",
                      description: "High speed test",
                      focusAreas: ["Netcode"],
                      requirements: ["DirectX 12"],
                      capacity: 50,
                      status: "ACTIVE",
                      createdAt: "2026-09-01T00:00:00.000Z",
                    },
                  },
                ],
              },
            },
          } as unknown as { ok: true; data: never };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter>
          <PlayerDashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/WELCOME BACK, RAHUL TARIQ/i)).toBeInTheDocument();
      });

      expect(screen.getAllByText("Cyber Drift: Neon Rivals").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/CURRENT ACTIVE PROTOCOL/i)).toBeInTheDocument();
      expect(screen.getByText(/ONLINE/i)).toBeInTheDocument();
    });

    it("displays honest empty state when there are no applications", async () => {
      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint === "/player/overview") {
          return {
            ok: true,
            data: {
              status: "ok",
              data: {
                user: {
                  id: "usr_2",
                  fullName: "Sara Al-Harbi",
                  username: "sara",
                  email: "sara@example.com",
                  role: "PLAYER",
                  isVerified: true,
                  createdAt: "2026-01-01T00:00:00.000Z",
                },
                profile: null,
                metrics: {
                  activeTests: 0,
                  pendingApplications: 0,
                  completedTests: 0,
                  testerScore: 0,
                },
                applications: [],
              },
            },
          } as unknown as { ok: true; data: never };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter>
          <PlayerDashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/No Applications Submitted Yet/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/No Active Playtests Assigned/i)).toBeInTheDocument();
    });
  });

  describe("GameTestingDashboardPage", () => {
    it("renders game testing directory and lists live opportunities", async () => {
      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint.startsWith("/player/opportunities")) {
          return {
            ok: true,
            data: {
              status: "ok",
              data: {
                opportunities: [
                  {
                    id: "opp_1",
                    slug: "desert-recon",
                    title: "Desert Recon",
                    studio: "Apex Games",
                    genre: "Tactical FPS",
                    platform: "PC Windows",
                    stage: "Alpha Test",
                    description: "Realistic tactical desert operations playtest.",
                    focusAreas: ["Weapon ballistics", "Tickrate"],
                    requirements: ["RTX 2060"],
                    capacity: 100,
                    status: "ACTIVE",
                    createdAt: "2026-09-01T00:00:00.000Z",
                    _count: { applications: 45 },
                  },
                ],
              },
            },
          } as unknown as { ok: true; data: never };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter>
          <GameTestingDashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Desert Recon")).toBeInTheDocument();
      });

      expect(screen.getByText(/Apex Games/i)).toBeInTheDocument();
    });

    it("renders honest empty state when no games match the filter", async () => {
      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint.startsWith("/player/opportunities")) {
          return {
            ok: true,
            data: {
              status: "ok",
              data: { opportunities: [] },
            },
          } as unknown as { ok: true; data: never };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter>
          <GameTestingDashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/No Matching Game Tests Found/i)).toBeInTheDocument();
      });
    });
  });

  describe("PlayerProfilePage", () => {
    it("loads and displays the player's profile and allows form interactions", async () => {
      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint === "/player/profile") {
          return {
            ok: true,
            data: {
              status: "ok",
              data: {
                user: {
                  id: "usr_1",
                  fullName: "Tariq Aziz",
                  username: "tariq_apex",
                  email: "tariq@example.com",
                  role: "PLAYER",
                  isVerified: true,
                  createdAt: "2026-01-01T00:00:00.000Z",
                },
                profile: {
                  bio: "Competitive sim racer and FPS tester",
                  city: "Jeddah",
                  primaryPlatform: "PC Windows",
                  hardwareGpu: "RTX 4080",
                  hardwareCpu: "Intel i9-13900K",
                  hardwareRam: "64GB",
                  discordHandle: "tariq#0001",
                  testerScore: 92,
                },
              },
            },
          } as unknown as { ok: true; data: never };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter>
          <PlayerProfilePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("Tariq Aziz")).toBeInTheDocument();
      });

      expect(screen.getByText("@tariq_apex")).toBeInTheDocument();
      expect(screen.getByDisplayValue("RTX 4080")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Intel i9-13900K")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Save Profile/i })).toBeInTheDocument();
    });
  });

  describe("PlayerSettingsPage", () => {
    it("renders account security and password update fields", () => {
      render(
        <MemoryRouter>
          <PlayerSettingsPage />
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: /PLAYER SETTINGS/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Update Password/i })).toBeInTheDocument();
    });
  });
});
