import { z } from "zod";

export const createGameSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  studio: z.string().max(100).optional(),
  genre: z.string().min(2).max(50),
  platform: z.string().min(2).max(50),
  stage: z.string().min(2).max(50).default("Beta"),
  version: z.string().max(50).optional().nullable(),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  focusAreas: z.array(z.string()).max(10).default([]),
  requirements: z.array(z.string()).max(10).default([]),
  capacity: z.number().int().min(1).max(10000).default(100),
  rewardText: z.string().max(200).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateGameSchema = createGameSchema.partial();

export const createCampaignSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
  title: z.string().min(2).max(100),
  primaryFocus: z.string().min(2).max(100),
  targetTesters: z.number().int().min(5).max(1000).default(50),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  rewardPool: z.string().max(100).optional().nullable(),
});

export const updateDeveloperProfileSchema = z.object({
  studioName: z.string().min(2).max(100).optional(),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});

export const createSupportTicketSchema = z.object({
  category: z.enum(["TECHNICAL", "ESCROW", "TESTER_DISPUTE", "VERIFICATION"]),
  subject: z.string().min(3).max(150),
  description: z.string().min(10).max(3000),
});

export const submitVerificationSchema = z.object({
  entityType: z.enum(["STUDIO", "STUDENT", "SOLO"]).default("STUDIO"),
  legalEntityName: z.string().min(2, "Legal entity name is required").max(150),
  registrationNumber: z.string().min(2, "Commercial registration or ID is required").max(100),
  taxId: z.string().max(100).optional().nullable(),
  registeredAddress: z.string().min(5, "Registered address is required").max(300),
  country: z.string().default("Saudi Arabia"),
});
