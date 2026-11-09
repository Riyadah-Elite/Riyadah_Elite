import { type ThemeMode, theme } from '../theme/theme.ts';

export type PlaytestStatus = 'Open Playtest' | 'Closed Beta' | 'Bug Bounty Active' | 'Live Release';

export interface GameItem {
  id: string;
  slug: string;
  title: string;
  studio: string;
  category: 'Tactical Shooter' | 'Cyber Racing' | 'Action RPG' | 'Extraction Sci-Fi' | 'Strategy Arena';
  platforms: string[];
  description: string;
  testingStatus: PlaytestStatus;
  buildVersion: string;
  activeTesters: number;
  verifiedBugsResolved: number;
  bountyRewardPoints: number;
  artworkUrl: string;
  testObjectives: string[];
}

export type TournamentStatus = 'Registration Open' | 'Live Bracket' | 'Completed';

export interface BracketMatch {
  id: string;
  round: 'Quarterfinals' | 'Semifinals' | 'Grand Final';
  teamA: string;
  scoreA: number;
  teamB: string;
  scoreB: number;
  winner?: string;
  status: 'Completed' | 'Live' | 'Upcoming';
}

export interface TournamentItem {
  id: string;
  title: string;
  gameTitle: string;
  date: string;
  registrationDeadline: string;
  slotsFilled: number;
  slotsTotal: number;
  prizePool: string;
  format: string;
  region: string;
  status: TournamentStatus;
  bannerUrl: string;
  bracket: BracketMatch[];
}

export interface TesterRankingEntry {
  rank: number;
  id: string;
  handle: string;
  roleTitle: string;
  tier: 'Apex Verifier' | 'Senior Analyst' | 'Core Playtester';
  reputationPoints: number;
  verifiedBugs: number;
  criticalBugs: number;
  playtestsCompleted: number;
  reproductionAccuracy: string;
}

export interface TournamentStandingEntry {
  rank: number;
  id: string;
  handle: string;
  teamName: string;
  region: string;
  tournamentPoints: number;
  tournamentsWon: number;
  matchesWon: number;
  winRate: string;
}

export interface BugReportItem {
  id: string;
  gameId: string;
  gameTitle: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Crash / Freeze' | 'Network / Desync' | 'Visual / Shader' | 'Gameplay Balance';
  reproductionSteps: string;
  expectedResult: string;
  actualResult: string;
  reporterHandle: string;
  createdAt: string;
  status: 'Verified' | 'In Triage' | 'Resolved';
  pointsAwarded: number;
}

export interface NotificationItem {
  id: string;
  category: 'Bug Verification' | 'Tournament Bracket' | 'Playtest Build';
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export function filterGames(
  games: readonly GameItem[],
  statusFilter: string,
  categoryFilter: string,
  searchQuery: string
): GameItem[] {
  const q = searchQuery.trim().toLowerCase();
  return games.filter((g) => {
    const matchesStatus = statusFilter === 'All' || g.testingStatus === statusFilter;
    const matchesCategory = categoryFilter === 'All' || g.category === categoryFilter;
    const matchesSearch =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.studio.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q);
    return matchesStatus && matchesCategory && matchesSearch;
  });
}

export function filterTournaments(
  tournaments: readonly TournamentItem[],
  statusFilter: string,
  searchQuery: string
): TournamentItem[] {
  const q = searchQuery.trim().toLowerCase();
  return tournaments.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.gameTitle.toLowerCase().includes(q) ||
      t.region.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });
}

export function calculateBugReportPoints(severity: BugReportItem['severity']): number {
  switch (severity) {
    case 'Critical':
      return 250;
    case 'High':
      return 150;
    case 'Medium':
      return 85;
    case 'Low':
      return 40;
  }
}

export function validateBugReportInput(input: {
  title: string;
  gameId: string;
  reproductionSteps: string;
  expectedResult: string;
  actualResult: string;
}): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length < 6) {
    return { valid: false, error: 'Bug title must be at least 6 characters.' };
  }
  if (!input.gameId) {
    return { valid: false, error: 'Please select a target game build.' };
  }
  if (!input.reproductionSteps || input.reproductionSteps.trim().length < 12) {
    return { valid: false, error: 'Please provide clear reproduction steps (at least 12 characters).' };
  }
  if (!input.expectedResult.trim() || !input.actualResult.trim()) {
    return { valid: false, error: 'Both expected and actual results are required for triage.' };
  }
  return { valid: true };
}

