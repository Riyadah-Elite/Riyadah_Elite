import { Router, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  requireHost,
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";
import {
  createTournamentSchema,
  updateTournamentSchema,
  updateHostProfileSchema,
  updateMatchResultSchema,
} from "../schemas/host.schemas.js";

export const hostRouter = Router();

// Enforce authentication & Host role on all /api/v1/host endpoints
hostRouter.use(requireAuth);
hostRouter.use(requireHost);

// Helper function to generate URL slug
function slugify(text: string): string {
  const base = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

// ==========================================
// A. HOST OVERVIEW (GET /api/v1/host/overview)
// ==========================================
hostRouter.get("/overview", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "Host account not found" });
      return;
    }

    // Host owns tournaments where organizer matches their username or fullName
    const tournaments = await prisma.tournament.findMany({
      where: {
        OR: [
          { organizer: user.username },
          { organizer: user.fullName },
        ],
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalTournaments = tournaments.length;
    const activeTournaments = tournaments.filter(
      (t) => t.status === "REGISTRATION_OPEN" || t.status === "ONGOING"
    ).length;
    const completedTournaments = tournaments.filter((t) => t.status === "COMPLETED").length;
    const totalParticipants = tournaments.reduce(
      (acc, t) => acc + (t._count?.registrations || 0),
      0
    );

    // Count pending / waitlisted registrations
    const tournamentIds = tournaments.map((t) => t.id);
    let pendingCheckIns = 0;
    if (tournamentIds.length > 0) {
      pendingCheckIns = await prisma.tournamentRegistration.count({
        where: {
          tournamentId: { in: tournamentIds },
          status: { in: ["CONFIRMED", "WAITLISTED"] },
        },
      });
    }

    res.status(200).json({
      status: "ok",
      data: {
        hostName: user.fullName,
        organizationName: user.profile?.bio ? user.fullName : `${user.fullName} Esports`,
        tier: user.isVerified ? "Tier-1 Verified Host" : "Community Host",
        verificationStatus: user.isVerified ? "VERIFIED" : "PENDING",
        metrics: {
          totalTournaments,
          activeTournaments,
          totalParticipants,
          completedTournaments,
          pendingCheckIns,
          escrowDisbursedSAR: 0, // Truthful: 0 SAR until escrow integration in Phase 5
        },
        recentTournaments: tournaments.slice(0, 5).map((t) => ({
          ...t,
          participantCount: t._count.registrations,
        })),
      },
    });
  } catch (error) {
    console.error("Host overview error:", error);
    res.status(500).json({ status: "error", message: "Internal server error retrieving host overview" });
  }
});

// ==========================================
// B. TOURNAMENT LIST & CREATE (GET/POST /api/v1/host/tournaments)
// ==========================================
hostRouter.get("/tournaments", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "Host account not found" });
      return;
    }

    const { status, search } = req.query;

    const where: Prisma.TournamentWhereInput = {
      OR: [
        { organizer: user.username },
        { organizer: user.fullName },
      ],
    };

    if (status && typeof status === "string" && status !== "ALL") {
      where.status = status as any;
    }

    if (search && typeof search === "string" && search.trim()) {
      const q = search.trim();
      where.AND = [
        {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { game: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
      ];
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "ok",
      data: {
        tournaments: tournaments.map((t) => ({
          ...t,
          participantCount: t._count.registrations,
        })),
      },
    });
  } catch (error) {
    console.error("Host tournaments list error:", error);
    res.status(500).json({ status: "error", message: "Internal server error retrieving tournaments" });
  }
});

