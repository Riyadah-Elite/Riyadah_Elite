-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'ORG', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "TestingStatus" AS ENUM ('pending', 'inprogress', 'completed', 'failure');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('pending', 'inprogress', 'completed', 'failure');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('android', 'web', 'ios', 'windows', 'console', 'linux', 'macos');

-- CreateEnum
CREATE TYPE "BugStatus" AS ENUM ('open', 'inprogress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR', 'QAR', 'SDG', 'EUR');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('system', 'promotion', 'event');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "testingStatus" "TestingStatus" DEFAULT 'pending',
    "exitReason" TEXT,
    "tournamentStatus" "TournamentStatus" DEFAULT 'pending',
    "testingPoints" DOUBLE PRECISION DEFAULT 0,
    "testingRank" TEXT,
    "isNotificationAllowed" BOOLEAN NOT NULL DEFAULT false,
    "avatarId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "fileUrl" TEXT,
    "gameListingId" TEXT,
    "tournamentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amount" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameListing" (
    "id" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'active',
    "maxEntry" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minEntry" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "bugsListing" TEXT,
    "guides" TEXT,
    "platform" "Platform",
    "gameUrl" TEXT,
    "imageId" TEXT,
    "amountId" TEXT,
    "fileId" TEXT,
    "registrationEndDate" TIMESTAMP(3) NOT NULL,
    "testingDeadline" TIMESTAMP(3) NOT NULL,
    "scheduling" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentListing" (
    "id" TEXT NOT NULL,
    "tournamentName" TEXT NOT NULL,
    "gameListingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "tournamentDate" TIMESTAMP(3),
    "tournamentTime" TIMESTAMP(3),
    "maxEntry" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minEntry" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamSize" INTEGER NOT NULL DEFAULT 1,
    "status" "ListingStatus" NOT NULL DEFAULT 'active',
    "amountId" TEXT,
    "imageId" TEXT,
    "tournamentUrl" TEXT,
    "fileId" TEXT,
    "registrationEndDate" TIMESTAMP(3),
    "scheduling" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BugReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameListingId" TEXT NOT NULL,
    "bugDescription" TEXT NOT NULL,
    "imageId" TEXT,
    "fileId" TEXT,
    "status" "BugStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "markAsRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isDeleted_createdAt_idx" ON "User"("isDeleted", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistToken_token_key" ON "BlacklistToken"("token");

-- CreateIndex
CREATE INDEX "BlacklistToken_userId_idx" ON "BlacklistToken"("userId");

-- CreateIndex
CREATE INDEX "BlacklistToken_expiresAt_idx" ON "BlacklistToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "Category"("categoryName");

-- CreateIndex
CREATE INDEX "Notification_userId_markAsRead_idx" ON "Notification"("userId", "markAsRead");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_createdAt_idx" ON "ChatMessage"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlacklistToken" ADD CONSTRAINT "BlacklistToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_gameListingId_fkey" FOREIGN KEY ("gameListingId") REFERENCES "GameListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "TournamentListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_amountId_fkey" FOREIGN KEY ("amountId") REFERENCES "Amount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentListing" ADD CONSTRAINT "TournamentListing_gameListingId_fkey" FOREIGN KEY ("gameListingId") REFERENCES "GameListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentListing" ADD CONSTRAINT "TournamentListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentListing" ADD CONSTRAINT "TournamentListing_amountId_fkey" FOREIGN KEY ("amountId") REFERENCES "Amount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentListing" ADD CONSTRAINT "TournamentListing_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentListing" ADD CONSTRAINT "TournamentListing_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_gameListingId_fkey" FOREIGN KEY ("gameListingId") REFERENCES "GameListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
