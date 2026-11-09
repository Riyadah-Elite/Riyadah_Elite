import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterGames,
  filterTournaments,
  calculateBugReportPoints,
  validateBugReportInput,
  sortTesterRankings,
  splitLeaderboardPodium,
  filterNotifications,
  verifyFourStyleThemeTokens,
  resolveInitialTheme,
  type GameItem,
  type TournamentItem,
  type TesterRankingEntry,
  type NotificationItem,
} from './ecosystemRules.ts';

const sampleGames: GameItem[] = [
  {
    id: 'g1',
    slug: 'eclipse-protocol',
    title: 'Eclipse Protocol',
    studio: 'Vanguard Interactive',
    category: 'Extraction Sci-Fi',
    platforms: ['PC', 'PS5'],
    description: 'Zero-gravity tactical extraction shooter.',
    testingStatus: 'Bug Bounty Active',
    buildVersion: 'v0.9.4-RC2',
    activeTesters: 420,
    verifiedBugsResolved: 138,
    bountyRewardPoints: 250,
    artworkUrl: '/assets/images/games/eclipse-protocol.svg',
    testObjectives: ['Orbital airlock physics', 'Squad voice relay'],
  },
  {
    id: 'g2',
    slug: 'valkyrie-drift',
    title: 'Valkyrie Drift: Zero',
    studio: 'Aether Works',
    category: 'Cyber Racing',
    platforms: ['PC', 'Xbox Series X'],
    description: 'Precision telemetry-driven canyon racing.',
    testingStatus: 'Open Playtest',
    buildVersion: 'v0.7.1-BETA',
    activeTesters: 310,
    verifiedBugsResolved: 94,
    bountyRewardPoints: 180,
    artworkUrl: '/assets/images/games/valkyrie-drift.svg',
    testObjectives: ['Tire slip ratio curve', '120Hz frame pacing'],
  },
];

test('filterGames filters accurately by testing status, category, and search query', () => {
  const byStatus = filterGames(sampleGames, 'Open Playtest', 'All', '');
  assert.equal(byStatus.length, 1);
  assert.equal(byStatus[0].id, 'g2');

  const byQuery = filterGames(sampleGames, 'All', 'All', 'orbital');
  assert.equal(byQuery.length, 0);

  const byTitle = filterGames(sampleGames, 'All', 'Extraction Sci-Fi', 'eclipse');
  assert.equal(byTitle.length, 1);
  assert.equal(byTitle[0].slug, 'eclipse-protocol');
});

test('filterTournaments filters by status and search text', () => {
  const sampleTournaments: TournamentItem[] = [
    {
      id: 't1',
      title: 'NEXUS Championship Cup',
      gameTitle: 'Eclipse Protocol',
      date: 'Nov 18, 2026',
      registrationDeadline: 'Nov 15, 2026',
      slotsFilled: 58,
      slotsTotal: 64,
      prizePool: '$25,000',
      format: 'Double Elimination',
      region: 'MENA & EU',
      status: 'Registration Open',
      bannerUrl: '/assets/images/tournaments/nexus-championship-cup.svg',
      bracket: [],
    },
  ];
  assert.equal(filterTournaments(sampleTournaments, 'Registration Open', 'nexus').length, 1);
  assert.equal(filterTournaments(sampleTournaments, 'Completed', '').length, 0);
});

test('calculateBugReportPoints returns accurate severity points', () => {
  assert.equal(calculateBugReportPoints('Critical'), 250);
  assert.equal(calculateBugReportPoints('High'), 150);
  assert.equal(calculateBugReportPoints('Medium'), 85);
  assert.equal(calculateBugReportPoints('Low'), 40);
});

test('validateBugReportInput enforces required reproduction fields', () => {
  const invalid = validateBugReportInput({
    title: 'Short',
    gameId: 'g1',
    reproductionSteps: '1. Open game 2. Crash',
    expectedResult: 'Runs',
    actualResult: 'Crashes',
  });
  assert.equal(invalid.valid, false);

  const valid = validateBugReportInput({
    title: 'Airlock door desyncs when two players interact simultaneously',
    gameId: 'g1',
    reproductionSteps: '1. Load Sector 4 airlock. 2. Trigger console A and B within 100ms.',
    expectedResult: 'Door state locks to first authority packet.',
    actualResult: 'Door oscillates between open and closed states.',
  });
  assert.equal(valid.valid, true);
});

