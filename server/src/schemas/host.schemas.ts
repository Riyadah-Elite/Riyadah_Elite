import { z } from "zod";

// Base tournament fields schema
export const tournamentBaseSchema = z.object({
  title: z
    .string()
    .min(3, "Tournament title must be at least 3 characters")
    .max(100, "Tournament title cannot exceed 100 characters"),
  game: z
    .string()
    .min(2, "Game name must be at least 2 characters")
    .max(80, "Game name cannot exceed 80 characters"),
  platform: z
    .string()
    .min(2, "Platform must be at least 2 characters")
    .max(50, "Platform cannot exceed 50 characters")
    .default("PC Windows"),
  format: z
    .string()
    .min(3, "Format must be at least 3 characters")
    .max(80, "Format cannot exceed 80 characters")
    .default("5v5 Single Elimination"),
  bracketType: z
    .string()
    .min(3)
    .max(50)
    .default("Single Elimination"),
  region: z
    .string()
    .max(80)
    .default("Middle East / MENA"),
  teamSize: z
    .number()
    .int("Team size must be an integer")
    .min(1, "Team size must be at least 1")
    .max(32, "Team size cannot exceed 32")
    .default(5),
  maxParticipants: z
    .number()
    .int("Max participants must be an integer")
    .min(2, "Tournament must allow at least 2 participants")
    .max(512, "Tournament cannot exceed 512 participants")
    .default(32),
  entryFee: z
    .string()
    .max(50)
    .default("Free")
    .refine((val) => {
      // Anti-gambling safety: disallow wagering / pay-to-play betting terms
      const lower = val.toLowerCase();
      return !lower.includes("wager") && !lower.includes("bet") && !lower.includes("gamble");
    }, "Wagering and gambling entry fees are strictly prohibited"),
  prizePool: z
    .string()
    .max(100)
    .optional()
    .nullable(),
  prizeAmount: z
    .number()
    .positive()
    .optional()
    .nullable(),
  currency: z
    .string()
    .max(10)
    .default("SAR"),
  externalLink: z
    .string()
    .url("External registration link must be a valid URL")
    .optional()
    .nullable(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Valid start date is required"),
  endDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), "End date must be valid"),
  registrationDeadline: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Registration deadline must be valid"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description cannot exceed 3000 characters"),
  rules: z
    .array(z.string().min(1).max(500))
    .max(30, "Maximum 30 rules allowed")
    .default([]),
  bannerUrl: z
    .string()
    .url("Banner URL must be a valid URL")
    .optional()
    .nullable(),
  discordUrl: z
    .string()
    .url("Discord URL must be a valid URL")
    .optional()
    .nullable(),
  status: z
    .enum([
      "DRAFT",
      "REGISTRATION_OPEN",
      "REGISTRATION_CLOSED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
    ])
    .default("REGISTRATION_OPEN"),
});

// Create tournament schema with refinements
export const createTournamentSchema = tournamentBaseSchema
  .refine((data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  }, {
    message: "Tournament end date cannot be earlier than start date",
    path: ["endDate"],
  })
  .refine((data) => {
    if (data.registrationDeadline && data.startDate) {
      return new Date(data.registrationDeadline) <= new Date(data.startDate);
    }
    return true;
  }, {
    message: "Registration deadline cannot be after tournament start date",
    path: ["registrationDeadline"],
  });

// Update tournament schema (partial of base schema, with refinements)
export const updateTournamentSchema = tournamentBaseSchema
  .partial()
  .refine((data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  }, {
    message: "Tournament end date cannot be earlier than start date",
    path: ["endDate"],
  })
  .refine((data) => {
    if (data.registrationDeadline && data.startDate) {
      return new Date(data.registrationDeadline) <= new Date(data.startDate);
    }
    return true;
  }, {
    message: "Registration deadline cannot be after tournament start date",
    path: ["registrationDeadline"],
  });

// Update host profile & settings schema
export const updateHostProfileSchema = z.object({
  hostName: z.string().min(2, "Host name must be at least 2 characters").max(100).optional(),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters").max(120).optional(),
  contactEmail: z.string().email("Valid email address is required").optional(),
  discordHandle: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  bio: z.string().max(2000).optional(),
  telemetryWebhook: z.string().url("Telemetry webhook must be a valid URL").optional().nullable(),
  autoCheckIn: z.boolean().optional(),
  requireAntiCheat: z.boolean().optional(),
});

// Match result submission / update schema
export const updateMatchResultSchema = z.object({
  team1Score: z.number().int().min(0, "Score cannot be negative"),
  team2Score: z.number().int().min(0, "Score cannot be negative"),
  winnerName: z.string().min(1, "Winner name is required"),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "DISPUTED"]).default("COMPLETED"),
});
