import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    where: { username: { in: ['qa.player01', 'qa.player02', 'qa.player03', 'qa.player04'] } },
    select: { id: true }
  });
  const userIds = users.map(u => u.id);
  const deleted = await prisma.joinListing.deleteMany({
    where: {
      userId: { in: userIds },
      tournamentListingId: { not: null }
    }
  });
  console.log(`Reset ${deleted.count} tournament join records for QA players.`);
}

main().catch(console.error).finally(() => process.exit(0));
