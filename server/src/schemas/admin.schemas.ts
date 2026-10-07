import { z } from "zod";

export const lockdownSchema = z.object({
  reason: z.string().min(5, "A reason must be provided for platform lockdown").max(500).optional(),
});

export const userStatusUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "RESTRICTED", "BANNED", "FLAGGED"]),
  reason: z.string().min(3, "Reason required").max(500),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["PLAYER", "DEVELOPER", "HOST", "ADMIN"]),
  reason: z.string().min(3, "Reason required").max(500),
});

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  slug: z.string().min(2).max(60).optional(),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export const updatePlatformSettingSchema = z.object({
  value: z.any(),
  description: z.string().max(500).optional().nullable(),
});

export const tournamentArbiterDecisionSchema = z.object({
  action: z.enum(["FREEZE_BRACKET", "RESOLVE_DISPUTE", "FORCE_ADVANCE", "CANCEL_TOURNAMENT"]),
  matchId: z.string().optional(),
  winnerName: z.string().optional(),
  notes: z.string().min(5, "Arbiter notes required").max(1000),
});

export const verificationDecisionSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "DOCUMENT_REQUESTED"]),
  reviewerNotes: z.string().min(5, "Reviewer notes required").max(1000),
});

export const trustSafetyActionSchema = z.object({
  action: z.enum(["SUSPEND_USER", "DISMISS_REPORT", "APPLY_WARNING", "FLAG_ACCOUNTS"]),
  reason: z.string().min(5, "Action reason required").max(1000),
});

export const contentItemCreateSchema = z.object({
  title: z.string().min(3).max(150),
  contentType: z.enum(["ANNOUNCEMENT", "HERO_BANNER", "FEATURED_GAME", "TOURNAMENT_SPOTLIGHT"]),
  targetPlacement: z.enum(["HOMEPAGE", "GAMES_DISCOVERY", "TOURNAMENTS_HUB"]),
  body: z.string().max(5000).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});
