-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."OpportunityStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."RegistrationMode" AS ENUM ('SOLO', 'EXISTING_TEAM', 'NEW_TEAM');

-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('CONFIRMED', 'WAITLISTED', 'CHECKED_IN', 'WITHDRAWN', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('PLAYER', 'DEVELOPER', 'HOST', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."TournamentStatus" AS ENUM ('DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."AdminAuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameOpportunity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "studio" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'Beta',
    "version" TEXT,
    "description" TEXT NOT NULL,
    "focusAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "rewardText" TEXT,
    "imageUrl" TEXT,
    "status" "public"."OpportunityStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameTestingApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "platform" TEXT NOT NULL,
    "primaryGames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hardwareGpu" TEXT NOT NULL,
    "hardwareCpu" TEXT NOT NULL,
    "hardwareRam" TEXT NOT NULL,
    "availabilityHours" TEXT NOT NULL,
    "experienceNotes" TEXT,
    "agreedNda" BOOLEAN NOT NULL DEFAULT false,
    "agreedTelemetry" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameTestingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HealthCheck" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "country" TEXT DEFAULT 'Saudi Arabia',
    "city" TEXT DEFAULT 'Riyadh',
    "primaryPlatform" TEXT DEFAULT 'PC Windows',
    "favoriteGenres" TEXT[] DEFAULT ARRAY['FPS', 'Tactical Shooter']::TEXT[],
    "hardwareGpu" TEXT,
    "hardwareCpu" TEXT,
    "hardwareRam" TEXT,
    "hardwareOs" TEXT,
    "testerScore" INTEGER NOT NULL DEFAULT 0,
    "totalGamesTested" INTEGER NOT NULL DEFAULT 0,
    "avatarUrl" TEXT,
    "discordHandle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tournament" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "bracketType" TEXT NOT NULL DEFAULT 'Single Elimination',
    "platform" TEXT NOT NULL DEFAULT 'PC',
    "region" TEXT NOT NULL DEFAULT 'Middle East / MENA',
    "prizePool" TEXT,
    "entryFee" TEXT NOT NULL DEFAULT 'Free',
    "teamSize" INTEGER NOT NULL DEFAULT 5,
    "maxParticipants" INTEGER NOT NULL DEFAULT 64,
    "registrationDeadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "rules" TEXT[],
    "description" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "discordUrl" TEXT,
    "status" "public"."TournamentStatus" NOT NULL DEFAULT 'REGISTRATION_OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TournamentRegistration" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registrationMode" "public"."RegistrationMode" NOT NULL DEFAULT 'SOLO',
    "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "inGameHandle" TEXT NOT NULL,
    "preferredRoles" TEXT[],
    "teamName" TEXT,
    "discordHandle" TEXT,
    "agreedRules" BOOLEAN NOT NULL DEFAULT true,
    "agreedAntiCheat" BOOLEAN NOT NULL DEFAULT true,
    "ticketCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'PLAYER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_idx" ON "public"."AdminAuditLog"("action" ASC);

-- CreateIndex
CREATE INDEX "AdminAuditLog_actorId_idx" ON "public"."AdminAuditLog"("actorId" ASC);

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "public"."AdminAuditLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityType_idx" ON "public"."AdminAuditLog"("entityType" ASC);

-- CreateIndex
CREATE INDEX "GameOpportunity_slug_idx" ON "public"."GameOpportunity"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GameOpportunity_slug_key" ON "public"."GameOpportunity"("slug" ASC);

-- CreateIndex
CREATE INDEX "GameOpportunity_status_idx" ON "public"."GameOpportunity"("status" ASC);

-- CreateIndex
CREATE INDEX "GameTestingApplication_opportunityId_idx" ON "public"."GameTestingApplication"("opportunityId" ASC);

-- CreateIndex
CREATE INDEX "GameTestingApplication_status_idx" ON "public"."GameTestingApplication"("status" ASC);

-- CreateIndex
CREATE INDEX "GameTestingApplication_userId_idx" ON "public"."GameTestingApplication"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GameTestingApplication_userId_opportunityId_key" ON "public"."GameTestingApplication"("userId" ASC, "opportunityId" ASC);

-- CreateIndex
CREATE INDEX "PasswordResetToken_tokenHash_idx" ON "public"."PasswordResetToken"("tokenHash" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "public"."PasswordResetToken"("tokenHash" ASC);

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "public"."PasswordResetToken"("userId" ASC);

-- CreateIndex
CREATE INDEX "PlayerProfile_userId_idx" ON "public"."PlayerProfile"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_userId_key" ON "public"."PlayerProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "Tournament_game_idx" ON "public"."Tournament"("game" ASC);

-- CreateIndex
CREATE INDEX "Tournament_slug_idx" ON "public"."Tournament"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_slug_key" ON "public"."Tournament"("slug" ASC);

-- CreateIndex
CREATE INDEX "Tournament_status_idx" ON "public"."Tournament"("status" ASC);

-- CreateIndex
CREATE INDEX "TournamentRegistration_status_idx" ON "public"."TournamentRegistration"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRegistration_ticketCode_key" ON "public"."TournamentRegistration"("ticketCode" ASC);

-- CreateIndex
CREATE INDEX "TournamentRegistration_tournamentId_idx" ON "public"."TournamentRegistration"("tournamentId" ASC);

-- CreateIndex
CREATE INDEX "TournamentRegistration_userId_idx" ON "public"."TournamentRegistration"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRegistration_userId_tournamentId_key" ON "public"."TournamentRegistration"("userId" ASC, "tournamentId" ASC);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username" ASC);

-- AddForeignKey
ALTER TABLE "public"."GameTestingApplication" ADD CONSTRAINT "GameTestingApplication_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "public"."GameOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameTestingApplication" ADD CONSTRAINT "GameTestingApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerProfile" ADD CONSTRAINT "PlayerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "public"."Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

