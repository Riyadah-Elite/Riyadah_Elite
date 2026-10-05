import { Router, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { tournamentRegistrationSchema } from "../schemas/tournament.schemas.js";

export const tournamentRouter = Router();

// ==========================================
// 1. PUBLIC TOURNAMENT DISCOVERY / DETAILS
// ==========================================

// GET /api/v1/tournaments
// List published tournaments with search, game filter, platform, status
tournamentRouter.get("/", async (req, res: Response): Promise<void> => {
  try {
    const { game, platform, status, search } = req.query;

    const where: Prisma.TournamentWhereInput = {};

    // By default, hide DRAFT tournaments unless explicitly requested
    if (status && typeof status === "string" && status !== "ALL") {
      where.status = status as any;
    } else {
      where.status = { not: "DRAFT" };
    }

    if (game && typeof game === "string" && game !== "All") {
      where.game = { contains: game, mode: "insensitive" };
    }

    if (platform && typeof platform === "string" && platform !== "All") {
      where.platform = { contains: platform, mode: "insensitive" };
    }

    if (search && typeof search === "string" && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { organizer: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
        { game: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      orderBy: { startDate: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
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
    console.error("Failed to list tournaments:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error retrieving tournaments",
    });
  }
});

// GET /api/v1/tournaments/:idOrSlug
// Get detailed tournament information by ID or unique slug
tournamentRouter.get("/:idOrSlug", async (req, res: Response): Promise<void> => {
  try {
    const idOrSlug = String(req.params.idOrSlug);

    const tournament = await prisma.tournament.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({
        status: "error",
        message: "Tournament not found or does not exist",
      });
      return;
    }

    // Never show DRAFT tournaments to public
    if (tournament.status === "DRAFT") {
      res.status(404).json({
        status: "error",
        message: "Tournament is not currently published",
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        tournament: {
          ...tournament,
          participantCount: tournament._count.registrations,
          isFull: tournament._count.registrations >= tournament.maxParticipants,
        },
      },
    });
  } catch (error) {
    console.error("Failed to get tournament details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error fetching tournament details",
    });
  }
});

// ==========================================
// 2. TOURNAMENT REGISTRATION WORKFLOW
// ==========================================

// POST /api/v1/tournaments/:idOrSlug/register
// Register the authenticated player for a tournament
tournamentRouter.post("/:idOrSlug/register", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const idOrSlug = String(req.params.idOrSlug);

    // Validate registration form payload
    const parseResult = tournamentRegistrationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid tournament registration submission",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      registrationMode,
      inGameHandle,
      preferredRoles,
      teamName,
      discordHandle,
      agreedRules,
      agreedAntiCheat,
    } = parseResult.data;

    // Fetch tournament
    const tournament = await prisma.tournament.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({
        status: "error",
        message: "Tournament not found",
      });
      return;
    }

    // Verify lifecycle status
    if (tournament.status !== "REGISTRATION_OPEN") {
      res.status(400).json({
        status: "error",
        message: `Registration is not open for this tournament. Current status: ${tournament.status}`,
      });
      return;
    }

    // Check registration deadline if set
    if (tournament.registrationDeadline && new Date() > new Date(tournament.registrationDeadline)) {
      res.status(400).json({
        status: "error",
        message: "The registration deadline for this tournament has passed",
      });
      return;
    }

    // Check capacity
    if (tournament._count.registrations >= tournament.maxParticipants) {
      res.status(400).json({
        status: "error",
        message: "This tournament has reached maximum participant capacity",
      });
      return;
    }

    // Check duplicate registration
    const existingRegistration = await prisma.tournamentRegistration.findUnique({
      where: {
        userId_tournamentId: {
          userId,
          tournamentId: tournament.id,
        },
      },
    });

    if (existingRegistration) {
      res.status(409).json({
        status: "error",
        message: "You are already registered for this tournament",
        data: {
          registration: existingRegistration,
        },
      });
      return;
    }

    // Safe transaction: double-check capacity inside atomic transaction & create registration
    const registration = await prisma.$transaction(async (tx) => {
      const currentCount = await tx.tournamentRegistration.count({
        where: { tournamentId: tournament.id },
      });

      if (currentCount >= tournament.maxParticipants) {
        throw new Error("CAPACITY_REACHED");
      }

      return tx.tournamentRegistration.create({
        data: {
          tournamentId: tournament.id,
          userId,
          registrationMode,
          status: "CONFIRMED",
          inGameHandle,
          preferredRoles,
          teamName: registrationMode !== "SOLO" ? teamName : null,
          discordHandle: discordHandle || null,
          agreedRules,
          agreedAntiCheat,
        },
        include: {
          tournament: {
            select: {
              id: true,
              slug: true,
              title: true,
              game: true,
              startDate: true,
              format: true,
              platform: true,
              prizePool: true,
            },
          },
        },
      });
    });

    res.status(201).json({
      status: "ok",
      message: "Tournament registration confirmed successfully",
      data: {
        registration,
      },
    });
  } catch (error: any) {
    if (error.message === "CAPACITY_REACHED") {
      res.status(400).json({
        status: "error",
        message: "Tournament reached full capacity before your submission could be processed",
      });
      return;
    }

    // Handle DB unique constraint race if another concurrent request arrived
    if (error.code === "P2002") {
      res.status(409).json({
        status: "error",
        message: "You are already registered for this tournament",
      });
      return;
    }

    console.error("Failed to register for tournament:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error processing tournament registration",
    });
  }
});