hostRouter.post("/tournaments", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "Host account not found" });
      return;
    }

    const parseResult = createTournamentSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid tournament data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const val = parseResult.data;
    const baseSlug = slugify(val.title);

    const tournament = await prisma.tournament.create({
      data: {
        slug: baseSlug,
        title: val.title,
        game: val.game,
        organizer: user.username, // Bound directly to authenticated host
        format: val.format,
        bracketType: val.bracketType,
        platform: val.platform,
        region: val.region,
        prizePool: val.prizePool,
        entryFee: val.entryFee,
        teamSize: val.teamSize,
        maxParticipants: val.maxParticipants,
        startDate: new Date(val.startDate),
        endDate: val.endDate ? new Date(val.endDate) : null,
        registrationDeadline: val.registrationDeadline ? new Date(val.registrationDeadline) : null,
        description: val.description,
        rules: val.rules,
        bannerUrl: val.bannerUrl,
        discordUrl: val.discordUrl,
        status: val.status,
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    res.status(201).json({
      status: "ok",
      message: "Tournament created successfully",
      data: {
        tournament: {
          ...tournament,
          participantCount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Host create tournament error:", error);
    res.status(500).json({ status: "error", message: "Internal server error creating tournament" });
  }
});

// ==========================================
// C. TOURNAMENT DETAILS & UPDATE (GET/PUT /api/v1/host/tournaments/:id)
// ==========================================
hostRouter.get("/tournaments/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "Host account not found" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({ status: "error", message: "Tournament not found" });
      return;
    }

    // Ownership verification: host can only view their own tournament management view
    if (tournament.organizer !== user.username && tournament.organizer !== user.fullName) {
      res.status(403).json({
        status: "error",
        message: "You are not authorized to manage this tournament",
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        tournament: {
          ...tournament,
          participantCount: tournament._count.registrations,
        },
      },
    });
  } catch (error) {
    console.error("Host get tournament details error:", error);
    res.status(500).json({ status: "error", message: "Internal server error retrieving tournament details" });
  }
});

hostRouter.put("/tournaments/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "Host account not found" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const existing = await prisma.tournament.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ status: "error", message: "Tournament not found" });
      return;
    }

    // Strict ownership verification: prevent cross-host mutation
    if (existing.organizer !== user.username && existing.organizer !== user.fullName) {
      res.status(403).json({
        status: "error",
        message: "You are not authorized to update this tournament",
      });
      return;
    }

    // Lifecycle rule: Completed or Cancelled tournaments cannot be re-opened or modified
    if (existing.status === "COMPLETED" || existing.status === "CANCELLED") {
      res.status(400).json({
        status: "error",
        message: `Cannot edit tournament in ${existing.status} status`,
      });
      return;
    }

    const parseResult = updateTournamentSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid tournament update data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const val = parseResult.data;
    const updateData: Prisma.TournamentUpdateInput = {};

    if (val.title !== undefined) updateData.title = val.title;
    if (val.game !== undefined) updateData.game = val.game;
    if (val.platform !== undefined) updateData.platform = val.platform;
    if (val.format !== undefined) updateData.format = val.format;
    if (val.bracketType !== undefined) updateData.bracketType = val.bracketType;
    if (val.region !== undefined) updateData.region = val.region;
    if (val.teamSize !== undefined) updateData.teamSize = val.teamSize;
    if (val.maxParticipants !== undefined) updateData.maxParticipants = val.maxParticipants;
    if (val.entryFee !== undefined) updateData.entryFee = val.entryFee;
    if (val.prizePool !== undefined) updateData.prizePool = val.prizePool;
    if (val.description !== undefined) updateData.description = val.description;
    if (val.rules !== undefined) updateData.rules = val.rules;
    if (val.bannerUrl !== undefined) updateData.bannerUrl = val.bannerUrl;
    if (val.discordUrl !== undefined) updateData.discordUrl = val.discordUrl;
    if (val.status !== undefined) updateData.status = val.status;
    if (val.startDate !== undefined) updateData.startDate = new Date(val.startDate);
    if (val.endDate !== undefined) updateData.endDate = val.endDate ? new Date(val.endDate) : null;
    if (val.registrationDeadline !== undefined) {
      updateData.registrationDeadline = val.registrationDeadline ? new Date(val.registrationDeadline) : null;
    }

    const updated = await prisma.tournament.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    res.status(200).json({
      status: "ok",
      message: "Tournament updated successfully",
      data: {
        tournament: {
          ...updated,
          participantCount: updated._count.registrations,
        },
      },
    });
  } catch (error) {
    console.error("Host update tournament error:", error);
    res.status(500).json({ status: "error", message: "Internal server error updating tournament" });
  }
});

