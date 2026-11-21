import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";

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
  console.log('=== DATABASE VERIFICATION FOR QA STAGE 1 ===');

  const ClientClass = await getPrismaClient();
  const adapter = new PrismaPg({ connectionString: connectionString! });
  const prisma = new ClientClass({ adapter });

  try {
    // 1. Admin User
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        testingRank: true,
        testingPoints: true,
        createdAt: true,
      },
    });
    console.log('\n[1] Admin User Record:');
    console.log(JSON.stringify(admin, null, 2));

    // 2. Specific Stage 1 Campaigns
    const campaigns = await prisma.gameListing.findMany({
      where: {
        gameName: {
          in: ['QA Arena — Android', 'Velocity X — PC', 'Puzzle Realm — Web', 'Double Click Shield Test'],
        },
      },
      include: {
        category: true,
        amount: true,
        user: {
          select: { id: true, username: true, email: true, role: true },
        },
        _count: {
          select: { joinListings: true, bugReports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`\n[2] Found ${campaigns.length} Stage 1 Campaign Records in PostgreSQL:`);
    for (const c of campaigns) {
      console.log(JSON.stringify({
        id: c.id,
        gameName: c.gameName,
        platform: c.platform,
        categoryId: c.categoryId,
        categoryName: c.category?.categoryName,
        bounty: c.amount ? `${c.amount.amount} ${c.amount.currency}` : 'None',
        amountId: c.amountId,
        gameUrl: c.gameUrl,
        status: c.status,
        description: c.description,
        guides: c.guides,
        bugsListing: c.bugsListing,
        registrationEndDate: c.registrationEndDate,
        testingDeadline: c.testingDeadline,
        ownerId: c.userId,
        ownerUsername: c.user?.username,
        ownerRole: c.user?.role,
        enrolledTestersCount: c._count.joinListings,
        bugReportsCount: c._count.bugReports,
        createdAt: c.createdAt,
      }, null, 2));
    }

    // 3. Duplicate Records Check
    const nameCounts: Record<string, number> = {};
    for (const c of campaigns) {
      nameCounts[c.gameName] = (nameCounts[c.gameName] || 0) + 1;
    }
    console.log('\n[3] Duplicate Records Check:');
    console.log(nameCounts);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Verification script failed:", err);
  process.exit(1);
});