test('sortTesterRankings and splitLeaderboardPodium separate top-3 podium from remaining rows', () => {
  const raw: TesterRankingEntry[] = [
    {
      rank: 2,
      id: 'u1',
      handle: 'Kestrel_QA',
      roleTitle: 'Frame Analyst',
      tier: 'Senior Analyst',
      reputationPoints: 3200,
      verifiedBugs: 41,
      criticalBugs: 8,
      playtestsCompleted: 14,
      reproductionAccuracy: '96%',
    },
    {
      rank: 1,
      id: 'u2',
      handle: 'Nadia_Vanguard',
      roleTitle: 'Lead Netcode Verifier',
      tier: 'Apex Verifier',
      reputationPoints: 4850,
      verifiedBugs: 68,
      criticalBugs: 19,
      playtestsCompleted: 22,
      reproductionAccuracy: '99%',
    },
    {
      rank: 3,
      id: 'u3',
      handle: 'Tariq_QA',
      roleTitle: 'Shader Analyst',
      tier: 'Apex Verifier',
      reputationPoints: 4100,
      verifiedBugs: 55,
      criticalBugs: 12,
      playtestsCompleted: 19,
      reproductionAccuracy: '98%',
    },
    {
      rank: 4,
      id: 'u4',
      handle: 'Rami_Nexus',
      roleTitle: 'UI Verifier',
      tier: 'Core Playtester',
      reputationPoints: 2900,
      verifiedBugs: 30,
      criticalBugs: 5,
      playtestsCompleted: 11,
      reproductionAccuracy: '95%',
    },
  ];
  const sorted = sortTesterRankings(raw);
  assert.equal(sorted[0].handle, 'Nadia_Vanguard');
  const { podium, remaining } = splitLeaderboardPodium(sorted);
  assert.equal(podium.length, 3);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].handle, 'Rami_Nexus');
});

test('filterNotifications filters unread items and verifyFourStyleThemeTokens validates single theme object', () => {
  const sampleNotifs: NotificationItem[] = [
    {
      id: 'n1',
      category: 'Bug Verification',
      title: 'Bug Verified',
      detail: 'Confirmed',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n2',
      category: 'Playtest Build',
      title: 'Build Live',
      detail: 'Deployed',
      time: '1d ago',
      unread: false,
    },
  ];
  assert.equal(filterNotifications(sampleNotifs, 'unread').length, 1);
  assert.equal(filterNotifications(sampleNotifs, 'all').length, 2);
  assert.equal(verifyFourStyleThemeTokens(), true);
});

test('resolveInitialTheme respects stored mode and NEXUS dark default fallback', () => {
  assert.equal(resolveInitialTheme('light', true), 'light');
  assert.equal(resolveInitialTheme('dark', false), 'dark');
  assert.equal(resolveInitialTheme(null, true), 'dark');
  assert.equal(resolveInitialTheme(null, false), 'dark');
});

