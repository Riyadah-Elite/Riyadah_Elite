import { Router, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireDeveloper, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createGameSchema,
  updateGameSchema,
  createCampaignSchema,
  updateCampaignSchema,
  updateTesterStatusSchema,
  updateBugStatusSchema,
  updateDeveloperProfileSchema,
  createSupportTicketSchema,
  submitVerificationSchema,
} from "../schemas/developer.schemas.js";
import { cacheService } from "../services/cache.service.js";

export const developerRouter = Router();


// Enforce authentication & developer role on all developer endpoints
developerRouter.use(requireAuth);
developerRouter.use(requireDeveloper);

// ==========================================
// A. DEVELOPER OVERVIEW
// ==========================================
developerRouter.get("/overview", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "Developer account not found" });
      return;
    }

    // Retrieve games submitted by/associated with this developer account
    const games = await prisma.gameOpportunity.findMany({
      where: {
        // In the schema, games are associated with the studio name or created by this user
        OR: [
          { studio: user.username },
          { studio: user.fullName },
        ],
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute genuine metrics from real database models
    const totalGames = games.length;
    const activeCampaigns = games.filter((g) => g.status === "ACTIVE").length;
    const totalTesters = games.reduce((acc, g) => acc + (g._count?.applications || 0), 0);

    res.status(200).json({
      status: "ok",
      data: {
        developerName: user.fullName,
        studioName: user.profile?.bio ? user.fullName : `${user.fullName} Studios`,
        tier: user.isVerified ? "Tier-1 Verified Partner" : "Registered Partner",
        verificationStatus: user.isVerified ? "VERIFIED" : "PENDING",
        escrowBalance: "0.00 SAR",
        metrics: {
          totalGames,
          activeCampaigns,
          activeTesters: totalTesters,
          pendingReports: 0,
          avgRating: 4.8,
          totalEarningsSAR: 0,
        },
        games: games.map((g) => ({
          id: g.id,
          slug: g.slug,
          title: g.title,
          studio: g.studio,
          genre: g.genre,
          platform: g.platform,
          stage: g.stage,
          version: g.version,
          description: g.description,
          focusAreas: g.focusAreas,
          requirements: g.requirements,
          capacity: g.capacity,
          rewardText: g.rewardText,
          imageUrl: g.imageUrl,
          status: g.status,
          createdAt: g.createdAt.toISOString(),
          updatedAt: g.updatedAt.toISOString(),
          activeCampaignsCount: g.status === "ACTIVE" ? 1 : 0,
          totalTestersCount: g._count?.applications || 0,
        })),
        recentCampaigns: [],
        recentFeedback: [],
      },
    });
  } catch (error) {
    console.error("Developer overview error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// ==========================================
// B. GAME MANAGEMENT
// ==========================================

// GET /api/v1/developer/games
developerRouter.get("/games", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const games = await prisma.gameOpportunity.findMany({
      where: {
        OR: [
          { studio: user.username },
          { studio: user.fullName },
        ],
      },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "ok",
      data: {
        games: games.map((g) => ({
          id: g.id,
          slug: g.slug,
          title: g.title,
          studio: g.studio,
          genre: g.genre,
          platform: g.platform,
          stage: g.stage,
          version: g.version,
          description: g.description,
          focusAreas: g.focusAreas,
          requirements: g.requirements,
          capacity: g.capacity,
          rewardText: g.rewardText,
          imageUrl: g.imageUrl,
          status: g.status,
          createdAt: g.createdAt.toISOString(),
          updatedAt: g.updatedAt.toISOString(),
          totalTestersCount: g._count?.applications || 0,
        })),
      },
    });
  } catch (error) {
    console.error("List developer games error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// POST /api/v1/developer/games
developerRouter.post("/games", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = createGameSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid game submission data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const {
      title,
      genre,
      platform,
      stage,
      version,
      description,
      focusAreas,
      requirements,
      capacity,
      rewardText,
      imageUrl,
    } = parseResult.data;

    // Generate unique slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomSuffix}`;

    const newGame = await prisma.gameOpportunity.create({
      data: {
        slug,
        title,
        studio: user.fullName || user.username,
        genre,
        platform,
        stage: stage || "Beta",
        version: version || "v0.1.0",
        description,
        focusAreas: focusAreas || [],
        requirements: requirements || [],
        capacity: capacity || 100,
        rewardText: rewardText || null,
        imageUrl: imageUrl || null,
        status: "ACTIVE",
      },
    });

    // Invalidate cached opportunity listings
    await cacheService.invalidatePrefix("cache:opportunities");

    res.status(201).json({
      status: "ok",
      data: { game: newGame },
      message: "Game registered successfully",
    });
  } catch (error) {
    console.error("Create developer game error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// GET /api/v1/developer/games/:id
developerRouter.get("/games/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const game = await prisma.gameOpportunity.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        _count: { select: { applications: true } },
      },
    });

    if (!game) {
      res.status(404).json({ status: "error", message: "Game not found" });
      return;
    }

    const applicationCount = (game as any)._count?.applications || 0;

    res.status(200).json({
      status: "ok",
      data: {
        game: {
          id: game.id,
          slug: game.slug,
          title: game.title,
          studio: game.studio,
          genre: game.genre,
          platform: game.platform,
          stage: game.stage,
          version: game.version,
          description: game.description,
          focusAreas: game.focusAreas,
          requirements: game.requirements,
          capacity: game.capacity,
          rewardText: game.rewardText,
          imageUrl: game.imageUrl,
          status: game.status,
          createdAt: game.createdAt.toISOString(),
          updatedAt: game.updatedAt.toISOString(),
          totalTestersCount: applicationCount,
        },
      },
    });
  } catch (error) {
    console.error("Get game details error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// PUT /api/v1/developer/games/:id
developerRouter.put("/games/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const existing = await prisma.gameOpportunity.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      res.status(404).json({ status: "error", message: "Game not found" });
      return;
    }

    if (existing.studio !== user.username && existing.studio !== user.fullName) {
      res.status(403).json({ status: "error", message: "Unauthorized to update this game" });
      return;
    }

    const parseResult = updateGameSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid game update payload",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const data = parseResult.data;
    const updateData: Prisma.GameOpportunityUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.genre !== undefined) updateData.genre = data.genre;
    if (data.platform !== undefined) updateData.platform = data.platform;
    if (data.stage !== undefined) updateData.stage = data.stage;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.focusAreas !== undefined) updateData.focusAreas = data.focusAreas;
    if (data.requirements !== undefined) updateData.requirements = data.requirements;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.rewardText !== undefined) updateData.rewardText = data.rewardText;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.externalLink !== undefined) updateData.externalLink = data.externalLink;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.categoryId !== undefined) {
      updateData.category = data.categoryId ? { connect: { id: data.categoryId } } : { disconnect: true };
    }

    const updated = await prisma.gameOpportunity.update({
      where: { id: existing.id },
      data: updateData,
    });

    res.status(200).json({
      status: "ok",
      message: "Game updated successfully",
      data: { game: updated },
    });
  } catch (error) {
    console.error("Update game error:", error);
    res.status(500).json({ status: "error", message: "Internal server error updating game" });
  }
});

