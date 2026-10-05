import { Router, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  updateProfileSchema,
  updatePasswordSchema,
  submitApplicationSchema,
} from "../schemas/player.schemas.js";
import { verifyPassword, hashPassword } from "../lib/security.js";

export const playerRouter = Router();

// ==========================================
// 1. PUBLIC / OPPORTUNITY ENDPOINTS
// ==========================================

// List active game testing opportunities with filtering
playerRouter.get("/opportunities", async (req, res: Response): Promise<void> => {
  try {
    const { platform, genre, stage, search } = req.query;

    const where: Prisma.GameOpportunityWhereInput = {
      status: "ACTIVE",
    };

    if (platform && typeof platform === "string" && platform !== "All") {
      where.platform = { contains: platform, mode: "insensitive" };
    }

    if (genre && typeof genre === "string" && genre !== "All") {
      where.genre = { contains: genre, mode: "insensitive" };
    }

    if (stage && typeof stage === "string" && stage !== "All") {
      where.stage = { contains: stage, mode: "insensitive" };
    }

    if (search && typeof search === "string" && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { studio: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const opportunities = await prisma.gameOpportunity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    res.status(200).json({
      status: "ok",
      data: { opportunities },
    });
  } catch (error) {
    console.error("Failed to list opportunities:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error fetching opportunities",
    });
  }
});

// Get opportunity details by slug or ID
playerRouter.get("/opportunities/:idOrSlug", async (req, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;

    const opportunity = await prisma.gameOpportunity.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        status: "ACTIVE",
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!opportunity) {
      res.status(404).json({
        status: "error",
        message: "Game testing opportunity not found or currently unavailable",
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: { opportunity },
    });
  } catch (error) {
    console.error("Failed to get opportunity details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error fetching opportunity details",
    });
  }
});

// ==========================================
// 2. AUTHENTICATED PLAYER PROFILE & SETTINGS
// ==========================================

// Get player workspace overview / stats
playerRouter.get("/overview", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const [user, applications, tournamentRegistrations] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      }),
      prisma.gameTestingApplication.findMany({
        where: { userId },
        include: {
          opportunity: {
            select: {
              id: true,
              slug: true,
              title: true,
              studio: true,
              genre: true,
              platform: true,
              stage: true,
              version: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tournamentRegistration.findMany({
        where: { userId },
        include: {
          tournament: {
            select: {
              id: true,
              slug: true,
              title: true,
              game: true,
              organizer: true,
              format: true,
              bracketType: true,
              platform: true,
              region: true,
              prizePool: true,
              entryFee: true,
              teamSize: true,
              startDate: true,
              endDate: true,
              status: true,
              bannerUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const activeTestsCount = applications.filter((a) => a.status === "ACCEPTED").length;
    const pendingApplicationsCount = applications.filter(
      (a) => a.status === "PENDING" || a.status === "UNDER_REVIEW"
    ).length;
    const completedTestsCount = applications.filter((a) => a.status === "COMPLETED").length;

    const upcomingTournamentsCount = tournamentRegistrations.filter(
      (r) => r.tournament.status === "REGISTRATION_OPEN" || r.tournament.status === "REGISTRATION_CLOSED"
    ).length;
    const activeTournamentsCount = tournamentRegistrations.filter(
      (r) => r.tournament.status === "ONGOING"
    ).length;
    const completedTournamentsCount = tournamentRegistrations.filter(
      (r) => r.tournament.status === "COMPLETED"
    ).length;

    res.status(200).json({
      status: "ok",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        profile: user.profile,
        metrics: {
          activeTests: activeTestsCount,
          pendingApplications: pendingApplicationsCount,
          completedTests: completedTestsCount,
          registeredTournaments: tournamentRegistrations.length,
          upcomingTournaments: upcomingTournamentsCount,
          activeTournaments: activeTournamentsCount,
          completedTournaments: completedTournamentsCount,
          testerScore: user.profile?.testerScore || 0,
        },
        applications,
        tournamentRegistrations,
      },
    });
  } catch (error) {
    console.error("Failed to load player overview:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error loading player dashboard",
    });
  }
});

// Get current player profile
playerRouter.get("/profile", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        applications: {
          include: {
            opportunity: {
              select: {
                id: true,
                slug: true,
                title: true,
                studio: true,
                stage: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        profile: user.profile,
        applications: user.applications,
      },
    });
  } catch (error) {
    console.error("Failed to fetch player profile:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error fetching profile",
    });
  }
});

// Update player profile
playerRouter.put("/profile", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const parseResult = updateProfileSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid profile data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      fullName,
      bio,
      country,
      city,
      primaryPlatform,
      favoriteGenres,
      hardwareGpu,
      hardwareCpu,
      hardwareRam,
      hardwareOs,
      discordHandle,
    } = parseResult.data;

    const updatedUser = await prisma.$transaction(async (tx) => {
      if (fullName) {
        await tx.user.update({
          where: { id: userId },
          data: { fullName },
        });
      }

      const profile = await tx.playerProfile.upsert({
        where: { userId },
        create: {
          userId,
          bio: bio || null,
          country: country || "Saudi Arabia",
          city: city || "Riyadh",
          primaryPlatform: primaryPlatform || "PC Windows",
          favoriteGenres: favoriteGenres || [],
          hardwareGpu: hardwareGpu || null,
          hardwareCpu: hardwareCpu || null,
          hardwareRam: hardwareRam || null,
          hardwareOs: hardwareOs || null,
          discordHandle: discordHandle || null,
        },
        update: {
          ...(bio !== undefined ? { bio } : {}),
          ...(country !== undefined ? { country } : {}),
          ...(city !== undefined ? { city } : {}),
          ...(primaryPlatform !== undefined ? { primaryPlatform } : {}),
          ...(favoriteGenres !== undefined ? { favoriteGenres } : {}),
          ...(hardwareGpu !== undefined ? { hardwareGpu } : {}),
          ...(hardwareCpu !== undefined ? { hardwareCpu } : {}),
          ...(hardwareRam !== undefined ? { hardwareRam } : {}),
          ...(hardwareOs !== undefined ? { hardwareOs } : {}),
          ...(discordHandle !== undefined ? { discordHandle } : {}),
        },
      });

      return profile;
    });

    res.status(200).json({
      status: "ok",
      message: "Player profile updated successfully",
      data: { profile: updatedUser },
    });
  } catch (error) {
    console.error("Failed to update player profile:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error updating profile",
    });
  }
});