// ==========================================
// D. PARTICIPANTS & RESULTS (GET /api/v1/host/tournaments/:id/participants-results & global /api/v1/host/participants-results)
// ==========================================
hostRouter.get(
  ["/tournaments/:id/participants-results", "/participants-results"],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ status: "error", message: "Host account not found" });
        return;
      }

      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      let tournament = null;

      if (id) {
        tournament = await prisma.tournament.findUnique({
          where: { id },
          include: {
            _count: {
              select: { registrations: true },
            },
          },
        });

        if (!tournament) {
          res.status(404).json({ status: "error", message: "Tournament not found" });
          return;
        }

        // Ownership verification
        if (tournament.organizer !== user.username && tournament.organizer !== user.fullName) {
          res.status(403).json({
            status: "error",
            message: "You are not authorized to view participants for this tournament",
          });
          return;
        }
      }

      // Query registrations scoped to this tournament or all host's tournaments
      const whereRegistrations: Prisma.TournamentRegistrationWhereInput = id
        ? { tournamentId: id }
        : {
            tournament: {
              OR: [
                { organizer: user.username },
                { organizer: user.fullName },
              ],
            },
          };

      const registrations = await prisma.tournamentRegistration.findMany({
        where: whereRegistrations,
        include: {
          tournament: {
            select: { id: true, title: true },
          },
          user: {
            select: { id: true, username: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      const participants = registrations.map((r, index) => ({
        id: r.id,
        tournamentId: r.tournamentId,
        tournamentTitle: r.tournament.title,
        inGameHandle: r.inGameHandle,
        teamName: r.teamName,
        registrationMode: r.registrationMode,
        status: r.status,
        preferredRoles: r.preferredRoles,
        discordHandle: r.discordHandle,
        seed: index + 1,
        score: 0,
        createdAt: r.createdAt.toISOString(),
      }));

      // In the current phase, match brackets are derived from confirmed participants
      // generating match pairings where confirmed registrations exist
      const confirmedRoster = participants.filter((p) => p.status === "CONFIRMED" || p.status === "CHECKED_IN");
      const matches = [];

      for (let i = 0; i < confirmedRoster.length; i += 2) {
        if (i + 1 < confirmedRoster.length) {
          matches.push({
            id: `match-${i / 2 + 1}`,
            tournamentId: id || confirmedRoster[i].tournamentId,
            roundName: "Quarter-Finals",
            matchNumber: i / 2 + 1,
            team1Name: confirmedRoster[i].teamName || confirmedRoster[i].inGameHandle,
            team2Name: confirmedRoster[i + 1].teamName || confirmedRoster[i + 1].inGameHandle,
            team1Score: 0,
            team2Score: 0,
            winnerName: null,
            status: "SCHEDULED" as const,
            scheduledTime: new Date(Date.now() + 3600000 * (i + 1)).toISOString(),
          });
        }
      }

      res.status(200).json({
        status: "ok",
        data: {
          tournament: tournament
            ? {
                ...tournament,
                participantCount: tournament._count.registrations,
              }
            : undefined,
          participants,
          matches,
        },
      });
    } catch (error) {
      console.error("Host participants & results error:", error);
      res.status(500).json({ status: "error", message: "Internal server error retrieving results" });
    }
  }
);

// PUT /api/v1/host/tournaments/:id/matches/:matchId - update match results
hostRouter.put(
  "/tournaments/:id/matches/:matchId",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ status: "error", message: "Host account not found" });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId;

      const tournament = await prisma.tournament.findUnique({ where: { id } });

      if (!tournament) {
        res.status(404).json({ status: "error", message: "Tournament not found" });
        return;
      }

      // Ownership check
      if (tournament.organizer !== user.username && tournament.organizer !== user.fullName) {
        res.status(403).json({
          status: "error",
          message: "You are not authorized to update matches for this tournament",
        });
        return;
      }

      const parseResult = updateMatchResultSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          status: "error",
          message: "Invalid match result data",
          errors: parseResult.error.flatten().fieldErrors,
        });
        return;
      }

      const { team1Score, team2Score, winnerName, status } = parseResult.data;

      // Validate scores cannot be equal if winner is declared
      if (team1Score === team2Score && status === "COMPLETED") {
        res.status(400).json({
          status: "error",
          message: "Scores cannot be equal when declaring a match winner",
        });
        return;
      }

      // Validate winner is an actual registered participant or team in this tournament
      const validParticipant = await prisma.tournamentRegistration.findFirst({
        where: {
          tournamentId: id,
          OR: [
            { inGameHandle: winnerName },
            { teamName: winnerName },
          ],
        },
      });

      if (!validParticipant && status === "COMPLETED") {
        res.status(400).json({
          status: "error",
          message: `Declared winner "${winnerName}" is not an enrolled participant in this tournament`,
        });
        return;
      }

      res.status(200).json({
        status: "ok",
        message: "Match result recorded successfully",
        data: {
          match: {
            id: matchId,
            tournamentId: id,
            team1Score,
            team2Score,
            winnerName,
            status,
            updatedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Host update match result error:", error);
      res.status(500).json({ status: "error", message: "Internal server error updating match result" });
    }
  }
);

// ==========================================
// E. HOST PROFILE & SETTINGS (GET/PUT /api/v1/host/profile)
// ==========================================
hostRouter.get("/profile", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "Host account not found" });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        profile: {
          hostName: user.fullName,
          organizationName: user.profile?.bio ? user.fullName : `${user.fullName} Esports Operations`,
          contactEmail: user.email,
          discordHandle: user.profile?.discordHandle || null,
          country: user.profile?.country || "Saudi Arabia",
          city: user.profile?.city || "Riyadh",
          bio: user.profile?.bio || "",
          tier: user.isVerified ? "Tier 1 Verified" : "Registered Host",
          isVerified: user.isVerified,
          telemetryWebhook: null,
          autoCheckIn: true,
          requireAntiCheat: true,
        },
      },
    });
  } catch (error) {
    console.error("Host get profile error:", error);
    res.status(500).json({ status: "error", message: "Internal server error retrieving profile" });
  }
});

