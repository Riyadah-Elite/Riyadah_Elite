ALTER TABLE "User"
ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deletedAt" TIMESTAMP(3),
ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "User_isDeleted_createdAt_idx"
ON "User"("isDeleted", "createdAt");
