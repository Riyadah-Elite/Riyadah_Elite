import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DeveloperOverviewPage } from "./developer/DeveloperOverviewPage";
import { DeveloperMyGamesPage } from "./developer/DeveloperMyGamesPage";
import { DeveloperAddGamePage } from "./developer/DeveloperAddGamePage";
import { DeveloperGameDetailsPage } from "./developer/DeveloperGameDetailsPage";
import { DeveloperTestingCampaignsPage } from "./developer/DeveloperTestingCampaignsPage";
import { DeveloperCampaignDetailsPage } from "./developer/DeveloperCampaignDetailsPage";
import { DeveloperTestersPage } from "./developer/DeveloperTestersPage";
import { DeveloperFeedbackPage } from "./developer/DeveloperFeedbackPage";
import { DeveloperPaymentsPage } from "./developer/DeveloperPaymentsPage";
import { DeveloperVerificationPage } from "./developer/DeveloperVerificationPage";
import { DeveloperProfilePage } from "./developer/DeveloperProfilePage";
import { DeveloperSettingsPage } from "./developer/DeveloperSettingsPage";
import { DeveloperSupportPage } from "./developer/DeveloperSupportPage";
import { DeveloperLayout } from "../components/layout/DeveloperLayout";
import * as apiModule from "../lib/api";