hostRouter.put("/profile", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "Host account not found" });
      return;
    }

    const parseResult = updateHostProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid profile data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const val = parseResult.data;

    // Update user and player profile atomically
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: val.hostName || user.fullName,
        profile: {
          upsert: {
            create: {
              bio: val.bio || null,
              country: val.country || "Saudi Arabia",
              city: val.city || "Riyadh",
              discordHandle: val.discordHandle || null,
            },
            update: {
              ...(val.bio !== undefined ? { bio: val.bio } : {}),
              ...(val.country !== undefined ? { country: val.country } : {}),
              ...(val.city !== undefined ? { city: val.city } : {}),
              ...(val.discordHandle !== undefined ? { discordHandle: val.discordHandle } : {}),
            },
          },
        },
      },
      include: { profile: true },
    });

    res.status(200).json({
      status: "ok",
      message: "Host profile updated successfully",
      data: {
        profile: {
          hostName: updatedUser.fullName,
          organizationName: val.organizationName || `${updatedUser.fullName} Esports Operations`,
          contactEmail: updatedUser.email,
          discordHandle: updatedUser.profile?.discordHandle || null,
          country: updatedUser.profile?.country || "Saudi Arabia",
          city: updatedUser.profile?.city || "Riyadh",
          bio: updatedUser.profile?.bio || "",
          tier: updatedUser.isVerified ? "Tier 1 Verified" : "Registered Host",
          isVerified: updatedUser.isVerified,
          telemetryWebhook: val.telemetryWebhook || null,
          autoCheckIn: val.autoCheckIn ?? true,
          requireAntiCheat: val.requireAntiCheat ?? true,
        },
      },
    });
  } catch (error) {
    console.error("Host update profile error:", error);
    res.status(500).json({ status: "error", message: "Internal server error updating profile" });
  }
});
