import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function runAudit() {
  console.log('====================================================');
  console.log('RIYADAH ELITE — STAGE 8 DATABASE INTEGRITY AUDIT');
  console.log('====================================================\n');

  // 1. Users and Roles
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isDeleted: true,
      deletedAt: true,
      testingPoints: true,
      testingRank: true,
      isNotificationAllowed: true,
      avatarId: true,
      createdAt: true
    }
  });
  console.log(`[AUDIT] Total Users: ${users.length}`);
  const roleCounts: Record<string, number> = {};
  for (const u of users) {
    roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
  }
  console.log(`[AUDIT] User Roles Breakdown:`, JSON.stringify(roleCounts));

  // 2. Categories
  const categories = await prisma.category.findMany();
  console.log(`[AUDIT] Total Categories: ${categories.length}`);
  for (const c of categories) {
    console.log(`   - ${c.categoryName} (id: ${c.id}, adminId: ${c.adminId})`);
  }

  // 3. Game Listings
  const games = await prisma.gameListing.findMany({
    include: {
      category: true,
      user: { select: { username: true, role: true } },
      amount: true,
      joinListings: true,
      bugReports: true
    }
  });
  console.log(`\n[AUDIT] Total Game Listings: ${games.length}`);
  for (const g of games) {
    console.log(`   - "${g.gameName}" (id: ${g.id}) | Status: ${g.status} | Platform: ${g.platform} | Owner: ${g.user?.username || 'None'} (${g.user?.role}) | Enrolled: ${g.joinListings.length} | Bugs: ${g.bugReports.length}`);
    if (g.amount) {
      console.log(`     Bounty: ${g.amount.amount} ${g.amount.currency}`);
    }
  }

  // 4. Tournament Listings
  const tourneys = await prisma.tournamentListing.findMany({
    include: {
      gameListing: { select: { gameName: true } },
      user: { select: { username: true, role: true } },
      amount: true,
      joinListings: true
    }
  });
  console.log(`\n[AUDIT] Total Tournament Listings: ${tourneys.length}`);
  for (const t of tourneys) {
    console.log(`   - "${t.tournamentName}" (id: ${t.id}) | Game: ${t.gameListing.gameName} | Status: ${t.status} | Owner: ${t.user?.username} | Entries: ${t.joinListings.length}/${t.maxEntry} | TeamSize: ${t.teamSize}`);
    if (t.amount) {
      console.log(`     Prize Pool: ${t.amount.amount} ${t.amount.currency}`);
    }
  }

  // 5. JoinListings (Enrollments & Tournament Registrations)
  const joins = await prisma.joinListing.findMany({
    include: {
      user: { select: { username: true, role: true } },
      gameListing: { select: { gameName: true } },
      tournamentListing: { select: { tournamentName: true } }
    }
  });
  const gameJoins = joins.filter(j => j.gameListingId !== null);
  const tourneyJoins = joins.filter(j => j.tournamentListingId !== null);
  console.log(`\n[AUDIT] Total Join Records: ${joins.length}`);
  console.log(`   - Campaign Enlistments: ${gameJoins.length}`);
  for (const gj of gameJoins) {
    console.log(`     * User @${gj.user.username} -> Campaign "${gj.gameListing?.gameName}" (joined: ${gj.createdAt.toISOString()})`);
  }
  console.log(`   - Tournament Registrations: ${tourneyJoins.length}`);
  for (const tj of tourneyJoins) {
    console.log(`     * User @${tj.user.username} -> Tournament "${tj.tournamentListing?.tournamentName}" (joined: ${tj.createdAt.toISOString()})`);
  }

  // Check Duplicate Joins (Integrity Check)
  const userGamePairs = new Set<string>();
  let duplicateGameJoins = 0;
  for (const gj of gameJoins) {
    const key = `${gj.userId}_${gj.gameListingId}`;
    if (userGamePairs.has(key)) {
      duplicateGameJoins++;
    }
    userGamePairs.add(key);
  }

  const userTourneyPairs = new Set<string>();
  let duplicateTourneyJoins = 0;
  for (const tj of tourneyJoins) {
    const key = `${tj.userId}_${tj.tournamentListingId}`;
    if (userTourneyPairs.has(key)) {
      duplicateTourneyJoins++;
    }
    userTourneyPairs.add(key);
  }
  console.log(`[AUDIT] Duplicate Game Joins: ${duplicateGameJoins} (PASS if 0)`);
  console.log(`[AUDIT] Duplicate Tournament Joins: ${duplicateTourneyJoins} (PASS if 0)`);

  // 6. Bug Reports
  const bugs = await prisma.bugReport.findMany({
    include: {
      user: { select: { username: true } },
      gameListing: { select: { gameName: true } }
    }
  });
  console.log(`\n[AUDIT] Total Bug Reports: ${bugs.length}`);
  const bugStatusCounts: Record<string, number> = {};
  for (const b of bugs) {
    bugStatusCounts[b.status] = (bugStatusCounts[b.status] || 0) + 1;
    console.log(`   - [${b.status.toUpperCase()}] "${b.bugDescription.substring(0, 50)}..." | Reporter: @${b.user.username} | Game: "${b.gameListing.gameName}"`);
  }
  console.log(`[AUDIT] Bug Status Breakdown:`, JSON.stringify(bugStatusCounts));

  // 7. Files and Storage References
  const files = await prisma.file.findMany();
  console.log(`\n[AUDIT] Total File Records: ${files.length}`);
  let inlineBase64Count = 0;
  let minioUrlCount = 0;
  for (const f of files) {
    if (f.imageUrl && f.imageUrl.startsWith('data:')) {
      inlineBase64Count++;
    }
    if (f.imageUrl && f.imageUrl.includes('localhost:9000')) {
      minioUrlCount++;
    }
  }
  console.log(`   - MinIO Object References: ${minioUrlCount}`);
  console.log(`   - Resilient Inline Fallbacks: ${inlineBase64Count}`);

  // 8. Notifications
  const notifications = await prisma.notification.findMany();
  console.log(`\n[AUDIT] Total Notifications: ${notifications.length}`);
  const readCount = notifications.filter(n => n.markAsRead).length;
  console.log(`   - Read: ${readCount}, Unread: ${notifications.length - readCount}`);

  // 9. Blacklist Tokens & Soft Deleted Records
  const blacklists = await prisma.blacklistToken.findMany();
  console.log(`\n[AUDIT] Blacklisted / Revoked Tokens: ${blacklists.length}`);
  const softDeletedUsers = users.filter(u => u.isDeleted);
  console.log(`[AUDIT] Soft-Deleted Users: ${softDeletedUsers.length}`);
  for (const sdu of softDeletedUsers) {
    console.log(`   - Suspended User: @${sdu.username} (deletedAt: ${sdu.deletedAt?.toISOString()})`);
  }

  // 10. Referential Integrity & Orphan Checks
  console.log('\n--- ORPHAN & REFERENTIAL INTEGRITY AUDIT ---');
  // Check orphaned GameListings (invalid categoryId)
  const categoryIds = new Set(categories.map(c => c.id));
  const orphanedGames = games.filter(g => !categoryIds.has(g.categoryId));
  console.log(`[AUDIT] Orphaned GameListings (missing category): ${orphanedGames.length}`);

  // Check orphaned Tournaments (missing gameListingId)
  const gameIds = new Set(games.map(g => g.id));
  const orphanedTourneys = tourneys.filter(t => !gameIds.has(t.gameListingId));
  console.log(`[AUDIT] Orphaned Tournaments (missing gameListing): ${orphanedTourneys.length}`);

  // Check orphaned JoinListings
  const userIds = new Set(users.map(u => u.id));
  const orphanedJoins = joins.filter(j => !userIds.has(j.userId));
  console.log(`[AUDIT] Orphaned JoinListings (missing user): ${orphanedJoins.length}`);

  // Check orphaned BugReports
  const orphanedBugs = bugs.filter(b => !userIds.has(b.userId) || !gameIds.has(b.gameListingId));
  console.log(`[AUDIT] Orphaned BugReports: ${orphanedBugs.length}`);

  console.log('\n====================================================');
  console.log('DATABASE INTEGRITY AUDIT COMPLETE');
  console.log('====================================================');
}

runAudit().catch(console.error).finally(() => pool.end());