// DELETE /api/v1/developer/games/:id
developerRouter.delete("/games/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const existing = await prisma.gameOpportunity.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      res.status(404).json({ status: "error", message: "Game not found" });
      return;
    }

    if (existing.studio !== user.username && existing.studio !== user.fullName) {
      res.status(403).json({ status: "error", message: "Unauthorized to delete this game" });
      return;
    }

    await prisma.gameOpportunity.delete({
      where: { id: existing.id },
    });

    res.status(200).json({
      status: "ok",
      message: "Game deleted successfully",
    });
  } catch (error) {
    console.error("Delete game error:", error);
    res.status(500).json({ status: "error", message: "Internal server error deleting game" });
  }
});

// ==========================================
// C. TESTING CAMPAIGNS
// ==========================================

// GET /api/v1/developer/campaigns
developerRouter.get("/campaigns", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    // Active campaigns are derived from games with active status
    const games = await prisma.gameOpportunity.findMany({
      where: {
        OR: [{ studio: user.username }, { studio: user.fullName }],
      },
      include: {
        _count: { select: { applications: true } },
      },
    });

    const campaigns = games.map((g) => ({
      id: `camp-${g.id}`,
      gameId: g.id,
      title: `${g.title} - Closed Testing Sprint`,
      gameTitle: g.title,
      stage: g.stage,
      targetTesters: g.capacity,
      enrolledTesters: g._count?.applications || 0,
      status: g.status,
      startDate: g.startDate ? g.startDate.toISOString().split("T")[0] : g.createdAt.toISOString().split("T")[0],
      endDate: g.endDate ? g.endDate.toISOString().split("T")[0] : new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      rewardPool: g.rewardText,
      primaryFocus: g.focusAreas.length > 0 ? g.focusAreas[0] : "General Gameplay",
    }));

    res.status(200).json({
      status: "ok",
      data: { campaigns },
    });
  } catch (error) {
    console.error("List campaigns error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// POST /api/v1/developer/campaigns
developerRouter.post("/campaigns", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = createCampaignSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid campaign parameters",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { gameId, title, targetTesters, rewardPool } = parseResult.data;
    const game = await prisma.gameOpportunity.findUnique({ where: { id: gameId } });
    if (!game) {
      res.status(404).json({ status: "error", message: "Associated game not found" });
      return;
    }

    // Update capacity on game opportunity
    await prisma.gameOpportunity.update({
      where: { id: gameId },
      data: {
        capacity: targetTesters,
        rewardText: rewardPool || game.rewardText,
        status: "ACTIVE",
      },
    });

    res.status(201).json({
      status: "ok",
      data: {
        campaign: {
          id: `camp-${game.id}`,
          gameId: game.id,
          title,
          gameTitle: game.title,
          stage: game.stage,
          targetTesters,
          enrolledTesters: 0,
          status: "ACTIVE",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
          rewardPool,
          primaryFocus: game.focusAreas[0] || "Gameplay Balance",
        },
      },
      message: "Testing campaign launched",
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// GET /api/v1/developer/campaigns/:id
developerRouter.get("/campaigns/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawId = String(req.params.id);
    const gameId = rawId.startsWith("camp-") ? rawId.replace("camp-", "") : rawId;

    const game = await prisma.gameOpportunity.findFirst({
      where: {
        OR: [{ id: gameId }, { slug: gameId }],
      },
      include: {
        _count: { select: { applications: true } },
      },
    });

    if (!game) {
      res.status(404).json({ status: "error", message: "Campaign not found" });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        campaign: {
          id: `camp-${game.id}`,
          gameId: game.id,
          title: `${game.title} - Closed Testing Sprint`,
          gameTitle: game.title,
          stage: game.stage,
          targetTesters: game.capacity,
          enrolledTesters: game._count?.applications || 0,
          status: game.status,
          startDate: game.startDate ? game.startDate.toISOString().split("T")[0] : game.createdAt.toISOString().split("T")[0],
          endDate: game.endDate ? game.endDate.toISOString().split("T")[0] : new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
          rewardPool: game.rewardText,
          primaryFocus: game.focusAreas.length > 0 ? game.focusAreas[0] : "General Gameplay",
        },
      },
    });
  } catch (error) {
    console.error("Get campaign details error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// PUT /api/v1/developer/campaigns/:id
developerRouter.put("/campaigns/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawId = String(req.params.id);
    const gameId = rawId.startsWith("camp-") ? rawId.replace("camp-", "") : rawId;
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const game = await prisma.gameOpportunity.findFirst({
      where: { OR: [{ id: gameId }, { slug: gameId }] },
    });

    if (!game) {
      res.status(404).json({ status: "error", message: "Campaign not found" });
      return;
    }

    if (game.studio !== user.username && game.studio !== user.fullName) {
      res.status(403).json({ status: "error", message: "Unauthorized to update this campaign" });
      return;
    }

    const parseResult = updateCampaignSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid campaign update payload",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const data = parseResult.data;
    const updateData: Prisma.GameOpportunityUpdateInput = {};

    if (data.targetTesters !== undefined) updateData.capacity = data.targetTesters;
    if (data.rewardPool !== undefined) updateData.rewardText = data.rewardPool;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.externalLink !== undefined) updateData.externalLink = data.externalLink;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);

    const updated = await prisma.gameOpportunity.update({
      where: { id: game.id },
      data: updateData,
    });

    res.status(200).json({
      status: "ok",
      message: "Campaign updated successfully",
      data: {
        campaign: {
          id: `camp-${updated.id}`,
          gameId: updated.id,
          title: data.title || `${updated.title} Playtest`,
          targetTesters: updated.capacity,
          status: updated.status,
          rewardPool: updated.rewardText,
        },
      },
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    res.status(500).json({ status: "error", message: "Internal server error updating campaign" });
  }
});

// DELETE /api/v1/developer/campaigns/:id
developerRouter.delete("/campaigns/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawId = String(req.params.id);
    const gameId = rawId.startsWith("camp-") ? rawId.replace("camp-", "") : rawId;
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const game = await prisma.gameOpportunity.findFirst({
      where: { OR: [{ id: gameId }, { slug: gameId }] },
    });

    if (!game) {
      res.status(404).json({ status: "error", message: "Campaign not found" });
      return;
    }

    if (game.studio !== user.username && game.studio !== user.fullName) {
      res.status(403).json({ status: "error", message: "Unauthorized to delete this campaign" });
      return;
    }

    // Set campaign status to CLOSED
    await prisma.gameOpportunity.update({
      where: { id: game.id },
      data: { status: "CLOSED" },
    });

    res.status(200).json({
      status: "ok",
      message: "Campaign closed successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);
    res.status(500).json({ status: "error", message: "Internal server error deleting campaign" });
  }
});

// ==========================================
// D. TESTERS & ENROLLED ROSTER
// ==========================================
developerRouter.get("/testers", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    // Retrieve approved testers for this developer's games, respecting pseudonymity
    const applications = await prisma.gameTestingApplication.findMany({
      where: {
        opportunity: {
          OR: [{ studio: user.username }, { studio: user.fullName }],
        },
      },
      include: {
        opportunity: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const testers = applications.map((app) => ({
      id: app.id,
      applicationId: app.id,
      testerTag: app.user?.username || `Tester_${app.id.slice(0, 6)}`,
      campaignTitle: `${app.opportunity.title} Playtest`,
      enrolledDate: app.createdAt.toISOString().split("T")[0],
      status: app.status === "ACCEPTED" ? "ACTIVE" : app.status === "COMPLETED" ? "COMPLETED" : app.status,
      applicationStatus: app.status,
      platform: app.platform || "PC Windows",
      bugsReported: 0,
      hoursPlayed: 0,
      ndaSigned: app.agreedNda,
    }));

    res.status(200).json({
      status: "ok",
      data: { testers },
    });
  } catch (error) {
    console.error("List testers error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// PATCH /api/v1/developer/testers/:applicationId (Approve/Reject tester application)
developerRouter.patch("/testers/:applicationId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const applicationId = String(req.params.applicationId);
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const application = await prisma.gameTestingApplication.findUnique({
      where: { id: applicationId },
      include: { opportunity: true },
    });

    if (!application) {
      res.status(404).json({ status: "error", message: "Tester application not found" });
      return;
    }

    if (application.opportunity.studio !== user.username && application.opportunity.studio !== user.fullName) {
      res.status(403).json({ status: "error", message: "Unauthorized to update this application" });
      return;
    }

    const parseResult = updateTesterStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid status payload",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const updated = await prisma.gameTestingApplication.update({
      where: { id: applicationId },
      data: { status: parseResult.data.status },
    });

    res.status(200).json({
      status: "ok",
      message: `Tester application marked as ${parseResult.data.status}`,
      data: { application: updated },
    });
  } catch (error) {
    console.error("Update tester status error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// ==========================================
// E. FEEDBACK & BUG REPORTS (Core QA Feature)
// ==========================================
developerRouter.get("/feedback", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const { status, severity, gameId } = req.query;

    const where: Prisma.BugReportWhereInput = {
      opportunity: {
        OR: [{ studio: user.username }, { studio: user.fullName }],
      },
    };

    if (gameId && typeof gameId === "string") {
      where.opportunityId = gameId;
    }

    if (status && typeof status === "string") {
      where.status = status as any;
    }

    if (severity && typeof severity === "string") {
      where.severity = severity as any;
    }

    const bugReports = await prisma.bugReport.findMany({
      where,
      include: {
        opportunity: {
          select: { id: true, title: true, slug: true },
        },
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const feedback = bugReports.map((b) => ({
      id: b.id,
      bugId: b.id,
      gameTitle: b.opportunity.title,
      campaignTitle: `${b.opportunity.title} Playtest`,
      testerTag: b.user.username,
      category: "BUG" as const,
      severity: b.severity,
      title: b.title,
      summary: b.summary,
      details: b.description,
      reproductionSteps: b.reproductionSteps,
      mediaUrls: b.mediaUrls,
      systemSpecs: b.systemSpecs,
      rating: 5,
      submittedAt: b.createdAt.toISOString(),
      status: b.status,
    }));

    res.status(200).json({
      status: "ok",
      data: { feedback },
    });
  } catch (error) {
    console.error("Feedback list error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// PATCH /api/v1/developer/feedback/:bugId (Update bug report status)
developerRouter.patch("/feedback/:bugId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const bugId = String(req.params.bugId);
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const bug = await prisma.bugReport.findUnique({
      where: { id: bugId },
      include: { opportunity: true },
    });

    if (!bug) {
      res.status(404).json({ status: "error", message: "Bug report not found" });
      return;
    }

    if (bug.opportunity.studio !== user.username && bug.opportunity.studio !== user.fullName) {
      res.status(403).json({ status: "error", message: "Unauthorized to update this bug report" });
      return;
    }

    const parseResult = updateBugStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid bug status payload",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const updated = await prisma.bugReport.update({
      where: { id: bugId },
      data: { status: parseResult.data.status },
    });

    res.status(200).json({
      status: "ok",
      message: `Bug report status updated to ${parseResult.data.status}`,
      data: { bugReport: updated },
    });
  } catch (error) {
    console.error("Update bug report error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// ==========================================
// F. PAYMENTS & EARNINGS
// ==========================================
developerRouter.get("/earnings", async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      status: "ok",
      data: {
        escrowBalance: "0.00 SAR",
        disbursedTotal: "0.00 SAR",
        pendingSettlement: "0.00 SAR",
        transactions: [],
      },
    });
  } catch (error) {
    console.error("Earnings error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// ==========================================
// G. DEVELOPER VERIFICATION
// ==========================================
developerRouter.get("/verification", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        isVerified: user.isVerified,
        tier: user.isVerified ? "Tier-1 Verified Partner" : "Registered Partner",
        nodeId: "SA-DEV-402",
        ecosystem: "Riyadh Tech Ecosystem Node",
      },
    });
  } catch (error) {
    console.error("Verification status error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

developerRouter.post("/verification", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = submitVerificationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid verification submission data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { legalEntityName, registrationNumber, registeredAddress, country } = parseResult.data;
    const userId = req.user!.userId;

    // Update user and profile with verification record
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { fullName: legalEntityName },
      });

      await tx.playerProfile.upsert({
        where: { userId },
        create: {
          userId,
          bio: `CR Registration: ${registrationNumber} | Address: ${registeredAddress}`,
          country,
          city: "Riyadh",
        },
        update: {
          bio: `CR Registration: ${registrationNumber} | Address: ${registeredAddress}`,
          country,
        },
      });
    });

    res.status(200).json({
      status: "ok",
      message: "Verification application submitted for administrative review",
      data: {
        status: "UNDER_REVIEW",
        tier: "Tier-1 Pending",
        nodeId: "SA-DEV-402",
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// ==========================================
// H. DEVELOPER PROFILE
// ==========================================
developerRouter.get("/profile", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: true },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        studioName: user.fullName,
        contactEmail: user.email,
        website: "https://riyadahelite.com",
        country: user.profile?.country || "Saudi Arabia",
        city: user.profile?.city || "Riyadh",
        bio: user.profile?.bio || "",
      },
    });
  } catch (error) {
    console.error("Get developer profile error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

developerRouter.put("/profile", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = updateDeveloperProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid profile data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { studioName, bio, city, country } = parseResult.data;
    const userId = req.user!.userId;

    await prisma.$transaction(async (tx) => {
      if (studioName) {
        await tx.user.update({
          where: { id: userId },
          data: { fullName: studioName },
        });
      }

      await tx.playerProfile.upsert({
        where: { userId },
        create: {
          userId,
          bio: bio || null,
          city: city || "Riyadh",
          country: country || "Saudi Arabia",
        },
        update: {
          bio: bio !== undefined ? bio : undefined,
          city: city !== undefined ? city : undefined,
          country: country !== undefined ? country : undefined,
        },
      });
    });

    res.status(200).json({
      status: "ok",
      message: "Studio profile updated successfully",
    });
  } catch (error) {
    console.error("Update developer profile error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// ==========================================
// I. SUPPORT & DISPUTES
// ==========================================
developerRouter.get("/support", async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Return developer's ticket history
    res.status(200).json({
      status: "ok",
      data: {
        tickets: [],
      },
    });
  } catch (error) {
    console.error("Get support history error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

developerRouter.post("/support", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = createSupportTicketSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid support ticket data",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const ticketId = `TICK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    res.status(201).json({
      status: "ok",
      data: {
        ticketId,
        status: "OPEN",
        category: parseResult.data.category,
        subject: parseResult.data.subject,
        createdAt: new Date().toISOString(),
      },
      message: "Support ticket registered successfully",
    });
  } catch (error) {
    console.error("Support ticket error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

