import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: "./.env" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ Error: DATABASE_URL is not set in environment or .env file.");
  process.exit(1);
}

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
  const email = (process.env.ADMIN_EMAIL || "admin@riyadahelite.com").trim().toLowerCase();
  const username = (process.env.ADMIN_USERNAME || "Admin").trim();
  const password = process.env.ADMIN_PASSWORD || "Admin@123.";

  console.log(`[Seed Admin] Initializing admin seed for ${email}...`);
  const ClientClass = await getPrismaClient();
  const adapter = new PrismaPg({ connectionString: connectionString! });
  const prisma = new ClientClass({ adapter });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        username,
        password: hashedPassword,
        role: "ADMIN",
        isDeleted: false,
        testingPoints: 1500,
        testingRank: "Diamond 1",
      },
      create: {
        email,
        username,
        password: hashedPassword,
        role: "ADMIN",
        isDeleted: false,
        testingPoints: 1500,
        testingRank: "Diamond 1",
      },
    });

    console.log(`✅ [Seed Admin] Platform Steward (ADMIN) user ready:`);
    console.log(`   ID:       ${admin.id}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   Rank:     ${admin.testingRank} (${admin.testingPoints} pts)`);

    const defaultCategories = [
      "Action / FPS",
      "RPG / Adventure",
      "Strategy / Indie",
      "Mobile / Casual",
    ];

    console.log(`[Seed Categories] Bootstrapping default categories...`);
    for (const categoryName of defaultCategories) {
      await prisma.category.upsert({
        where: { categoryName },
        update: { adminId: admin.id },
        create: { categoryName, adminId: admin.id },
      });
      console.log(`   ✓ Category: ${categoryName}`);
    }
    console.log(`✅ [Seed Categories] Categories successfully provisioned.`);
  } catch (error) {
    console.error("❌ [Seed Admin] Failed to seed admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

