import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { generateAuthToken } from "./lib/security.js";

describe("Tournament APIs & Registration Endpoints", () => {
  const testUser = {
    userId: "usr-player-123",
    email: "player.one@riyadahelite.com",
    username: "player_one",
    role: "PLAYER",
  };

  const validToken = generateAuthToken(testUser);

  const mockTournament = {
    id: "tourn-valorant-cup",
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
    registrationDeadline: new Date(Date.now() + 864000000),
    startDate: new Date(Date.now() + 1728000000),
    endDate: new Date(Date.now() + 2592000000),
    rules: ["Fair play and anti-cheat compliance mandatory", "All 5 squad players must be MENA residents"],
    description: "The premier competitive Valorant community tournament in the Kingdom.",
    bannerUrl: "https://example.com/valorant-cup.jpg",
    discordUrl: "https://discord.gg/riyadah-elite",
    status: "REGISTRATION_OPEN",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Public Tournament Discovery & Details", () => {
    it("returns list of published tournaments with accurate participant count", async () => {
      vi.spyOn(prisma.tournament, "findMany").mockResolvedValue([
        {
          ...mockTournament,
          _count: { registrations: 12 },
        },
      ] as any);

      const res = await request(app).get("/api/v1/tournaments");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.tournaments).toHaveLength(1);
      expect(res.body.data.tournaments[0].participantCount).toBe(12);
      expect(res.body.data.tournaments[0].title).toBe("Valorant Champions Cup Saudi");
    });

    it("returns single tournament details by slug or id", async () => {
      vi.spyOn(prisma.tournament, "findFirst").mockResolvedValue({
        ...mockTournament,
        _count: { registrations: 32 },
      } as any);

      const res = await request(app).get("/api/v1/tournaments/valorant-champions-cup-saudi");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.tournament.participantCount).toBe(32);
      expect(res.body.data.tournament.isFull).toBe(false);
    });

    it("returns 404 when tournament does not exist", async () => {
      vi.spyOn(prisma.tournament, "findFirst").mockResolvedValue(null);

      const res = await request(app).get("/api/v1/tournaments/unknown-tourney");
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("returns 404 when tournament is in DRAFT state", async () => {
      vi.spyOn(prisma.tournament, "findFirst").mockResolvedValue({
        ...mockTournament,
        status: "DRAFT",
        _count: { registrations: 0 },
      } as any);

      const res = await request(app).get("/api/v1/tournaments/valorant-champions-cup-saudi");
      expect(res.status).toBe(404);
    });
  });

  describe("Tournament Registration Endpoint", () => {
    it("rejects unauthenticated registration attempts", async () => {
      const res = await request(app)
        .post("/api/v1/tournaments/tourn-valorant-cup/register")
        .send({
          inGameHandle: "ViperMain#EUW",
          preferredRoles: ["Controller"],
          agreedRules: true,
          agreedAntiCheat: true,
        });

      expect(res.status).toBe(401);
    });

    it("successfully registers authenticated player in atomic transaction", async () => {
      vi.spyOn(prisma.tournament, "findFirst").mockResolvedValue({
        ...mockTournament,
        _count: { registrations: 20 },
      } as any);

      vi.spyOn(prisma.tournamentRegistration, "findUnique").mockResolvedValue(null);

      const mockCreatedReg = {
        id: "treg-abc-123",
        tournamentId: mockTournament.id,
        userId: testUser.userId,
        registrationMode: "SOLO",
        status: "CONFIRMED",
        inGameHandle: "JettSaudi#KSA",
        preferredRoles: ["Duelist"],
        ticketCode: "TCK-8921-X",
        createdAt: new Date(),
      };

      vi.spyOn(prisma, "$transaction").mockImplementation(async (cb: any) => {
        return cb({
          tournamentRegistration: {
            count: vi.fn().mockResolvedValue(20),
            create: vi.fn().mockResolvedValue(mockCreatedReg),
          },
        });
      });

      const res = await request(app)
        .post("/api/v1/tournaments/tourn-valorant-cup/register")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          registrationMode: "SOLO",
          inGameHandle: "JettSaudi#KSA",
          preferredRoles: ["Duelist"],
          agreedRules: true,
          agreedAntiCheat: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.registration.id).toBe("treg-abc-123");
    });

    it("rejects duplicate registration with HTTP 409 Conflict", async () => {
      vi.spyOn(prisma.tournament, "findFirst").mockResolvedValue({
        ...mockTournament,
        _count: { registrations: 20 },
      } as any);

      vi.spyOn(prisma.tournamentRegistration, "findUnique").mockResolvedValue({
        id: "existing-reg",
        userId: testUser.userId,
        tournamentId: mockTournament.id,
      } as any);

      const res = await request(app)
        .post("/api/v1/tournaments/tourn-valorant-cup/register")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          registrationMode: "SOLO",
          inGameHandle: "JettSaudi#KSA",
          preferredRoles: ["Duelist"],
          agreedRules: true,
          agreedAntiCheat: true,
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already registered/i);
    });

    it("rejects registration when tournament is full", async () => {
      vi.spyOn(prisma.tournament, "findFirst").mockResolvedValue({
        ...mockTournament,
        maxParticipants: 64,
        _count: { registrations: 64 },
      } as any);

      const res = await request(app)
        .post("/api/v1/tournaments/tourn-valorant-cup/register")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          registrationMode: "SOLO",
          inGameHandle: "JettSaudi#KSA",
          preferredRoles: ["Duelist"],
          agreedRules: true,
          agreedAntiCheat: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/maximum participant capacity/i);
    });

    it("rejects registration when tournament status is not REGISTRATION_OPEN", async () => {
      vi.spyOn(prisma.tournament, "findFirst").mockResolvedValue({
        ...mockTournament,
        status: "REGISTRATION_CLOSED",
        _count: { registrations: 20 },
      } as any);

      const res = await request(app)
        .post("/api/v1/tournaments/tourn-valorant-cup/register")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          registrationMode: "SOLO",
          inGameHandle: "JettSaudi#KSA",
          preferredRoles: ["Duelist"],
          agreedRules: true,
          agreedAntiCheat: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Registration is not open/i);
    });
  });

  describe("Player Tournament Participation Endpoint", () => {
    it("returns player registered tournaments with status categorization", async () => {
      vi.spyOn(prisma.tournamentRegistration, "findMany").mockResolvedValue([
        {
          id: "reg-1",
          userId: testUser.userId,
          status: "CONFIRMED",
          inGameHandle: "ReynaAce#MENA",
          tournament: {
            ...mockTournament,
            status: "REGISTRATION_OPEN",
            _count: { registrations: 16 },
          },
        },
      ] as any);

      const res = await request(app)
        .get("/api/v1/player/tournaments")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.registrations).toHaveLength(1);
      expect(res.body.data.metrics.total).toBe(1);
      expect(res.body.data.metrics.upcoming).toBe(1);
      expect(res.body.data.registrations[0].tournament.participantCount).toBe(16);
    });
  });
});