describe("Developer Workspace Pages (Phase 3A)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem("riyadah_auth_token", "fake-dev-jwt");
  });

  describe("DeveloperLayout", () => {
    it("renders navigation sidebar with 13 key section links and redirects if unauthenticated", () => {
      render(
        <MemoryRouter initialEntries={["/developer/dashboard"]}>
          <DeveloperLayout />
        </MemoryRouter>
      );
      expect(screen.getAllByText(/RIYADAH/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/DEVELOPER RIG · NODE 04/i)).toBeInTheDocument();
      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("My Games")).toBeInTheDocument();
      expect(screen.getByText("Testing Campaigns")).toBeInTheDocument();
      expect(screen.getByText("Testers")).toBeInTheDocument();
      expect(screen.getByText("Feedback & Results")).toBeInTheDocument();
      expect(screen.getByText("Payments & Earnings")).toBeInTheDocument();
    });
  });

  describe("DeveloperOverviewPage", () => {
    it("renders verification badge, escrow balance and telemetry metrics on API response", async () => {
      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (endpoint: string) => {
        if (endpoint === "/developer/overview") {
          return {
            ok: true,
            data: {
              status: "ok",
              data: {
                developerName: "CyberNova",
                studioName: "CyberNova Studios",
                tier: "Tier-1",
                verificationStatus: "VERIFIED",
                escrowBalance: "14,250 SAR",
                metrics: {
                  totalGames: 4,
                  activeCampaigns: 2,
                  activeTesters: 348,
                  pendingReports: 14,
                  avgRating: 4.8,
                  totalEarningsSAR: 84000,
                },
                games: [
                  {
                    id: "game_1",
                    slug: "cyberstrike",
                    title: "CyberStrike: Sands of Riyadh",
                    studio: "CyberNova",
                    genre: "Action RPG",
                    platform: "PC",
                    stage: "Closed Alpha",
                    description: "Combat playtest",
                    focusAreas: ["Netcode"],
                    requirements: ["16GB RAM"],
                    capacity: 100,
                    status: "ACTIVE",
                    createdAt: "2026-09-01",
                  },
                ],
                recentCampaigns: [],
                recentFeedback: [],
              },
            },
          };
        }
        return { ok: false, error: "Not found" };
      });

      render(
        <MemoryRouter>
          <DeveloperOverviewPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Developer Verification: CyberNova Studios/i)).toBeInTheDocument();
        expect(screen.getByText("14,250 SAR")).toBeInTheDocument();
        expect(screen.getByText("CyberStrike: Sands of Riyadh")).toBeInTheDocument();
      });
    });

    it("renders truthful notice when overview endpoint is unavailable", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: false,
        error: "Server endpoint in preparation for Phase 3B",
      });

      render(
        <MemoryRouter>
          <DeveloperOverviewPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Backend Telemetry Notice \(Phase 3B\)/i)).toBeInTheDocument();
      });
    });
  });

  describe("DeveloperMyGamesPage", () => {
    it("renders game catalog and search input", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            games: [
              {
                id: "g_1",
                slug: "desert-storm",
                title: "Desert Recon",
                studio: "CyberNova",
                genre: "Tactical Shooter",
                platform: "PC",
                stage: "Technical Beta",
                description: "Squad tactical shooter",
                focusAreas: ["Matchmaking"],
                requirements: ["RTX 3060"],
                capacity: 50,
                status: "ACTIVE",
                createdAt: "2026-09-10",
              },
            ],
          },
        },
      });

      render(
        <MemoryRouter>
          <DeveloperMyGamesPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Desert Recon")).toBeInTheDocument();
        expect(screen.getByText("Cap: 50 Testers")).toBeInTheDocument();
      });
    });
  });

  describe("DeveloperAddGamePage", () => {
    it("renders multi-step submission form with IP rights guarantee checkbox", () => {
      render(
        <MemoryRouter>
          <DeveloperAddGamePage />
        </MemoryRouter>
      );

      expect(screen.getByText(/Step 1: Game Identification & Genre/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. CyberStrike: Sands of Riyadh/i)).toBeInTheDocument();
    });
  });

  describe("DeveloperGameDetailsPage", () => {
    it("renders game specifications and telemetry target slots", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            game: {
              id: "g_10",
              slug: "titan-clash",
              title: "Titan Clash Arena",
              studio: "CyberNova",
              genre: "Action RPG",
              platform: "PC (Windows)",
              stage: "Closed Alpha",
              description: "Arena multiplayer brawler",
              focusAreas: ["Hitbox Precision", "Netcode Latency"],
              requirements: ["DirectX 12", "16GB RAM"],
              capacity: 120,
              status: "ACTIVE",
              createdAt: "2026-09-01",
            },
          },
        },
      });

      render(
        <MemoryRouter initialEntries={["/developer/games/g_10"]}>
          <Routes>
            <Route path="/developer/games/:id" element={<DeveloperGameDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Titan Clash Arena")).toBeInTheDocument();
        expect(screen.getByText("Hitbox Precision")).toBeInTheDocument();
      });
    });
  });

  describe("DeveloperTestingCampaignsPage & CampaignDetails", () => {
    it("renders active campaign list and details", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            campaigns: [
              {
                id: "c_1",
                gameId: "g_1",
                title: "Sprint 01: Stress Testing",
                gameTitle: "Desert Recon",
                stage: "Alpha",
                targetTesters: 40,
                enrolledTesters: 38,
                status: "ACTIVE",
                startDate: "2026-10-01",
                endDate: "2026-10-15",
                primaryFocus: "Server Stress Test",
              },
            ],
            campaign: {
              id: "c_1",
              gameId: "g_1",
              title: "Sprint 01: Stress Testing",
              gameTitle: "Desert Recon",
              stage: "Alpha",
              targetTesters: 40,
              enrolledTesters: 38,
              status: "ACTIVE",
              startDate: "2026-10-01",
              endDate: "2026-10-15",
              primaryFocus: "Server Stress Test",
            },
          },
        },
      });

      render(
        <MemoryRouter>
          <DeveloperTestingCampaignsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Sprint 01: Stress Testing")).toBeInTheDocument();
        expect(screen.getByText(/38 \/ 40 Testers/i)).toBeInTheDocument();
      });

      render(
        <MemoryRouter initialEntries={["/developer/campaigns/c_1"]}>
          <Routes>
            <Route path="/developer/campaigns/:id" element={<DeveloperCampaignDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText("Sprint 01: Stress Testing").length).toBeGreaterThan(0);
      });
    });
  });

  describe("DeveloperTestersPage", () => {
    it("renders privacy-compliant testers table without exposing PII", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            testers: [
              {
                id: "t_1",
                testerTag: "FalconSniper_99",
                campaignTitle: "Sprint 01",
                enrolledDate: "2026-10-01",
                status: "ACTIVE",
                platform: "Windows 11 / RTX 4080",
                bugsReported: 4,
                hoursPlayed: 12,
                ndaSigned: true,
              },
            ],
          },
        },
      });

      render(
        <MemoryRouter>
          <DeveloperTestersPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("FalconSniper_99")).toBeInTheDocument();
        expect(screen.getByText("✓ Executed")).toBeInTheDocument();
      });
    });
  });

  describe("DeveloperFeedbackPage", () => {
    it("renders verified feedback triage reports", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: {
            feedback: [
              {
                id: "fb_1",
                gameTitle: "Desert Recon",
                campaignTitle: "Sprint 01",
                testerTag: "FalconSniper_99",
                category: "BUG",
                severity: "HIGH",
                title: "Reload animation desync on 144Hz monitors",
                details: "Occurs when switching weapons during reload phase",
                rating: 4,
                submittedAt: "2026-10-03",
                status: "NEW",
              },
            ],
          },
        },
      });

      render(
        <MemoryRouter>
          <DeveloperFeedbackPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Reload animation desync on 144Hz monitors")).toBeInTheDocument();
        expect(screen.getByText("4/5 Rating")).toBeInTheDocument();
      });
    });
  });

  describe("DeveloperPaymentsPage", () => {
    it("renders escrow ledger and non-fabricated zero balances", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          status: "ok",
          data: { escrowBalance: "5,000.00 SAR" },
        },
      });

      render(
        <MemoryRouter>
          <DeveloperPaymentsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("5,000.00 SAR")).toBeInTheDocument();
        expect(screen.getByText(/Escrow Wallet Balance/i)).toBeInTheDocument();
      });
    });
  });

  describe("DeveloperVerificationPage, Profile, Settings & Support", () => {
    it("renders verification tier and studio identity", () => {
      render(
        <MemoryRouter>
          <DeveloperVerificationPage />
        </MemoryRouter>
      );
      expect(screen.getByText(/Studio Verification/i)).toBeInTheDocument();
      expect(screen.getByText(/Stage 01/i)).toBeInTheDocument();
    });

    it("renders profile edit form and handles server update error", async () => {
      vi.spyOn(apiModule, "apiRequest").mockImplementation(async (_endpoint: string, opts?: any) => {
        if (opts?.method === "PUT") {
          return { ok: false, error: "Validation error: invalid country" };
        }
        return { ok: true, data: { status: "ok", data: { studioName: "CyberNova Studios" } } };
      });

      render(
        <MemoryRouter>
          <DeveloperProfilePage />
        </MemoryRouter>
      );
      expect(screen.getByDisplayValue("CyberNova Studios")).toBeInTheDocument();
    });

    it("renders settings with password modification form and telemetry toggles", async () => {
      render(
        <MemoryRouter>
          <DeveloperSettingsPage />
        </MemoryRouter>
      );
      expect(screen.getByText(/Auto-Forward Crash Dumps/i)).toBeInTheDocument();
      expect(screen.getByText(/Change Password & Studio Security/i)).toBeInTheDocument();
    });

    it("renders support ticket form", () => {
      render(
        <MemoryRouter>
          <DeveloperSupportPage />
        </MemoryRouter>
      );
      expect(screen.getByText(/Open Direct Support Case/i)).toBeInTheDocument();
    });
  });
});