test('verifyUniqueSectionAnimations confirms all 14 sections have distinct primary animation identities and resolveMotionProfile maps viewports accurately', async () => {
  const {
    verifyUniqueSectionAnimations,
    resolveMotionProfile,
    resolveHeroScrollStage,
    resolveFragmentationConvergenceState,
  } = await import('./ecosystemRules.ts');
  const result = verifyUniqueSectionAnimations();
  assert.equal(result.totalSections, 14);
  assert.equal(result.uniquePrimaryCount, 14);
  assert.equal(result.allUnique, true);

  assert.equal(resolveMotionProfile(1440, false), 'desktop');
  assert.equal(resolveMotionProfile(820, false), 'tablet');
  assert.equal(resolveMotionProfile(390, false), 'mobile');
  assert.equal(resolveMotionProfile(1440, true), 'reduced');

  // Verify Hero 3-phase scroll stage progression (PLAY -> TEST -> WIN)
  const heroStart = resolveHeroScrollStage(0.05, 'desktop');
  assert.equal(heroStart.activePhase, 'PLAY');
  assert.equal(heroStart.testingOverlayOpacity, 0);

  const heroMid = resolveHeroScrollStage(0.5, 'desktop');
  assert.equal(heroMid.activePhase, 'TEST');
  assert.equal(heroMid.testingOverlayOpacity, 1);
  assert.equal(heroMid.winningOverlayOpacity, 0);

  const heroEnd = resolveHeroScrollStage(0.88, 'desktop');
  assert.equal(heroEnd.activePhase, 'WIN');
  assert.equal(heroEnd.winningOverlayOpacity, 1);
  assert.equal(heroEnd.cameraScale > 1.1, true);

  // Reduced motion bypasses Hero camera zoom and reveals all content immediately
  const heroReduced = resolveHeroScrollStage(0.1, 'reduced');
  assert.equal(heroReduced.cameraScale, 1);
  assert.equal(heroReduced.testingOverlayOpacity, 1);
  assert.equal(heroReduced.winningOverlayOpacity, 1);

  // Verify Fragmentation-to-Convergence continuous sequence
  const fragState = resolveFragmentationConvergenceState(0.25, 'desktop');
  assert.equal(fragState.phase, 'fragmented');
  assert.equal(fragState.driftMultiplier > 0.5, true);

  const convState = resolveFragmentationConvergenceState(0.6, 'desktop');
  assert.equal(convState.phase, 'converging');
  assert.equal(convState.convergencePathLength > 0.5, true);

  const uniState = resolveFragmentationConvergenceState(0.92, 'desktop');
  assert.equal(uniState.phase, 'unified');
  assert.equal(uniState.unifiedLockProgress, 1);
});

test('theme.ts enforces the official Riyadah Elite colour system (Obsidian, Navy, Slate, Violet, Cyan, Electric Blue, White) with zero obsolete lime or mint tokens', async () => {
  const { theme } = await import('../theme/theme.ts');
  assert.equal(theme.dark.backgrounds.canvas, '#0B0D12');
  assert.equal(theme.dark.backgrounds.surface, '#11141C');
  assert.equal(theme.dark.backgrounds.card, '#181C26');
  assert.equal(theme.dark.colors.primary, '#8B5CF6');
  assert.equal(theme.dark.colors.secondary, '#22D3EE');
  assert.equal(theme.dark.colors.accent, '#3B82F6');
  assert.equal(theme.dark.text.primary, '#F8FAFC');

  assert.equal(theme.light.colors.primary, '#6D28D9');
  assert.equal(theme.light.colors.secondary, '#0891B2');
  assert.equal(theme.light.colors.accent, '#2563EB');

  const serializedTheme = JSON.stringify(theme).toUpperCase();
  assert.equal(serializedTheme.includes(['#B8F', 'F3B'].join('')), false);
  assert.equal(serializedTheme.includes(['#35D', '49A'].join('')), false);
  assert.equal(serializedTheme.includes(['#A3E', '635'].join('')), false);

  // Verify Tailwind CSS v4 @theme semantic utility tokens are registered in theme classes & styles
  assert.equal(theme.dark.classes.canvas.includes('bg-canvas'), true);
  assert.equal(theme.light.classes.canvas.includes('bg-canvas'), true);
  assert.equal(theme.dark.classes.card.includes('bg-card'), true);
  assert.equal(theme.light.classes.card.includes('bg-card'), true);
  assert.equal(theme.dark.styles.bauhaus.architecturalCard.includes('shadow-bauhaus'), true);
  assert.equal(theme.dark.styles.clay.card.includes('shadow-clay-card'), true);
  assert.equal(theme.dark.styles.neumorphic.shell.includes('shadow-neu-shell'), true);
});