// Update player password
playerRouter.put("/settings/password", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const parseResult = updatePasswordSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid password input",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { currentPassword, newPassword } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const isValidCurrent = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidCurrent) {
      res.status(400).json({
        status: "error",
        message: "Current password does not match our records",
      });
      return;
    }

    const newHashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHashed },
    });

    res.status(200).json({
      status: "ok",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Failed to update password:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error updating password",
    });
  }
});

// ==========================================
// 3. GAME TESTING APPLICATIONS
// ==========================================

// Get current player's submitted applications
playerRouter.get("/applications", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const applications = await prisma.gameTestingApplication.findMany({
      where: { userId },
      include: {
        opportunity: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "ok",
      data: { applications },
    });
  } catch (error) {
    console.error("Failed to get player applications:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error fetching applications",
    });
  }
});

// Submit a game testing application
playerRouter.post("/applications", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const parseResult = submitApplicationSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid application submission",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      opportunityId,
      platform,
      primaryGames,
      hardwareGpu,
      hardwareCpu,
      hardwareRam,
      availabilityHours,
      experienceNotes,
      agreedNda,
      agreedTelemetry,
    } = parseResult.data;

    // Verify opportunity exists and is ACTIVE
    const opportunity = await prisma.gameOpportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity || opportunity.status !== "ACTIVE") {
      res.status(400).json({
        status: "error",
        message: "This game testing opportunity is not currently accepting applications",
      });
      return;
    }

    // Check for existing duplicate application and create atomically
    try {
      const application = await prisma.$transaction(async (tx) => {
        const existing = await tx.gameTestingApplication.findUnique({
          where: {
            userId_opportunityId: {
              userId,
              opportunityId,
            },
          },
        });

        if (existing) {
          throw new Error("DUPLICATE_APPLICATION");
        }

        return tx.gameTestingApplication.create({
          data: {
            userId,
            opportunityId,
            platform,
            primaryGames,
            hardwareGpu,
            hardwareCpu,
            hardwareRam,
            availabilityHours,
            experienceNotes: experienceNotes || null,
            agreedNda,
            agreedTelemetry,
            status: "PENDING",
          },
          include: {
            opportunity: true,
          },
        });
      });

      res.status(201).json({
        status: "ok",
        message: "Application submitted successfully and placed in review queue",
        data: { application },
      });
    } catch (txError: any) {
      if (txError.message === "DUPLICATE_APPLICATION" || txError.code === "P2002") {
        res.status(409).json({
          status: "error",
          message: "You have already submitted an application for this game testing cohort",
        });
        return;
      }
      throw txError;
    }
  } catch (error) {
    console.error("Failed to submit application:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error submitting application",
    });
  }
});

// List authenticated player's registered tournaments
playerRouter.get("/tournaments", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { status, search } = req.query;

    const where: Prisma.TournamentRegistrationWhereInput = {
      userId,
    };

    if (search && typeof search === "string" && search.trim()) {
      where.tournament = {
        OR: [
          { title: { contains: search.trim(), mode: "insensitive" } },
          { game: { contains: search.trim(), mode: "insensitive" } },
          { organizer: { contains: search.trim(), mode: "insensitive" } },
        ],
      };
    }

    const registrations = await prisma.tournamentRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        tournament: {
          select: {
            id: true,
            slug: true,
            title: true,
            game: true,
            organizer: true,
            format: true,
            bracketType: true,
            platform: true,
            region: true,
            prizePool: true,
            entryFee: true,
            teamSize: true,
            maxParticipants: true,
            startDate: true,
            endDate: true,
            status: true,
            bannerUrl: true,
            discordUrl: true,
            _count: {
              select: { registrations: true },
            },
          },
        },
      },
    });

    let filtered = registrations.map((r) => ({
      ...r,
      tournament: {
        ...r.tournament,
        participantCount: r.tournament._count.registrations,
      },
    }));

    if (status && typeof status === "string" && status !== "ALL") {
      if (status === "ACTIVE") {
        filtered = filtered.filter((r) => r.tournament.status === "ONGOING");
      } else if (status === "UPCOMING") {
        filtered = filtered.filter(
          (r) => r.tournament.status === "REGISTRATION_OPEN" || r.tournament.status === "REGISTRATION_CLOSED"
        );
      } else if (status === "COMPLETED") {
        filtered = filtered.filter((r) => r.tournament.status === "COMPLETED");
      }
    }

    res.status(200).json({
      status: "ok",
      data: {
        registrations: filtered,
        metrics: {
          total: registrations.length,
          upcoming: registrations.filter(
            (r) => r.tournament.status === "REGISTRATION_OPEN" || r.tournament.status === "REGISTRATION_CLOSED"
          ).length,
          active: registrations.filter((r) => r.tournament.status === "ONGOING").length,
          completed: registrations.filter((r) => r.tournament.status === "COMPLETED").length,
        },
      },
    });
  } catch (error) {
    console.error("Failed to get player tournaments:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error fetching player tournaments",
    });
  }
});
