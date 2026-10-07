import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { generateAuthToken } from "./lib/security.js";

describe("Tournament Host Workspace Backend API Endpoints (Phase 4B)", () => {
  const hostUser = {
    userId: "usr-host-777",
    email: "tariq@riyadhesports.sa",
    username: "tariq_host",
    role: "HOST",
  };

  const devUser = {
    userId: "usr-dev-999",
    email: "dev@studio.com",
    username: "dev_user",
    role: "DEVELOPER",
  };

  const otherHostUser = {
    userId: "usr-host-888",
    email: "rival@esports.sa",
    username: "rival_host",
    role: "HOST",
  };

  const hostToken = generateAuthToken(hostUser);
  const devToken = generateAuthToken(devUser);
  const otherHostToken = generateAuthToken(otherHostUser);

  const mockTournament = {
    id: "tourn-saudi-cup",
    slug: "saudi-valorant-cup-2026",
    title: "Saudi Valorant Cup 2026",
    game: "Valorant",
    organizer: "tariq_host",
    format: "5v5 Single Elimination",
    bracketType: "Single Elimination",
    platform: "PC Windows",
    region: "Middle East / MENA",
    prizePool: "10,000 SAR",
    entryFee: "Free",
    teamSize: 5,
    maxParticipants: 32,
    registrationDeadline: new Date(Date.now() + 86400000),
    startDate: new Date(Date.now() + 172800000),
    endDate: new Date(Date.now() + 259200000),
    rules: ["Fair play and anti-cheat compliance mandatory", "5 players per team"],
    description: "Official competitive championship for collegiate and amateur teams.",
    bannerUrl: null,
    discordUrl: null,
    status: "REGISTRATION_OPEN",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // 1. SECURITY & ACCESS CONTROL
  // ==========================================
  describe("Security & Host Role Access Control", () => {
    it("rejects unauthenticated requests to host overview with 401", async () => {
      const res = await request(app).get("/api/v1/host/overview");
      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Authentication required");
    });

    it("rejects non-host accounts with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/v1/host/overview")
        .set("Authorization", `Bearer ${devToken}`);
      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Tournament Host privileges required");
    });
  });

  // ==========================================
  // 2. HOST OVERVIEW (GET /api/v1/host/overview)
  // ==========================================
  describe("Host Overview (GET /api/v1/host/overview)", () => {
    it("returns genuine dashboard metrics and tournaments for the authenticated host", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        fullName: "Tariq Al-Mansoor",
        username: "tariq_host",
        email: hostUser.email,
        passwordHash: "hash",
        role: "HOST",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          id: "prof-host-1",
          userId: hostUser.userId,
          bio: "Official tournament operations lead",
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
          discordHandle: "Tariq#0001",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as any);

      vi.spyOn(prisma.tournament, "findMany").mockResolvedValue([
        {
          ...mockTournament,
          _count: { registrations: 16 },
        },
      ] as any);

      vi.spyOn(prisma.tournamentRegistration, "count").mockResolvedValue(16);

      const res = await request(app)
        .get("/api/v1/host/overview")
        .set("Authorization", `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.hostName).toBe("Tariq Al-Mansoor");
      expect(res.body.data.tier).toBe("Tier-1 Verified Host");
      expect(res.body.data.metrics.totalTournaments).toBe(1);
      expect(res.body.data.metrics.activeTournaments).toBe(1);
      expect(res.body.data.metrics.totalParticipants).toBe(16);
      expect(res.body.data.metrics.escrowDisbursedSAR).toBe(0);
      expect(res.body.data.recentTournaments).toHaveLength(1);
      expect(res.body.data.recentTournaments[0].participantCount).toBe(16);
    });
  });

  // ==========================================
  // 3. TOURNAMENT LIST & CREATION
  // ==========================================
  describe("Tournament Management (GET & POST /api/v1/host/tournaments)", () => {
    it("returns list of host's own tournaments", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findMany").mockResolvedValue([
        {
          ...mockTournament,
          _count: { registrations: 8 },
        },
      ] as any);

      const res = await request(app)
        .get("/api/v1/host/tournaments")
        .set("Authorization", `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.tournaments).toHaveLength(1);
      expect(res.body.data.tournaments[0].title).toBe("Saudi Valorant Cup 2026");
      expect(res.body.data.tournaments[0].participantCount).toBe(8);
    });

    it("creates a tournament bound to authenticated host organizer", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "create").mockResolvedValue({
        ...mockTournament,
        title: "Riyadh Apex Legends Invitational",
        _count: { registrations: 0 },
      } as any);

      const res = await request(app)
        .post("/api/v1/host/tournaments")
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          title: "Riyadh Apex Legends Invitational",
          game: "Apex Legends",
          platform: "PC Windows",
          format: "3v3 Battle Royale",
          bracketType: "Single Elimination",
          teamSize: 3,
          maxParticipants: 60,
          startDate: new Date(Date.now() + 100000000).toISOString(),
          endDate: new Date(Date.now() + 200000000).toISOString(),
          description: "Collegiate squad tournament across the Kingdom.",
          rules: ["Anti-cheat required"],
          entryFee: "Free",
          prizePool: "5,000 SAR",
          status: "REGISTRATION_OPEN",
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.tournament.title).toBe("Riyadh Apex Legends Invitational");
      expect(res.body.data.tournament.participantCount).toBe(0);
    });

    it("rejects wagering or gambling entry fee terms", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      const res = await request(app)
        .post("/api/v1/host/tournaments")
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          title: "Illegal Wagering Cup",
          game: "CS2",
          platform: "PC Windows",
          format: "1v1",
          startDate: new Date(Date.now() + 100000000).toISOString(),
          description: "Tournament with cash wager per match.",
          entryFee: "100 SAR Wager Match",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Invalid tournament data");
    });
  });

  // ==========================================
  // 4. OWNERSHIP & IDOR PROTECTIONS (GET & PUT /api/v1/host/tournaments/:id)
  // ==========================================
  describe("Host Ownership Scoping & IDOR Security", () => {
    it("allows owner to view their tournament management details", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host",
        _count: { registrations: 4 },
      } as any);

      const res = await request(app)
        .get(`/api/v1/host/tournaments/${mockTournament.id}`)
        .set("Authorization", `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.tournament.id).toBe(mockTournament.id);
    });

    it("rejects IDOR attempt when another host attempts to access details", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: otherHostUser.userId,
        username: "rival_host",
        fullName: "Rival Host",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host", // Owned by Tariq, not Rival
        _count: { registrations: 4 },
      } as any);

      const res = await request(app)
        .get(`/api/v1/host/tournaments/${mockTournament.id}`)
        .set("Authorization", `Bearer ${otherHostToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("not authorized to manage this tournament");
    });

    it("rejects IDOR attempt when another host attempts to edit tournament", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: otherHostUser.userId,
        username: "rival_host",
        fullName: "Rival Host",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host",
      } as any);

      const res = await request(app)
        .put(`/api/v1/host/tournaments/${mockTournament.id}`)
        .set("Authorization", `Bearer ${otherHostToken}`)
        .send({
          title: "Hijacked Tournament Title",
        });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("not authorized to update this tournament");
    });

    it("prevents editing a tournament once in COMPLETED state", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host",
        status: "COMPLETED",
      } as any);

      const res = await request(app)
        .put(`/api/v1/host/tournaments/${mockTournament.id}`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          title: "Attempting to change finalized tournament",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Cannot edit tournament in COMPLETED status");
    });
  });

  // ==========================================
  // 5. PARTICIPANTS & RESULTS
  // ==========================================
  describe("Participants & Match Results", () => {
    it("returns roster participants with privacy-conscious user handles", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host",
        _count: { registrations: 2 },
      } as any);

      vi.spyOn(prisma.tournamentRegistration, "findMany").mockResolvedValue([
        {
          id: "reg-1",
          tournamentId: mockTournament.id,
          userId: "usr-p1",
          registrationMode: "SOLO",
          status: "CONFIRMED",
          inGameHandle: "FalconSniper",
          preferredRoles: ["Duelist"],
          teamName: "Team Falcon",
          discordHandle: "Falcon#1234",
          createdAt: new Date(),
          updatedAt: new Date(),
          ticketCode: "tk-1",
          tournament: { id: mockTournament.id, title: mockTournament.title },
          user: { id: "usr-p1", username: "falcon" },
        },
        {
          id: "reg-2",
          tournamentId: mockTournament.id,
          userId: "usr-p2",
          registrationMode: "SOLO",
          status: "CONFIRMED",
          inGameHandle: "OryxDefender",
          preferredRoles: ["Sentinel"],
          teamName: "Team Oryx",
          discordHandle: "Oryx#5678",
          createdAt: new Date(),
          updatedAt: new Date(),
          ticketCode: "tk-2",
          tournament: { id: mockTournament.id, title: mockTournament.title },
          user: { id: "usr-p2", username: "oryx" },
        },
      ] as any);

      const res = await request(app)
        .get(`/api/v1/host/tournaments/${mockTournament.id}/participants-results`)
        .set("Authorization", `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.participants).toHaveLength(2);
      expect(res.body.data.participants[0].inGameHandle).toBe("FalconSniper");
      expect(res.body.data.matches).toHaveLength(1);
      expect(res.body.data.matches[0].team1Name).toBe("Team Falcon");
      expect(res.body.data.matches[0].team2Name).toBe("Team Oryx");
    });

    it("records a match result submission and validates against score ties", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host",
      } as any);

      vi.spyOn(prisma.tournamentRegistration, "findFirst").mockResolvedValue({
        id: "reg-1",
        tournamentId: mockTournament.id,
        teamName: "Team Falcon",
      } as any);

      const res = await request(app)
        .put(`/api/v1/host/tournaments/${mockTournament.id}/matches/match-1`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          team1Score: 13,
          team2Score: 11,
          winnerName: "Team Falcon",
          status: "COMPLETED",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.match.winnerName).toBe("Team Falcon");
      expect(res.body.data.match.status).toBe("COMPLETED");
    });

    it("rejects declaring an ineligible participant as match winner", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host",
      } as any);

      vi.spyOn(prisma.tournamentRegistration, "findFirst").mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/v1/host/tournaments/${mockTournament.id}/matches/match-1`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          team1Score: 13,
          team2Score: 11,
          winnerName: "Random Imposter Squad",
          status: "COMPLETED",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("is not an enrolled participant");
    });

    it("rejects tie scores when match is finalized", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: "tariq_host",
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        ...mockTournament,
        organizer: "tariq_host",
      } as any);

      const res = await request(app)
        .put(`/api/v1/host/tournaments/${mockTournament.id}/matches/match-1`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          team1Score: 13,
          team2Score: 13,
          winnerName: "Team Falcon",
          status: "COMPLETED",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Scores cannot be equal");
    });
  });

  // ==========================================
  // 6. HOST PROFILE & SETTINGS
  // ==========================================
  describe("Host Profile & Settings (GET & PUT /api/v1/host/profile)", () => {
    it("retrieves authenticated host profile", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        fullName: "Tariq Al-Mansoor",
        email: hostUser.email,
        isVerified: true,
        profile: {
          bio: "Lead Tournament Director",
          country: "Saudi Arabia",
          city: "Riyadh",
          discordHandle: "Tariq#0001",
        },
      } as any);

      const res = await request(app)
        .get("/api/v1/host/profile")
        .set("Authorization", `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.profile.hostName).toBe("Tariq Al-Mansoor");
      expect(res.body.data.profile.isVerified).toBe(true);
      expect(res.body.data.profile.city).toBe("Riyadh");
    });

    it("updates host profile and returns updated record", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        fullName: "Tariq Al-Mansoor",
        email: hostUser.email,
        isVerified: true,
      } as any);

      vi.spyOn(prisma.user, "update").mockResolvedValue({
        id: hostUser.userId,
        fullName: "Tariq Al-Mansoor",
        email: hostUser.email,
        isVerified: true,
        profile: {
          bio: "Senior Esports Commissioner",
          country: "Saudi Arabia",
          city: "Jeddah",
          discordHandle: "TariqHost#0001",
        },
      } as any);

      const res = await request(app)
        .put("/api/v1/host/profile")
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          hostName: "Tariq Al-Mansoor",
          organizationName: "Saudi Collegiate Gaming Association",
          bio: "Senior Esports Commissioner",
          city: "Jeddah",
          autoCheckIn: true,
          requireAntiCheat: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data.profile.organizationName).toBe("Saudi Collegiate Gaming Association");
      expect(res.body.data.profile.city).toBe("Jeddah");
    });

    it("deletes a tournament when authorized", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: hostUser.userId,
        username: hostUser.username,
        fullName: "Tariq Al-Mansoor",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        id: mockTournament.id,
        organizer: hostUser.username,
        status: "REGISTRATION_OPEN",
      } as any);

      vi.spyOn(prisma.tournament, "delete").mockResolvedValue(mockTournament as any);

      const res = await request(app)
        .delete(`/api/v1/host/tournaments/${mockTournament.id}`)
        .set("Authorization", `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.message).toMatch(/deleted successfully/i);
    });

    it("rejects tournament deletion if not the organizer", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValue({
        id: otherHostUser.userId,
        username: otherHostUser.username,
        fullName: "Rival Host",
      } as any);

      vi.spyOn(prisma.tournament, "findUnique").mockResolvedValue({
        id: mockTournament.id,
        organizer: hostUser.username,
        status: "REGISTRATION_OPEN",
      } as any);

      const res = await request(app)
        .delete(`/api/v1/host/tournaments/${mockTournament.id}`)
        .set("Authorization", `Bearer ${otherHostToken}`);

      expect(res.status).toBe(403);
    });
  });
});
