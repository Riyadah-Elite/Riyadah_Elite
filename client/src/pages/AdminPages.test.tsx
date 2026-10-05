import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { AdminFounderCommandPage } from "./admin/AdminFounderCommandPage";
import { AdminViceCommandPage } from "./admin/AdminViceCommandPage";
import { AdminUserManagementPage } from "./admin/AdminUserManagementPage";
import { AdminDeveloperManagementPage } from "./admin/AdminDeveloperManagementPage";
import { AdminTournamentArbiterPage } from "./admin/AdminTournamentArbiterPage";
import { AdminFinancePage } from "./admin/AdminFinancePage";
import { AdminTrustSafetyPage } from "./admin/AdminTrustSafetyPage";
import { AdminVerificationPage } from "./admin/AdminVerificationPage";
import { AdminHrPeopleCulturePage } from "./admin/AdminHrPeopleCulturePage";
import { AdminPlatformOpsPage } from "./admin/AdminPlatformOpsPage";
import { AdminContentManagementPage } from "./admin/AdminContentManagementPage";
import * as apiModule from "../lib/api";

describe("Internal Admin Workspace Pages (Phase 5A)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.setItem("riyadah_auth_token", "fake-admin-jwt");
  });

  describe("AdminLayout", () => {
    it("renders admin navigation with all 10 areas and role badges", () => {
      render(
        <MemoryRouter initialEntries={["/admin/founder"]}>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="founder" element={<div>Founder Test</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getAllByText(/RIYADAH ELITE/i).length).toBeGreaterThan(0);
      expect(screen.getByText("Founder Command")).toBeInTheDocument();
      expect(screen.getByText("Vice Admin Command")).toBeInTheDocument();
      expect(screen.getByText("User Management")).toBeInTheDocument();
      expect(screen.getByText("Developer Management")).toBeInTheDocument();
      expect(screen.getByText("Tournament Arbiter")).toBeInTheDocument();
      expect(screen.getByText("Finance & Escrow")).toBeInTheDocument();
      expect(screen.getByText("Trust & Safety")).toBeInTheDocument();
      expect(screen.getByText("Verification Review")).toBeInTheDocument();
      expect(screen.getByText("HR & People")).toBeInTheDocument();
      expect(screen.getByText("Platform Operations")).toBeInTheDocument();
      expect(screen.getByText("Content Management")).toBeInTheDocument();
    });
  });

  describe("AdminFounderCommandPage", () => {
    it("renders founder command center with metrics and alerts on API response", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          authLevel: 5,
          operatorName: "Fahad Al-Saud",
          operatorTitle: "Founder & Super Admin",
          systemMetrics: {
            totalRegisteredUsers: 142850,
            activePlaytestSessions: 84,
            liveTournamentsCount: 16,
            openReportsQueue: 3,
            activeDevelopersCount: 412,
            escrowSecuredSAR: 1250000,
            systemHealthScore: 100,
          },
          criticalEscrowLocks: [
            {
              id: "lock_1",
              refCode: "VAL-902",
              title: "Tournament Match #VAL-2026-902 Escrow Lock",
              amountSAR: 4500,
              reason: "Roster substitution flag",
              flaggedAt: "2026-10-04T12:00:00Z",
              status: "FROZEN",
            },
          ],
          pendingFounderAuthorizations: [],
          staffGovernanceEvents: [],
        },
      });

      render(
        <MemoryRouter>
          <AdminFounderCommandPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Founder Command Center")).toBeInTheDocument();
        expect(screen.getByText(/142,850|142850/)).toBeInTheDocument();
        expect(screen.getByText(/VAL-902/)).toBeInTheDocument();
      });
    });

    it("renders truthful unavailable message when API is pending", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: false,
        error: "Founder Executive API currently offline (Pending Phase 5B Backend)",
      });

      render(
        <MemoryRouter>
          <AdminFounderCommandPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Backend Contract Pending/i)).toBeInTheDocument();
      });
    });
  });

  describe("AdminViceCommandPage", () => {
    it("renders vice admin command center with department inboxes", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          authLevel: 4,
          operatorName: "Nasser Al-Husseini",
          operatorTitle: "Co-Founder",
          operationalMetrics: {
            totalRegisteredUsers: 142850,
            activePlaytestSessions: 84,
            liveTournamentsCount: 16,
            openReportsQueue: 3,
            activeDevelopersCount: 412,
            escrowSecuredSAR: 1250000,
            systemHealthScore: 100,
          },
          urgentAttentionItems: [],
          departmentQueues: [
            { department: "Trust & Safety Desk", pendingCount: 3, slaStatus: "HEALTHY", leadContact: "Faisal" },
          ],
          recentAuditStream: [],
        },
      });

      render(
        <MemoryRouter>
          <AdminViceCommandPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Operations Command Center")).toBeInTheDocument();
        expect(screen.getByText("Trust & Safety Desk")).toBeInTheDocument();
      });
    });
  });

  describe("AdminUserManagementPage", () => {
    it("renders user directory table with search and filters", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          users: [
            {
              id: "usr_1",
              fullName: "Sara Al-Otaibi",
              username: "sara_gamer",
              email: "sara@riyadah.sa",
              role: "PLAYER",
              status: "ACTIVE",
              isVerified: true,
              country: "SA",
              totalTournamentsJoined: 12,
              conductScore: 98,
              createdAt: "2026-01-15T00:00:00Z",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminUserManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("User Directory & Conduct Ledger")).toBeInTheDocument();
        expect(screen.getByText("Sara Al-Otaibi")).toBeInTheDocument();
        expect(screen.getByText("@sara_gamer • sara@riyadah.sa")).toBeInTheDocument();
      });
    });
  });

  describe("AdminDeveloperManagementPage", () => {
    it("renders developer studios and accreditation directory", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          developers: [
            {
              id: "dev_1",
              studioName: "Riyadh Interactive Studios",
              contactName: "Tariq Al-Badr",
              email: "tariq@riyadhstudios.sa",
              crNumber: "CR-1010-8921",
              status: "VERIFIED",
              submittedGamesCount: 4,
              activeCampaignsCount: 2,
              totalPayoutsSAR: 125000,
              country: "SA",
              registeredAt: "2026-02-10T00:00:00Z",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminDeveloperManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Developer Ecosystem & Game Testing Operations")).toBeInTheDocument();
        expect(screen.getByText("Riyadh Interactive Studios")).toBeInTheDocument();
        expect(screen.getByText("CR-1010-8921")).toBeInTheDocument();
      });
    });
  });

  describe("AdminTournamentArbiterPage", () => {
    it("renders tournament arbiter desk with dispute queues", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          tournaments: [
            {
              id: "trn_1",
              title: "Saudi National Valorant Masters",
              game: "Valorant",
              organizerName: "Riyadh Esports Federation",
              format: "5v5 Single Elimination",
              status: "SANCTIONED",
              participantsCount: 64,
              maxParticipants: 64,
              prizePoolSAR: 50000,
              activeDisputesCount: 0,
              scheduledDate: "2026-10-15",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminTournamentArbiterPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Tournament Operations & Bracket Command Center")).toBeInTheDocument();
        expect(screen.getByText("Saudi National Valorant Masters")).toBeInTheDocument();
      });
    });
  });

  describe("AdminFinancePage", () => {
    it("renders finance overview and ledger entries", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          totalEscrowBalanceSAR: 1850000,
          pendingDisbursementsSAR: 240000,
          settledTransactionsCount: 1420,
          activeGatewayDisputesCount: 2,
          vatLiabilitySAR: 36000,
          transactions: [
            {
              id: "tx_1",
              reference: "TX-2026-89201",
              type: "DEVELOPER_PAYOUT",
              beneficiary: "Desert Games FZ",
              amountSAR: 45000,
              channel: "MADA",
              status: "SETTLED",
              createdAt: "2026-10-02T10:00:00Z",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminFinancePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Financial Operations & Settlement Command Center")).toBeInTheDocument();
        expect(screen.getByText("TX-2026-89201")).toBeInTheDocument();
        expect(screen.getByText("Desert Games FZ")).toBeInTheDocument();
      });
    });
  });

  describe("AdminTrustSafetyPage", () => {
    it("renders trust and safety cases table", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          reports: [
            {
              id: "ts_1",
              caseNumber: "CASE-9921",
              category: "ANTI_CHEAT_ANOMALY",
              severity: "CRITICAL",
              reportedUser: "aimbot_pro",
              reporter: "telemetry_heuristics",
              status: "OPEN",
              evidenceNotes: "Vanguard anomalous mouse velocity",
              createdAt: "2026-10-03T00:00:00Z",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminTrustSafetyPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Trust & Safety & Community Integrity Command")).toBeInTheDocument();
        expect(screen.getByText("CASE-9921")).toBeInTheDocument();
        expect(screen.getByText("@aimbot_pro")).toBeInTheDocument();
      });
    });
  });

  describe("AdminVerificationPage", () => {
    it("renders verification evidence queue", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          items: [
            {
              id: "vr_1",
              applicantType: "STUDIO_DEVELOPER",
              entityName: "Neom Gaming Labs",
              contactEmail: "legal@neomgaming.sa",
              documentType: "COMMERCIAL_REGISTRATION",
              status: "PENDING_REVIEW",
              submittedAt: "2026-10-01T00:00:00Z",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminVerificationPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Entity Verification & Compliance Review")).toBeInTheDocument();
        expect(screen.getByText("Neom Gaming Labs")).toBeInTheDocument();
      });
    });
  });

  describe("AdminHrPeopleCulturePage", () => {
    it("renders staff governance directory", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          staff: [
            {
              id: "st_1",
              fullName: "Faisal Al-Otaibi",
              email: "faisal.otaibi@riyadah.sa",
              title: "Lead T&S Manager",
              department: "TRUST_AND_SAFETY",
              clearanceLevel: 3,
              status: "ACTIVE",
              lastActiveAt: "2026-10-04T18:00:00Z",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminHrPeopleCulturePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Internal Staff Governance & Enclave Roles")).toBeInTheDocument();
        expect(screen.getByText("Faisal Al-Otaibi")).toBeInTheDocument();
        expect(screen.getByText("LEVEL 3")).toBeInTheDocument();
      });
    });
  });

  describe("AdminPlatformOpsPage", () => {
    it("renders platform operations service status cards", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          services: [
            {
              serviceName: "Matchmaking & Netcode Cluster",
              category: "MATCHMAKING_NETCODE",
              uptimePercentage: 99.98,
              status: "HEALTHY",
              latencyMs: 7,
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminPlatformOpsPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Platform Operations Command Center")).toBeInTheDocument();
        expect(screen.getByText("Matchmaking & Netcode Cluster")).toBeInTheDocument();
      });
    });
  });

  describe("AdminContentManagementPage", () => {
    it("renders content registry and editorial curation items", async () => {
      vi.spyOn(apiModule, "apiRequest").mockResolvedValue({
        ok: true,
        data: {
          items: [
            {
              id: "cnt_1",
              title: "Saudi National Esports League 2026 Kickoff",
              contentType: "ANNOUNCEMENT",
              targetPlacement: "HOMEPAGE",
              status: "PUBLISHED",
              authorName: "Zaid Al-Harthy",
              publishedAt: "2026-10-01T10:00:00Z",
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminContentManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Public Experience & Discovery CMS Command Center")).toBeInTheDocument();
        expect(screen.getByText("Saudi National Esports League 2026 Kickoff")).toBeInTheDocument();
      });
    });
  });
});