export function sortTesterRankings(entries: readonly TesterRankingEntry[]): TesterRankingEntry[] {
  return [...entries]
    .sort((a, b) => b.reputationPoints - a.reputationPoints)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

export function splitLeaderboardPodium<T extends { rank: number }>(
  entries: readonly T[]
): { podium: T[]; remaining: T[] } {
  const sorted = [...entries].sort((a, b) => a.rank - b.rank);
  return {
    podium: sorted.slice(0, 3),
    remaining: sorted.slice(3),
  };
}

export function filterNotifications(
  items: readonly NotificationItem[],
  filter: 'all' | 'unread'
): NotificationItem[] {
  if (filter === 'unread') {
    return items.filter((n) => n.unread);
  }
  return [...items];
}

export function verifyFourStyleThemeTokens(): boolean {
  const modes: ThemeMode[] = ['dark', 'light'];
  return modes.every((m) => {
    const styleSet = theme[m].styles;
    return (
      Boolean(styleSet.bauhaus.sectionFrame) &&
      Boolean(styleSet.glass.navHeader) &&
      Boolean(styleSet.neumorphic.unreadRaised) &&
      Boolean(styleSet.neumorphic.readInset) &&
      Boolean(styleSet.clay.card) &&
      Boolean(styleSet.clay.tableContainer)
    );
  });
}

export function resolveInitialTheme(
  savedValue: string | null,
  prefersDark = true
): ThemeMode {
  if (savedValue === 'light' || savedValue === 'dark') {
    return savedValue;
  }
  return prefersDark ? 'dark' : 'dark';
}

export type MotionProfile = 'reduced' | 'mobile' | 'tablet' | 'desktop';

export function resolveMotionProfile(
  viewportWidth: number,
  prefersReducedMotion: boolean
): MotionProfile {
  if (prefersReducedMotion) return 'reduced';
  if (viewportWidth < theme.breakpoints.tablet) return 'mobile';
  if (viewportWidth < theme.breakpoints.laptop) return 'tablet';
  return 'desktop';
}

export interface SectionAnimationSpec {
  sectionIndex: string;
  sectionId: string;
  primaryAnimation: string;
  supportingAnimation: string;
  neighborDifferentiation: string;
}

export interface HeroStageState {
  activeWordIndex: 0 | 1 | 2;
  activePhase: 'PLAY' | 'TEST' | 'WIN';
  cameraScale: number;
  cameraTranslateY: number;
  mistOpacity: number;
  testingOverlayOpacity: number;
  winningOverlayOpacity: number;
}

export function resolveHeroScrollStage(
  progress: number,
  motionProfile: MotionProfile
): HeroStageState {
  const clamped = Math.min(1, Math.max(0, progress));

  if (motionProfile === 'reduced' || motionProfile === 'mobile') {
    return {
      activeWordIndex: 2,
      activePhase: 'WIN',
      cameraScale: 1,
      cameraTranslateY: 0,
      mistOpacity: 0.35,
      testingOverlayOpacity: 1,
      winningOverlayOpacity: 1,
    };
  }

  const scaleAmp = motionProfile === 'tablet' ? 0.08 : 0.18;
  const activeWordIndex: 0 | 1 | 2 =
    clamped < 0.30 ? 0 : clamped < 0.70 ? 1 : 2;
  const activePhase =
    activeWordIndex === 0 ? 'PLAY' : activeWordIndex === 1 ? 'TEST' : 'WIN';

  const testingOverlayOpacity =
    clamped < 0.22 ? 0 : clamped < 0.38 ? (clamped - 0.22) / 0.16 : 1;
  const winningOverlayOpacity =
    clamped < 0.62 ? 0 : clamped < 0.78 ? (clamped - 0.62) / 0.16 : 1;
  const mistOpacity =
    clamped < 0.65 ? 0.18 : 0.18 + ((clamped - 0.65) / 0.35) * 0.72;

  return {
    activeWordIndex,
    activePhase,
    cameraScale: Number((1 + clamped * scaleAmp).toFixed(3)),
    cameraTranslateY: Number((-clamped * 28).toFixed(1)),
    mistOpacity: Number(mistOpacity.toFixed(2)),
    testingOverlayOpacity: Number(Math.min(1, Math.max(0, testingOverlayOpacity)).toFixed(2)),
    winningOverlayOpacity: Number(Math.min(1, Math.max(0, winningOverlayOpacity)).toFixed(2)),
  };
}

export interface FragmentationConvergenceState {
  phase: 'fragmented' | 'converging' | 'unified';
  driftMultiplier: number;
  convergencePathLength: number;
  unifiedLockProgress: number;
}

export function resolveFragmentationConvergenceState(
  progress: number,
  motionProfile: MotionProfile
): FragmentationConvergenceState {
  const clamped = Math.min(1, Math.max(0, progress));

  if (motionProfile === 'reduced') {
    return {
      phase: 'unified',
      driftMultiplier: 0,
      convergencePathLength: 1,
      unifiedLockProgress: 1,
    };
  }

  // 0.00 -> 0.42: Problem Fragmentation increases outward drift
  // 0.42 -> 0.78: Paths converge inward toward the central Riyadah Elite core
  // 0.78 -> 1.00: Unified Solution ecosystem locks into alignment
  const phase =
    clamped < 0.42 ? 'fragmented' : clamped < 0.78 ? 'converging' : 'unified';

  const driftMultiplier =
    clamped < 0.42
      ? clamped / 0.42
      : Math.max(0, 1 - (clamped - 0.42) / 0.36);

  const convergencePathLength =
    clamped < 0.25
      ? 0.15
      : Math.min(1, 0.15 + ((clamped - 0.25) / 0.55) * 0.85);

  const unifiedLockProgress =
    clamped < 0.52 ? 0 : Math.min(1, (clamped - 0.52) / 0.36);

  return {
    phase,
    driftMultiplier: Number(driftMultiplier.toFixed(2)),
    convergencePathLength: Number(convergencePathLength.toFixed(2)),
    unifiedLockProgress: Number(unifiedLockProgress.toFixed(2)),
  };
}

export const SECTION_ANIMATION_REGISTRY: readonly SectionAnimationSpec[] = [
  {
    sectionIndex: '01',
    sectionId: 'section-01-hero',
    primaryAnimation: 'scroll-staged-arena-camera-and-play-test-win-progression',
    supportingAnimation: 'contextual-scene-hud-reveal-and-atmospheric-mist-bridge',
    neighborDifferentiation: 'Full-viewport scroll-controlled gaming arena progressing PLAY -> TEST -> WIN with camera depth zoom and rising mist transition into Section 02',
  },
  {
    sectionIndex: '02',
    sectionId: 'section-02-about',
    primaryAnimation: 'camera-pullback-tri-region-ecosystem-conduits',
    supportingAnimation: 'scroll-drawn-audience-paths-for-gamers-studios-orgs',
    neighborDifferentiation: 'Continuous camera pullback from Hero arena into a 3-region panoramic ecosystem map connected by live SVG conduits',
  },
  {
    sectionIndex: '03',
    sectionId: 'section-03-platform-overview',
    primaryAnimation: 'connected-four-pillar-architectural-circuit',
    supportingAnimation: 'scroll-advanced-bus-carrier-and-bespoke-pillar-geometry',
    neighborDifferentiation: 'Continuous geometric circuit linking Discovery, Testing, Bug Reporting, and Tournaments vs About tri-region map and Problem outward drift',
  },
  {
    sectionIndex: '04',
    sectionId: 'section-04-problem',
    primaryAnimation: 'scroll-controlled-outward-fragmentation-drift',
    supportingAnimation: 'fracturing-dashed-splines-feeding-continuous-convergence-bridge',
    neighborDifferentiation: '5 workflow nodes drift apart on scroll with fracturing splines that feed directly across the boundary into Section 05',
  },
  {
    sectionIndex: '05',
    sectionId: 'section-05-solution',
    primaryAnimation: 'continuous-five-path-convergence-into-unified-core',
    supportingAnimation: 'scroll-locked-solution-architecture-and-studio-triage-hub',
    neighborDifferentiation: 'Directly receives the 5 fragmented paths from Section 04 and converges them into a single aligned Riyadah Elite core',
  },
  {
    sectionIndex: '06',
    sectionId: 'section-06-how-it-works',
    primaryAnimation: 'guided-four-station-spatial-progression-path',
    supportingAnimation: 'scroll-illuminated-step-nodes-horizontal-desktop-vertical-mobile',
    neighborDifferentiation: 'Extends Section 05 core conduit into a 4-station guided onboarding path vs Section 07 structured two-tier feature showcase',
  },
  {
    sectionIndex: '07',
    sectionId: 'section-07-features',
    primaryAnimation: 'two-tier-ecosystem-architecture-showcase',
    supportingAnimation: 'static-anchor-canvases-with-selective-technical-line-draws',
    neighborDifferentiation: 'Organised two-tier architectural showcase (2 large static anchor canvases + 6 structured capability modules) replacing repetitive card cascades',
  },
  {
    sectionIndex: '08',
    sectionId: 'section-08-games',
    primaryAnimation: 'immersive-spotlight-and-artwork-first-curtain-reveal',
    supportingAnimation: 'camera-scale-settle-followed-by-delayed-metadata-reveal',
    neighborDifferentiation: 'Large game artwork establishes first via curtain + scale settle before unboxed metadata appears 180ms later',
  },
  {
    sectionIndex: '09',
    sectionId: 'section-09-tournaments',
    primaryAnimation: 'competitive-arena-bracket-geometry-and-wing-reveal',
    supportingAnimation: 'proportional-slot-capacity-progress-bars-and-live-bracket-tree',
    neighborDifferentiation: 'Bracket-inspired arena geometry + proportional slot capacity fill vs Games artwork-first curtain and Rankings telemetry stage',
  },
  {
    sectionIndex: '10',
    sectionId: 'section-10-rankings',
    primaryAnimation: 'apex-verifier-telemetry-stage-and-rank-elevation',
    supportingAnimation: 'dual-track-verified-score-counters-and-accuracy-bars',
    neighborDifferentiation: 'Connected Top-3 telemetry console + dual-track rankings ledger vs Tournaments bracket arena and Community warm studio transition',
  },
  {
    sectionIndex: '11',
    sectionId: 'section-11-community',
    primaryAnimation: 'atmospheric-studio-to-player-mosaic-transition',
    supportingAnimation: 'connected-collaboration-channels-without-fabricated-stats',
    neighborDifferentiation: 'Gradual transition from competitive arena into a warm collaborative playtest lab visual + 3 connected participation channels',
  },
  {
    sectionIndex: '12',
    sectionId: 'section-12-faq',
    primaryAnimation: 'calm-editorial-accessible-accordion-disclosure',
    supportingAnimation: 'keyboard-accessible-plus-minus-indicator-transition',
    neighborDifferentiation: 'Restrained editorial two-column accordion layout without scroll-pinning before Section 13 concluding portal',
  },
  {
    sectionIndex: '13',
    sectionId: 'section-13-final-cta',
    primaryAnimation: 'concluding-horizon-portal-geometric-expansion',
    supportingAnimation: 'return-of-arena-volumetric-lighting-and-dual-ctas',
    neighborDifferentiation: 'Brings back the Act I atmospheric lighting in a concluding geometric portal expansion above the quiet editorial footer',
  },
  {
    sectionIndex: '14',
    sectionId: 'section-14-footer',
    primaryAnimation: 'static-editorial-closing-horizon',
    supportingAnimation: 'top-structural-axis-draw-with-zero-continuous-motion',
    neighborDifferentiation: 'Calm static editorial closing layout grounding the entire 14-section journey',
  },
];

export function verifyUniqueSectionAnimations(): {
  totalSections: number;
  uniquePrimaryCount: number;
  allUnique: boolean;
} {
  const primaries = new Set(SECTION_ANIMATION_REGISTRY.map((s) => s.primaryAnimation));
  return {
    totalSections: SECTION_ANIMATION_REGISTRY.length,
    uniquePrimaryCount: primaries.size,
    allUnique:
      SECTION_ANIMATION_REGISTRY.length === 14 &&
      primaries.size === SECTION_ANIMATION_REGISTRY.length,
  };
}

export interface RiyadahCharacter {
  id: string;
  name: string;
  handle: string;
  roleTitle: string;
  archetype:
    | 'Lead Gamer / Playtester'
    | 'Female Gamer / Playtester'
    | 'Game Developer'
    | 'QA Specialist'
    | 'Esports Competitor'
    | 'Community Representative';
  region: 'MENA · Riyadh' | 'MENA · Dubai' | 'GCC · Doha' | 'Levant · Amman' | 'EU-West · Berlin';
  accentHex: '#8B5CF6' | '#22D3EE' | '#3B82F6';
  cutoutUrl: string;
  specialty: string;
  signatureQuote: string;
}

export const RIYADAH_CHARACTER_CAST: readonly RiyadahCharacter[] = [
  {
    id: 'char-tariq-kestrel',
    name: 'Tariq Al-Mansoor',
    handle: 'Tariq_QA_Core',
    roleTitle: 'Graphics & Shader Pipeline Analyst',
    archetype: 'Lead Gamer / Playtester',
    region: 'MENA · Riyadh',
    accentHex: '#22D3EE',
    cutoutUrl: '/assets/generated/characters/tariq-kestrel-playtester.png',
    specialty: '120Hz Frame-Pacing & Volumetric Shader Verification',
    signatureQuote: 'Every frame spike tells a story if you capture the exact telemetry window.',
  },
  {
    id: 'char-nadia-vanguard',
    name: 'Nadia Al-Harbi',
    handle: 'Nadia_Vanguard',
    roleTitle: 'Principal Netcode & Frame Verifier',
    archetype: 'Female Gamer / Playtester',
    region: 'MENA · Riyadh',
    accentHex: '#8B5CF6',
    cutoutUrl: '/assets/generated/characters/nadia-vanguard-verifier.png',
    specialty: 'Zero-G Airlock Desyncs & Packet Authority Auditing',
    signatureQuote: 'Reproducible steps turn player frustration into an immediate studio hotfix.',
  },
  {
    id: 'char-zayd-architect',
    name: 'Zayd Al-Rashid',
    handle: 'Zayd_Mirage',
    roleTitle: 'Lead Systems & Combat Architect',
    archetype: 'Game Developer',
    region: 'MENA · Dubai',
    accentHex: '#3B82F6',
    cutoutUrl: '/assets/generated/characters/zayd-architect-developer.png',
    specialty: 'Release Candidate Telemetry & Live Triage Integration',
    signatureQuote: 'Direct playtester reproduction logs save our engineering team weeks per milestone.',
  },
  {
    id: 'char-salma-hex',
    name: 'Salma Qasim',
    handle: 'Salma_Hex',
    roleTitle: 'Combat Balance & Telemetry Auditor',
    archetype: 'QA Specialist',
    region: 'Levant · Amman',
    accentHex: '#22D3EE',
    cutoutUrl: '/assets/generated/characters/salma-hex-qa-specialist.png',
    specialty: 'Collision Mesh Boundaries & Severity Classification',
    signatureQuote: 'Clean reproduction matrices bridge the gap between community labs and studio patches.',
  },
  {
    id: 'char-faisal-falcon',
    name: 'Faisal Al-Saud',
    handle: 'Faisal_Falcons',
    roleTitle: 'Riyadh Falcons Team Captain',
    archetype: 'Esports Competitor',
    region: 'MENA · Riyadh',
    accentHex: '#8B5CF6',
    cutoutUrl: '/assets/generated/characters/faisal-falcon-competitor.png',
    specialty: '5v5 Double Elimination Tactics & High-Stakes Extraction',
    signatureQuote: 'Testing pre-release builds gives our roster a structural edge when brackets go live.',
  },
  {
    id: 'char-elena-syndicate',
    name: 'Elena Rostova',
    handle: 'Elena_Syndicate',
    roleTitle: 'Championship Director & Guild Lead',
    archetype: 'Community Representative',
    region: 'EU-West · Berlin',
    accentHex: '#3B82F6',
    cutoutUrl: '/assets/generated/characters/elena-syndicate-community.png',
    specialty: 'Cross-Regional Bracket Operations & Playtest Guilds',
    signatureQuote: 'When studios, testers, and tournament hosts share one hub, the whole scene rises.',
  },
];

export function resolveCharacterByHandle(handle: string): RiyadahCharacter {
  const normalized = handle.toLowerCase();
  const match = RIYADAH_CHARACTER_CAST.find(
    (c) =>
      c.handle.toLowerCase() === normalized ||
      normalized.includes(c.name.split(' ')[0].toLowerCase())
  );
  if (match) return match;
  if (normalized.includes('kestrel')) return RIYADAH_CHARACTER_CAST[3];
  if (normalized.includes('rami') || normalized.includes('zephyr')) return RIYADAH_CHARACTER_CAST[0];
  return RIYADAH_CHARACTER_CAST[1];
}

export interface AnimationAuditEntry {
  sectionIndex: string;
  sectionName: string;
  decision: 'KEEP' | 'REPLACE' | 'REDESIGN' | 'REMOVE';
  rationale: string;
}

export const ANIMATION_AUDIT_DECISIONS: readonly AnimationAuditEntry[] = [
  {
    sectionIndex: '01',
    sectionName: 'Hero Arena Stage',
    decision: 'REDESIGN',
    rationale: 'Upgraded single-layer SVG zoom into multi-layer parallax depth stage combining background vista, volumetric light rays, transparent character cutouts, and rising mist.',
  },
  {
    sectionIndex: '02',
    sectionName: 'About Riyadah Elite',
    decision: 'KEEP',
    rationale: 'Retained scroll-drawn SVG tri-region conduits and radial expansion while pairing the 3 audience cards with transparent character cutouts.',
  },
  {
    sectionIndex: '03',
    sectionName: 'Platform Overview',
    decision: 'KEEP',
    rationale: 'Retained continuous 4-node horizontal SVG circuit bus and upgraded pillar preview frames with high-resolution PNG artwork.',
  },
  {
    sectionIndex: '04',
    sectionName: 'The Problem',
    decision: 'KEEP',
    rationale: 'Retained scroll-controlled outward fragmentation drift and 5-path convergence SVG spline bridge into Section 05.',
  },
  {
    sectionIndex: '05',
    sectionName: 'The Solution',
    decision: 'KEEP',
    rationale: 'Retained unified convergence lock and shape-morph cards while replacing placeholder SVG hub art with developer-triage-hub.png and character pairing.',
  },
  {
    sectionIndex: '06',
    sectionName: 'How It Works',
    decision: 'KEEP',
    rationale: 'Retained 4-station progressive SVG timeline on desktop and vertical spine on mobile, enriched with character role guides.',
  },
  {
    sectionIndex: '07',
    sectionName: 'Core Features',
    decision: 'REDESIGN',
    rationale: 'Enhanced Tier-1 static architectural anchors with editorial split-frame PNG showcases and subtle hover elevation without repetitive card cascades.',
  },
  {
    sectionIndex: '08',
    sectionName: 'Game Listings',
    decision: 'KEEP',
    rationale: 'Retained bottom-up mask curtain reveal, 3D perspective tilt, and contained image zoom, now showcasing bespoke 16:9 PNG game key art.',
  },
  {
    sectionIndex: '09',
    sectionName: 'Tournament Listings',
    decision: 'KEEP',
    rationale: 'Retained alternating horizontal clip-path banner wipes and proportional slot capacity bars, now backed by cinematic PNG tournament banners.',
  },
  {
    sectionIndex: '10',
    sectionName: 'Rankings / Leaderboard',
    decision: 'REDESIGN',
    rationale: 'Enhanced independent #1 -> #2 -> #3 podium rise with isolated transparent character cutouts and cyber particle atmosphere.',
  },
  {
    sectionIndex: '11',
    sectionName: 'Community & Character Cast',
    decision: 'REDESIGN',
    rationale: 'Combined 4-quadrant mosaic reveal with a 3-scene community gallery and the 6-character Riyadah Elite cast showcase.',
  },
  {
    sectionIndex: '12',
    sectionName: 'FAQ',
    decision: 'KEEP',
    rationale: 'Retained calm, accessible height accordion disclosure and geometric plus/minus indicator morph.',
  },
  {
    sectionIndex: '13',
    sectionName: 'Final CTA',
    decision: 'REDESIGN',
    rationale: 'Upgraded Horizon Portal climax with multi-layered PNG portal vista, volumetric light rays, foreground mist, and dual lead character cutouts.',
  },
  {
    sectionIndex: '14',
    sectionName: 'Footer',
    decision: 'KEEP',
    rationale: 'Retained calm editorial closing horizon with zero continuous motion.',
  },
];


