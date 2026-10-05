import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { generateAuthToken } from "./lib/security.js";

describe("Player Workspace API Endpoints", () => {
  const testUser = {
    userId: "usr-player-123",
    email: "player.one@riyadahelite.com",
    username: "player_one",
    role: "PLAYER",
  };

  const validToken = generateAuthToken(testUser);

  const mockOpportunity = {
    id: "opp-cyber-strike",
    slug: "cyber-strike",
    title: "Cyber Strike",
    studio: "XYZ Studios",
    genre: "Tactical FPS",
    platform: "PC Windows",
    stage: "Beta",
    version: "v0.8.4",
    description: "Stress testing next-generation destructible cover systems and high-tickrate hitreg.",
    focusAreas: ["Netcode", "Hit Registration", "VRAM Stability"],
    requirements: ["DirectX 12", "GTX 1660+", "8GB RAM"],
    capacity: 500,
    rewardText: "SAR 1,500 Steam Voucher on verified bug report logs",
    imageUrl: "https://example.com/cyber-strike.png",
    status: "ACTIVE",
    startDate: new Date(),
    endDate: new Date(Date.now() + 864000000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Public Opportunity Discovery", () => {
    it("returns list of active game testing opportunities", async () => {
      vi.spyOn(prisma.gameOpportunity, "findMany").mockResolvedValue([
        { ...mockOpportunity, _count: { applications: 42 } },
      ] as any);

      const res = await request(app).get("/api/v1/player/opportunities");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.opportunities).toHaveLength(1);
      expect(res.body.data.opportunities[0].title).toBe("Cyber Strike");
      expect(res.body.data.opportunities[0]._count.applications).toBe(42);
    });

    it("returns opportunity details by slug", async () => {
      vi.spyOn(prisma.gameOpportunity, "findFirst").mockResolvedValue({
        ...mockOpportunity,
        _count: { applications: 42 },
      } as any);

      const res = await request(app).get("/api/v1/player/opportunities/cyber-strike");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.opportunity.slug).toBe("cyber-strike");
    });

    it("returns 404 when opportunity does not exist", async () => {
      vi.spyOn(prisma.gameOpportunity, "findFirst").mockResolvedValue(null);

      const res = await request(app).get("/api/v1/player/opportunities/non-existent-game");
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("Protected Player Overview & Profile", () => {
    it("rejects unauthenticated request to player overview", async () => {
      const res = await request(app).get("/api/v1/player/overview");
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/authentication required/i);
    });

    it("loads overview and real application metrics for authenticated player", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: testUser.userId,
        fullName: "Player One",
        username: testUser.username,
        email: testUser.email,
        role: "PLAYER",
        isVerified: true,
        createdAt: new Date(),
        profile: {
          id: "prof-1",
          userId: testUser.userId,
          testerScore: 92,
          totalGamesTested: 3,
        },
      } as any);

      vi.spyOn(prisma.gameTestingApplication, "findMany").mockResolvedValue([
        {
          id: "app-1",
          userId: testUser.userId,
          opportunityId: mockOpportunity.id,
          status: "ACCEPTED",
          opportunity: mockOpportunity,
          createdAt: new Date(),
        },
        {
          id: "app-2",
          userId: testUser.userId,
          opportunityId: "opp-2",
          status: "PENDING",
          opportunity: { ...mockOpportunity, id: "opp-2", title: "Project Alpha" },
          createdAt: new Date(),
        },
      ] as any);

      vi.spyOn(prisma.tournamentRegistration, "findMany").mockResolvedValue([
        {
          id: "treg-1",
          userId: testUser.userId,
          tournamentId: "t-1",
          status: "CONFIRMED",
          tournament: {
            id: "t-1",
            status: "REGISTRATION_OPEN",
          },
        },
      ] as any);

      const res = await request(app)
        .get("/api/v1/player/overview")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.user.username).toBe("player_one");
      expect(res.body.data.metrics.activeTests).toBe(1);
      expect(res.body.data.metrics.pendingApplications).toBe(1);
      expect(res.body.data.metrics.testerScore).toBe(92);
      expect(res.body.data.applications).toHaveLength(2);
    });

    it("updates player profile fields cleanly", async () => {
      vi.spyOn(prisma, "$transaction").mockImplementation(async (cb: any) => {
        return cb({
          user: {
            update: vi.fn().mockResolvedValue({}),
          },
          playerProfile: {
            upsert: vi.fn().mockResolvedValue({
              userId: testUser.userId,
              bio: "Dedicated competitive tester",
              primaryPlatform: "PC Windows",
              hardwareGpu: "RTX 4080",
              hardwareCpu: "Ryzen 9 7900X",
            }),
          },
        });
      });

      const res = await request(app)
        .put("/api/v1/player/profile")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          fullName: "Player Champion",
          bio: "Dedicated competitive tester",
          hardwareGpu: "RTX 4080",
          hardwareCpu: "Ryzen 9 7900X",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.message).toMatch(/updated successfully/i);
    });
  });

  describe("Application Submission Workflow", () => {
    it("submits application successfully and persists with PENDING status", async () => {
      vi.spyOn(prisma.gameOpportunity, "findUnique").mockResolvedValue(mockOpportunity as any);
      vi.spyOn(prisma, "$transaction").mockImplementation(async (cb: any) => {
        return cb({
          gameTestingApplication: {
            findUnique: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue({
              id: "app-new-123",
              userId: testUser.userId,
              opportunityId: mockOpportunity.id,
              status: "PENDING",
              platform: "PC Windows",
              hardwareGpu: "RTX 3070",
              hardwareCpu: "Ryzen 7 5800X",
              hardwareRam: "32GB",
              availabilityHours: "10-15 hrs/week",
              agreedNda: true,
              agreedTelemetry: true,
              opportunity: mockOpportunity,
            }),
          },
        });
      });

      const res = await request(app)
        .post("/api/v1/player/applications")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          opportunityId: mockOpportunity.id,
          platform: "PC Windows",
          primaryGames: ["Valorant", "Counter-Strike 2"],
          hardwareGpu: "RTX 3070",
          hardwareCpu: "Ryzen 7 5800X",
          hardwareRam: "32GB",
          availabilityHours: "10-15 hrs/week",
          experienceNotes: "Prior beta testing experience in competitive tactical shooters.",
          agreedNda: true,
          agreedTelemetry: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.application.status).toBe("PENDING");
    });

    it("prevents duplicate application submissions with HTTP 409", async () => {
      vi.spyOn(prisma.gameOpportunity, "findUnique").mockResolvedValue(mockOpportunity as any);
      vi.spyOn(prisma, "$transaction").mockImplementation(async (cb: any) => {
        return cb({
          gameTestingApplication: {
            findUnique: vi.fn().mockResolvedValue({
              id: "existing-app-id",
              userId: testUser.userId,
              opportunityId: mockOpportunity.id,
            }),
            create: vi.fn(),
          },
        });
      });

      const res = await request(app)
        .post("/api/v1/player/applications")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          opportunityId: mockOpportunity.id,
          platform: "PC Windows",
          primaryGames: ["Valorant"],
          hardwareGpu: "RTX 3070",
          hardwareCpu: "Ryzen 7 5800X",
          hardwareRam: "32GB",
          availabilityHours: "10-15 hrs/week",
          agreedNda: true,
          agreedTelemetry: true,
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already submitted an application/i);
    });

    it("rejects application when NDA or telemetry agreement is missing", async () => {
      const res = await request(app)
        .post("/api/v1/player/applications")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          opportunityId: mockOpportunity.id,
          platform: "PC Windows",
          primaryGames: ["Valorant"],
          hardwareGpu: "RTX 3070",
          hardwareCpu: "Ryzen 7 5800X",
          hardwareRam: "32GB",
          availabilityHours: "10-15 hrs/week",
          agreedNda: false,
          agreedTelemetry: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
});
