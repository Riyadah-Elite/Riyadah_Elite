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
    const users = await prisma.user.findMany({
      where: { username: { startsWith: 'qa.player' } },
      select: { id: true, username: true, email: true, role: true, testingRank: true, testingPoints: true },
    });
    console.log('EXISTING PLAYERS IN DB:', JSON.stringify(users, null, 2));
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error).finally(() => process.exit(0));