test('RIYADAH_CHARACTER_CAST defines all 6 original characters with transparent PNG cutouts and ANIMATION_AUDIT_DECISIONS covers all 14 sections', async () => {
  const {
    RIYADAH_CHARACTER_CAST,
    resolveCharacterByHandle,
    ANIMATION_AUDIT_DECISIONS,
  } = await import('./ecosystemRules.ts');

  assert.equal(RIYADAH_CHARACTER_CAST.length, 6);
  for (const char of RIYADAH_CHARACTER_CAST) {
    assert.equal(char.cutoutUrl.startsWith('/assets/generated/characters/'), true);
    assert.equal(char.cutoutUrl.endsWith('.png'), true);
  }

  const nadia = resolveCharacterByHandle('Nadia_Vanguard');
  assert.equal(nadia.id, 'char-nadia-vanguard');

  const tariq = resolveCharacterByHandle('Tariq_QA_Core');
  assert.equal(tariq.id, 'char-tariq-kestrel');

  assert.equal(ANIMATION_AUDIT_DECISIONS.length, 14);
});

test('verifyAllRiyadahAssets validates all 28 generated PNG/PNG32 headers, dimensions, RGBA channels, and 25 retained SVGs', async () => {
  const { verifyAllRiyadahAssets } = await import('../../scripts/verifyAssets.ts');
  const audit = verifyAllRiyadahAssets();
  assert.equal(audit.errors.length, 0, `Asset verification errors: ${audit.errors.join('; ')}`);
  assert.equal(audit.passed, true);
  assert.equal(audit.verifiedPngCount, 28);
  assert.equal(audit.verifiedSvgCount, 25);
});

test('SEO, GEO & AEO StructuredData JSON-LD graph, dynamic sitemap, and robots configuration validate all entities', async () => {
  const { buildCompleteEcosystemGraphJsonLd, FAQ_ENTITIES } = await import(
    '../components/seo/StructuredData.ts'
  );
  const { default: sitemap } = await import('../app/sitemap.ts');
  const { default: robots } = await import('../app/robots.ts');

  const graphDoc = buildCompleteEcosystemGraphJsonLd('https://riyadahelite.gg', 'nexus', 'bug-reports');
  assert.equal(graphDoc['@context'], 'https://schema.org');
  assert.equal(graphDoc['@graph'].length, 6);
  assert.equal(FAQ_ENTITIES.length, 10);

  const sitemapEntries = sitemap();
  assert.equal(sitemapEntries.length, 15); // 5 core routes + 6 games + 4 tournaments

  const robotsCfg = robots();
  assert.equal(robotsCfg.sitemap, 'https://riyadahelite.gg/sitemap.xml');
  assert.equal(robotsCfg.rules.length, 2);
});

test('PublicLandingPage, root app integration, and universal media primitives sequence all 14 cinematic sections with zero legacy tokens', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // Verify PublicLandingPage mounts LandingSectionsTop, LandingSectionsDynamic, LandingSectionsBottom
  const publicLandingSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/landing/PublicLandingPage.tsx'),
    'utf-8'
  );
  assert.equal(publicLandingSource.includes('LandingSectionsTop'), true);
  assert.equal(publicLandingSource.includes('LandingSectionsDynamic'), true);
  assert.equal(publicLandingSource.includes('LandingSectionsBottom'), true);
  assert.equal(publicLandingSource.includes('data-testid="public-landing-page"'), true);

  // Verify root entry app/index.tsx routes to App
  const rootIndexSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/app/index.tsx'),
    'utf-8'
  );
  assert.equal(rootIndexSource.includes("import App from '../App'"), true);

  // Verify App.tsx mounts PublicLandingPage
  const appSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/App.tsx'),
    'utf-8'
  );
  assert.equal(appSource.includes('<PublicLandingPage'), true);

  // Verify universal Image and primitives are exported
  const primitivesSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/primitives.tsx'),
    'utf-8'
  );
  assert.equal(primitivesSource.includes('export const Image:'), true);
  assert.equal(primitivesSource.includes('useResponsiveLayout'), true);

  // Confirm zero legacy lime or mint color values across all 3 landing components
  const topSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/LandingSectionsTop.tsx'),
    'utf-8'
  );
  const dynSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/LandingSectionsDynamic.tsx'),
    'utf-8'
  );
  const btmSource = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/LandingSectionsBottom.tsx'),
    'utf-8'
  );

  const combined = (topSource + dynSource + btmSource).toLowerCase();
  assert.equal(combined.includes('#b8ff3b'), false);
  assert.equal(combined.includes('#45dfa4'), false);
  assert.equal(combined.includes('#35d49a'), false);
  assert.equal(combined.includes('#a3e635'), false);
});




