import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { generateAuthToken } from "./lib/security.js";

describe("Developer Workspace Backend API Endpoints (Phase 3B)", () => {
  const devUser = {
    userId: "usr-dev-999",
    email: "dev@cybernovagames.com",
    username: "cybernova",
    role: "DEVELOPER",
  };

  const playerUser = {
    userId: "usr-player-111",
    email: "player@riyadahelite.com",
    username: "player_one",
    role: "PLAYER",
  };

  const devToken = generateAuthToken(devUser);
  const playerToken = generateAuthToken(playerUser);

  const mockGame = {
    id: "game-cyber-strike",
    slug: "cyber-strike-alpha",
    title: "Cyber Strike",
    studio: "cybernova",
    genre: "Tactical FPS",
    platform: "PC Windows",
    stage: "Beta",
    version: "v0.9.0",
    description: "Multiplayer combat testing arena with active network telemetry.",
    focusAreas: ["Netcode", "Hit Registration"],
    requirements: ["DirectX 12", "16GB RAM"],
    capacity: 250,
    rewardText: "Exclusive Beta Tester Tag",
    imageUrl: null,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 86400000),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Security & Role Verification", () => {
    it("rejects unauthenticated requests with 401", async () => {
      const res = await request(app).get("/api/v1/developer/overview");
      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
    });

    it("rejects non-developer accounts with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/v1/developer/overview")
        .set("Authorization", `Bearer ${playerToken}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toContain("Developer privileges required");
    });
  });

  describe("A. Developer Overview (GET /api/v1/developer/overview)", () => {
    it("returns developer overview with genuine database aggregations", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: devUser.userId,
        fullName: "CyberNova Interactive",
        username: "cybernova",
        email: devUser.email,
        passwordHash: "hash",
        role: "DEVELOPER",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          id: "prof-1",
          userId: devUser.userId,
          bio: "Indie Game Studio",
          country: "Saudi Arabia",
          city: "Riyadh",
          primaryPlatform: "PC Windows",
          favoriteGenres: ["FPS"],
          hardwareGpu: null,
          hardwareCpu: null,
          hardwareRam: null,
          hardwareOs: null,
          testerScore: 0,
          totalGamesTested: 0,
          avatarUrl: null,
          discordHandle: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as any);

      vi.spyOn(prisma.gameOpportunity, "findMany").mockResolvedValue([
        { ...mockGame, _count: { applications: 12 } },
      ] as any);

      const res = await request(app)
        .get("/api/v1/developer/overview")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.developerName).toBe("CyberNova Interactive");
      expect(res.body.data.tier).toContain("Tier-1");
      expect(res.body.data.metrics.totalGames).toBe(1);
      expect(res.body.data.metrics.activeTesters).toBe(12);
    });
  });

  describe("B. Game Management (GET/POST /api/v1/developer/games)", () => {
    it("lists games owned by the authenticated developer", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: devUser.userId,
        fullName: "CyberNova Interactive",
        username: "cybernova",
      } as any);

      vi.spyOn(prisma.gameOpportunity, "findMany").mockResolvedValue([
        { ...mockGame, _count: { applications: 5 } },
      ] as any);

      const res = await request(app)
        .get("/api/v1/developer/games")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.games).toHaveLength(1);
      expect(res.body.data.games[0].title).toBe("Cyber Strike");
    });

    it("registers new game with validation and unique slug creation", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: devUser.userId,
        fullName: "CyberNova Interactive",
        username: "cybernova",
      } as any);

      vi.spyOn(prisma.gameOpportunity, "create").mockResolvedValue({
        ...mockGame,
        id: "game-new-123",
        title: "Dune Raiders",
      } as any);

      const res = await request(app)
        .post("/api/v1/developer/games")
        .set("Authorization", `Bearer ${devToken}`)
        .send({
          title: "Dune Raiders",
          genre: "Action RPG",
          platform: "PC Windows",
          description: "Multiplayer survival sandbox set in the Rub al Khali.",
          capacity: 150,
          focusAreas: ["Inventory Sync"],
          requirements: ["16GB RAM"],
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.game.title).toBe("Dune Raiders");
    });

    it("retrieves game details by ID", async () => {
      vi.spyOn(prisma.gameOpportunity, "findFirst").mockResolvedValue({
        ...mockGame,
        _count: { applications: 15 },
      } as any);

      const res = await request(app)
        .get("/api/v1/developer/games/game-cyber-strike")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.game.title).toBe("Cyber Strike");
      expect(res.body.data.game.totalTestersCount).toBe(15);
    });
  });

  describe("C. Testing Campaigns (GET/POST /api/v1/developer/campaigns)", () => {
    it("lists campaigns linked to developer builds", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: devUser.userId,
        fullName: "CyberNova Interactive",
        username: "cybernova",
      } as any);

      vi.spyOn(prisma.gameOpportunity, "findMany").mockResolvedValue([
        { ...mockGame, _count: { applications: 8 } },
      ] as any);

      const res = await request(app)
        .get("/api/v1/developer/campaigns")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.campaigns).toHaveLength(1);
      expect(res.body.data.campaigns[0].enrolledTesters).toBe(8);
    });

    it("creates a new testing sprint campaign", async () => {
      vi.spyOn(prisma.gameOpportunity, "findUnique").mockResolvedValue(mockGame as any);
      vi.spyOn(prisma.gameOpportunity, "update").mockResolvedValue({
        ...mockGame,
        capacity: 100,
      } as any);

      const res = await request(app)
        .post("/api/v1/developer/campaigns")
        .set("Authorization", `Bearer ${devToken}`)
        .send({
          gameId: "game-cyber-strike",
          title: "Sprint 02: Netcode Hitreg",
          targetTesters: 100,
          primaryFocus: "Tickrate Optimization",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.campaign.title).toBe("Sprint 02: Netcode Hitreg");
    });
  });

  describe("D. Testers and Privacy (GET /api/v1/developer/testers)", () => {
    it("returns pseudonymized tester list without exposing private user emails", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: devUser.userId,
        fullName: "CyberNova Interactive",
        username: "cybernova",
      } as any);

      vi.spyOn(prisma.gameTestingApplication, "findMany").mockResolvedValue([
        {
          id: "app-test-1",
          opportunityId: "game-cyber-strike",
          userId: "usr-player-111",
          status: "ACCEPTED",
          platform: "PC Windows",
          agreedNda: true,
          createdAt: new Date(),
          opportunity: { title: "Cyber Strike" },
          user: { username: "falcon_sniper" },
        },
      ] as any);

      const res = await request(app)
        .get("/api/v1/developer/testers")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.testers).toHaveLength(1);
      expect(res.body.data.testers[0].testerTag).toBe("falcon_sniper");
      expect(res.body.data.testers[0].ndaSigned).toBe(true);
      // Ensure private email is not in the response payload
      expect(JSON.stringify(res.body)).not.toContain("player@riyadahelite.com");
    });
  });

  describe("E. Studio Verification & Profile (GET/PUT)", () => {
    it("returns verified studio badge and node status", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: devUser.userId,
        isVerified: true,
      } as any);

      const res = await request(app)
        .get("/api/v1/developer/verification")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isVerified).toBe(true);
      expect(res.body.data.tier).toContain("Tier-1");
    });

    it("updates developer studio profile", async () => {
      vi.spyOn(prisma, "$transaction").mockImplementation(async (cb: any) => {
        return cb({
          user: { update: vi.fn() },
          playerProfile: { upsert: vi.fn() },
        });
      });

      const res = await request(app)
        .put("/api/v1/developer/profile")
        .set("Authorization", `Bearer ${devToken}`)
        .send({
          studioName: "CyberNova Interactive",
          city: "Riyadh",
          country: "Saudi Arabia",
          bio: "Specialized in real-time esports engines.",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Studio profile updated");
    });

    it("submits verification application for administrative review", async () => {
      vi.spyOn(prisma, "$transaction").mockImplementation(async (cb: any) => {
        return cb({
          user: { update: vi.fn() },
          playerProfile: { upsert: vi.fn() },
        });
      });

      const res = await request(app)
        .post("/api/v1/developer/verification")
        .set("Authorization", `Bearer ${devToken}`)
        .send({
          entityType: "STUDIO",
          legalEntityName: "CyberNova Studios LLC",
          registrationNumber: "CR-1010-849204",
          taxId: "300492819200003",
          registeredAddress: "Riyadh Digital City, Building B4, Level 3",
          country: "Saudi Arabia",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.status).toBe("UNDER_REVIEW");
    });
  });

  describe("F. Support & Dispute Cases (GET/POST /api/v1/developer/support)", () => {
    it("returns developer's support ticket history", async () => {
      const res = await request(app)
        .get("/api/v1/developer/support")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.tickets).toBeInstanceOf(Array);
    });

    it("registers new support case with valid category", async () => {
      const res = await request(app)
        .post("/api/v1/developer/support")
        .set("Authorization", `Bearer ${devToken}`)
        .send({
          category: "TECHNICAL",
          subject: "Crash dump telemetry webhook configuration",
          description: "Need guidance on routing crash logs to our dedicated Jira instance.",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.ticketId).toMatch(/^TICK-/);
      expect(res.body.data.status).toBe("OPEN");
    });
  });

  describe("G. Game Update/Delete & QA Feedback Endpoints", () => {
    it("updates a game with ownership verification", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({ id: devUser.userId, username: devUser.username, fullName: "CyberNova" } as any);
      vi.spyOn(prisma.gameOpportunity, "findFirst").mockResolvedValue({ ...mockGame, studio: devUser.username } as any);
      vi.spyOn(prisma.gameOpportunity, "update").mockResolvedValue({ ...mockGame, title: "Cyber Strike Remastered" } as any);

      const res = await request(app)
        .put(`/api/v1/developer/games/${mockGame.id}`)
        .set("Authorization", `Bearer ${devToken}`)
        .send({ title: "Cyber Strike Remastered" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.game.title).toBe("Cyber Strike Remastered");
    });

    it("rejects game update if not the owning studio", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({ id: devUser.userId, username: devUser.username, fullName: "CyberNova" } as any);
      vi.spyOn(prisma.gameOpportunity, "findFirst").mockResolvedValue({ ...mockGame, studio: "other_studio" } as any);

      const res = await request(app)
        .put(`/api/v1/developer/games/${mockGame.id}`)
        .set("Authorization", `Bearer ${devToken}`)
        .send({ title: "Hack Attempt" });

      expect(res.status).toBe(403);
    });

    it("updates tester application status (approve tester)", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({ id: devUser.userId, username: devUser.username, fullName: "CyberNova" } as any);
      vi.spyOn(prisma.gameTestingApplication, "findUnique").mockResolvedValue({
        id: "app-101",
        opportunity: { studio: devUser.username },
      } as any);
      vi.spyOn(prisma.gameTestingApplication, "update").mockResolvedValue({
        id: "app-101",
        status: "ACCEPTED",
      } as any);

      const res = await request(app)
        .patch("/api/v1/developer/testers/app-101")
        .set("Authorization", `Bearer ${devToken}`)
        .send({ status: "ACCEPTED" });

      expect(res.status).toBe(200);
      expect(res.body.data.application.status).toBe("ACCEPTED");
    });

    it("retrieves bug feedback reports for the developer's game", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({ id: devUser.userId, username: devUser.username, fullName: "CyberNova" } as any);
      vi.spyOn(prisma.bugReport, "findMany").mockResolvedValue([
        {
          id: "bug-42",
          title: "Memory leak during boss fight",
          summary: "VRAM climbing",
          description: "VRAM climbs from 4GB to 12GB during phase 2",
          severity: "CRITICAL",
          status: "OPEN",
          reproductionSteps: "Enter arena with RTX 3080",
          mediaUrls: [],
          systemSpecs: null,
          createdAt: new Date(),
          opportunity: { id: mockGame.id, title: mockGame.title, slug: mockGame.slug },
          user: { id: "u-1", username: "apex_tester" },
        },
      ] as any);

      const res = await request(app)
        .get("/api/v1/developer/feedback")
        .set("Authorization", `Bearer ${devToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.feedback).toHaveLength(1);
      expect(res.body.data.feedback[0].title).toBe("Memory leak during boss fight");
      expect(res.body.data.feedback[0].severity).toBe("CRITICAL");
    });

    it("updates bug report status (e.g. to INVESTIGATING)", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({ id: devUser.userId, username: devUser.username, fullName: "CyberNova" } as any);
      vi.spyOn(prisma.bugReport, "findUnique").mockResolvedValue({
        id: "bug-42",
        opportunity: { studio: devUser.username },
      } as any);
      vi.spyOn(prisma.bugReport, "update").mockResolvedValue({
        id: "bug-42",
        status: "INVESTIGATING",
      } as any);

      const res = await request(app)
        .patch("/api/v1/developer/feedback/bug-42")
        .set("Authorization", `Bearer ${devToken}`)
        .send({ status: "INVESTIGATING" });

      expect(res.status).toBe(200);
      expect(res.body.data.bugReport.status).toBe("INVESTIGATING");
    });
  });
});

