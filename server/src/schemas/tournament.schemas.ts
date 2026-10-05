import { z } from "zod";

export const tournamentRegistrationSchema = z.object({
  registrationMode: z.enum(["SOLO", "EXISTING_TEAM", "NEW_TEAM"]).default("SOLO"),
  inGameHandle: z
    .string()
    .min(2, "In-game handle must be at least 2 characters")
    .max(50, "In-game handle cannot exceed 50 characters"),
  preferredRoles: z
    .array(z.string().min(1).max(30))
    .min(1, "Select at least one preferred role or position")
    .max(5, "Maximum 5 roles"),
  teamName: z.string().max(80, "Team name cannot exceed 80 characters").optional().nullable(),
  discordHandle: z.string().max(60, "Discord tag cannot exceed 60 characters").optional().nullable(),
  agreedRules: z.literal(true, {
    errorMap: () => ({ message: "You must accept the tournament official rules and conduct code" }),
  }),
  agreedAntiCheat: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge anti-cheat and integrity requirements" }),
  }),
});
