import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  primaryPlatform: z.string().max(50).optional().nullable(),
  favoriteGenres: z.array(z.string()).max(10).optional(),
  hardwareGpu: z.string().max(100).optional().nullable(),
  hardwareCpu: z.string().max(100).optional().nullable(),
  hardwareRam: z.string().max(50).optional().nullable(),
  hardwareOs: z.string().max(50).optional().nullable(),
  discordHandle: z.string().max(50).optional().nullable(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter")
      .regex(/[0-9]/, "New password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "New password must contain at least one special character"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

export const submitApplicationSchema = z.object({
  opportunityId: z.string().min(1, "Opportunity ID is required"),
  platform: z.string().min(1, "Platform selection is required"),
  primaryGames: z.array(z.string()).min(1, "Please list at least one played game").max(10),
  hardwareGpu: z.string().min(2, "GPU specification is required").max(100),
  hardwareCpu: z.string().min(2, "CPU specification is required").max(100),
  hardwareRam: z.string().min(2, "RAM specification is required").max(50),
  availabilityHours: z.string().min(1, "Availability commitment is required"),
  experienceNotes: z.string().max(1000).optional().nullable(),
  agreedNda: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Non-Disclosure Agreement" }),
  }),
  agreedTelemetry: z.literal(true, {
    errorMap: () => ({ message: "You must authorize telemetry logging" }),
  }),
});
