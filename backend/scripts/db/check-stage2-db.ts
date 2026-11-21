import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

dotenv.config({ path: "./.env" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function getPrismaClient() {
  try {
    const generated = await import("../../src/generated/prisma/client.js");
    return generated.PrismaClient;
  } catch {
    const fallback = await import("@prisma/client");
    return fallback.PrismaClient;
  }
}

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const PrismaClient = await getPrismaClient();
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("=== CHECKING DATABASE ENROLLMENTS & BUGS ===");
    const users = await prisma.user.findMany({
      where: { username: { startsWith: "qa.player" } },
      select: { id: true, username: true, email: true, testingRank: true, testingPoints: true },
    });
    console.log("USERS:", JSON.stringify(users, null, 2));

    const enrollments = await prisma.joinListing.findMany({
      where: { userId: { in: users.map(u => u.id) } },
      include: { gameListing: { select: { id: true, gameName: true } } },
    });
    console.log("ENROLLMENTS COUNT:", enrollments.length);
    console.log("ENROLLMENTS:", JSON.stringify(enrollments, null, 2));

    const bugs = await prisma.bugReport.findMany({
      where: { userId: { in: users.map(u => u.id) } },
      include: {
        gameListing: { select: { gameName: true } },
        user: { select: { username: true } },
      },
    });
    console.log("BUGS COUNT:", bugs.length);
    console.log("BUGS:", JSON.stringify(bugs, null, 2));

  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error).finally(() => process.exit(0));
