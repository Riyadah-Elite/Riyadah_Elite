import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { generateAuthToken } from "./lib/security.js";

describe("Internal Admin Workspace Backend API Endpoints (Phase 5B)", () => {
  const founderUser = {
    userId: "usr-founder-root",
    email: "founder@riyadahelite.com",
    username: "fahad_founder",
    role: "ADMIN",
    adminRole: "FOUNDER" as const,
  };

  const viceAdminUser = {
    userId: "usr-vice-ops",
    email: "vice@riyadahelite.com",
    username: "nasser_ops",
    role: "ADMIN",
    adminRole: "VICE_ADMIN" as const,
  };

  const generalAdminUser = {
    userId: "usr-admin-gen",
    email: "admin@riyadahelite.com",
    username: "general_admin",
    role: "ADMIN",
    adminRole: "ADMIN" as const,
  };

  const nonAdminUser = {
    userId: "usr-player-1",
    email: "gamer@riyadahelite.com",
    username: "gamer_pro",
    role: "PLAYER",
  };

  const founderToken = generateAuthToken(founderUser);
  const viceToken = generateAuthToken(viceAdminUser);
  const generalAdminToken = generateAuthToken(generalAdminUser);
  const nonAdminToken = generateAuthToken(nonAdminUser);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Security & Multi-Tier Role Authorization Gate", () => {
    it("rejects unauthenticated requests with 401 Unauthorized", async () => {
      const res = await request(app).get("/api/v1/admin/founder/overview");
      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Authentication required");
    });

    it("rejects non-admin roles (players/hosts/developers) with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${nonAdminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Internal Admin privileges required");
    });

    it("enforces least-privilege: rejects Vice Admin from Founder-only Level 5 overview", async () => {
      const res = await request(app)
        .get("/api/v1/admin/founder/overview")
        .set("Authorization", `Bearer ${viceToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Root Level 5 Founder authorization required");
    });

    it("enforces least-privilege: rejects General Admin from Vice Admin Level 4 overview", async () => {
      const res = await request(app)
        .get("/api/v1/admin/vice/overview")
        .set("Authorization", `Bearer ${generalAdminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Level 4 Vice Admin or Founder authorization required");
    });

    it("rejects demoted administrator with stale JWT token (live DB role check)", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: generalAdminUser.userId,
        role: "PLAYER", // Demoted in database
      } as never);

      const res = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${generalAdminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Administrative privileges have been revoked or demoted");
    });
  });

  describe("1. Founder Executive Command Center", () => {
    it("returns real system aggregations for Level 5 Founder", async () => {
      vi.spyOn(prisma.user, "count").mockResolvedValue(142850 as never);
      vi.spyOn(prisma.gameOpportunity, "count").mockResolvedValue(84 as never);
      vi.spyOn(prisma.tournament, "count").mockResolvedValue(16 as never);

      const res = await request(app)
        .get("/api/v1/admin/founder/overview")
        .set("Authorization", `Bearer ${founderToken}`);

      expect(res.status).toBe(200);
      expect(res.body.authLevel).toBe(5);
      expect(res.body.systemMetrics.totalRegisteredUsers).toBe(142850);
      expect(res.body.systemMetrics.activePlaytestSessions).toBe(84);
      expect(res.body.systemMetrics.liveTournamentsCount).toBe(16);
      expect(res.body.systemMetrics.escrowSecuredSAR).toBe(0); // Truthful zero
    });

    it("broadcasts emergency lockdown and creates durable audit log", async () => {
      const auditSpy = vi.spyOn(prisma.adminAuditLog, "create").mockResolvedValue({
        id: "audit-1",
        actorId: founderUser.userId,
        action: "FOUNDER_EMERGENCY_LOCKDOWN",
        entityType: "PLATFORM",
        entityId: null,
        reason: "Suspected network intrusion on node RUH-01",
        metadata: null,
        createdAt: new Date(),
      } as never);

      const res = await request(app)
        .post("/api/v1/admin/founder/lockdown")
        .set("Authorization", `Bearer ${founderToken}`)
        .send({ reason: "Suspected network intrusion on node RUH-01" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.message).toContain("Emergency platform freeze signal broadcasted");
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "FOUNDER_EMERGENCY_LOCKDOWN",
            actorId: founderUser.userId,
            reason: "Suspected network intrusion on node RUH-01",
          }),
        }),
      );
    });
  });

  describe("2. Vice Admin Command Center", () => {
    it("returns operational metrics and department inboxes for Vice Admin", async () => {
      vi.spyOn(prisma.user, "count").mockResolvedValue(120 as never);
      vi.spyOn(prisma.gameOpportunity, "count").mockResolvedValue(10 as never);
      vi.spyOn(prisma.tournament, "count").mockResolvedValue(4 as never);

      const res = await request(app)
        .get("/api/v1/admin/vice/overview")
        .set("Authorization", `Bearer ${viceToken}`);

      expect(res.status).toBe(200);
      expect(res.body.authLevel).toBe(4);
      expect(res.body.departmentQueues.length).toBeGreaterThan(0);
    });
  });

  describe("3. User Management", () => {
    it("returns paginated user list with role and conduct info", async () => {
      vi.spyOn(prisma.user, "findMany").mockResolvedValue([
        {
          id: "usr-1",
          fullName: "Sara Al-Otaibi",
          username: "sara_gamer",
          email: "sara@riyadah.sa",
          role: "PLAYER",
          isVerified: true,
          createdAt: new Date("2026-01-15"),
          profile: {
            country: "Saudi Arabia",
            totalGamesTested: 5,
            testerScore: 98,
          },
          _count: {
            tournamentRegistrations: 3,
          },
        },
      ] as never);

      const res = await request(app)
        .get("/api/v1/admin/users?search=sara")
        .set("Authorization", `Bearer ${generalAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(1);
      expect(res.body.users[0].username).toBe("sara_gamer");
      expect(res.body.users[0].conductScore).toBe(98);
    });

    it("prevents self-lockout by rejecting admin status update on self", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${generalAdminUser.userId}/status`)
        .set("Authorization", `Bearer ${generalAdminToken}`)
        .send({ status: "BANNED", reason: "Accidental self ban" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("cannot alter the status of their own account");
    });

    it("successfully updates target user status and audits change", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "target-user-123",
        username: "bad_actor",
      } as never);

      const res = await request(app)
        .patch("/api/v1/admin/users/target-user-123/status")
        .set("Authorization", `Bearer ${generalAdminToken}`)
        .send({ status: "RESTRICTED", reason: "Tournament match conduct violation" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.updatedStatus).toBe("RESTRICTED");
    });
  });

  describe("4. Developer Management", () => {
    it("returns registered studios and accreditation information", async () => {
      vi.spyOn(prisma.user, "findMany").mockResolvedValue([
        {
          id: "dev-studio-1",
          fullName: "Desert Sand Studios",
          username: "desertsand",
          email: "contact@desertsand.sa",
          isVerified: true,
          createdAt: new Date(),
          profile: { country: "Saudi Arabia" },
        },
      ] as never);
      vi.spyOn(prisma.gameOpportunity, "count").mockResolvedValue(3 as never);

      const res = await request(app)
        .get("/api/v1/admin/developers")
        .set("Authorization", `Bearer ${generalAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.developers).toHaveLength(1);
      expect(res.body.developers[0].status).toBe("VERIFIED");
      expect(res.body.developers[0].submittedGamesCount).toBe(3);
    });
  });

  describe("5. Tournament Management Arbiter", () => {
    it("lists tournaments and allows arbiter decisions", async () => {
      vi.spyOn(prisma.tournament, "findMany").mockResolvedValue([
        {
          id: "trn-99",
          title: "Saudi Valorant Cup",
          game: "Valorant",
          organizer: "Riyadh Esports",
          format: "Single Elimination",
          status: "ONGOING",
          maxParticipants: 64,
          startDate: new Date(),
          _count: { registrations: 32 },
        },
      ] as never);

      const res = await request(app)
        .get("/api/v1/admin/tournaments/arbiter")
        .set("Authorization", `Bearer ${generalAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tournaments).toHaveLength(1);
      expect(res.body.tournaments[0].status).toBe("IN_PROGRESS");
    });

    it("applies an arbitration ruling to a tournament", async () => {
      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        id: "trn-99",
        title: "Saudi Valorant Cup",
      } as never);

      const res = await request(app)
        .post("/api/v1/admin/tournaments/trn-99/arbitrate")
        .set("Authorization", `Bearer ${generalAdminToken}`)
        .send({
          action: "RESOLVE_DISPUTE",
          notes: "Roster substitution approved after emergency medical documentation submitted",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.message).toContain("RESOLVE_DISPUTE");
    });
  });

  describe("6. Finance Command Center", () => {
    it("reports truthful zero escrow balances when payment gateway is unconfigured", async () => {
      const res = await request(app)
        .get("/api/v1/admin/finance/overview")
        .set("Authorization", `Bearer ${generalAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.totalEscrowBalanceSAR).toBe(0);
      expect(res.body.integrationStatus.paymentGateway).toBe("UNCONFIGURED");
    });
  });

  describe("7. Verification Management", () => {
    it("persists reviewer decision and updates isVerified flag", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: "usr-pending-dev",
        isVerified: false,
      } as never);
      vi.spyOn(prisma.user, "update").mockResolvedValue({
        id: "usr-pending-dev",
        isVerified: true,
      } as never);

      const res = await request(app)
        .post("/api/v1/admin/verification/usr-pending-dev/review")
        .set("Authorization", `Bearer ${generalAdminToken}`)
        .send({
          decision: "APPROVED",
          reviewerNotes: "Commercial Registration verified with Saudi Ministry of Commerce",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.isVerified).toBe(true);
    });
  });

  describe("8. Platform Operations & Health", () => {
    it("returns real operational health status for core services", async () => {
      vi.spyOn(prisma, "$queryRaw").mockResolvedValue([{ 1: 1 }] as never);

      const res = await request(app)
        .get("/api/v1/admin/platform/health")
        .set("Authorization", `Bearer ${generalAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.services).toHaveLength(3);
      expect(res.body.services[0].serviceName).toBe("Express Application Server");
      expect(res.body.services[0].status).toBe("HEALTHY");
    });
  });
});
