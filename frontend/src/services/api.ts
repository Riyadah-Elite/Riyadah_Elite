export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
}

export interface InternalAxiosRequestConfig {
  url?: string;
  method?: string;
  headers?: any;
  data?: any;
}

export interface AxiosInstance {
  interceptors: {
    request: {
      use: (fn: (config: any) => any) => void;
    };
    response: {
      use: (fn: (res: any) => any) => void;
    };
  };
  get: <T = any>(url: string, config?: any) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: any) => Promise<AxiosResponse<T>>;
}

import {
  type GameItem,
  type TournamentItem,
  type TesterRankingEntry,
  type TournamentStandingEntry,
  type BugReportItem,
  calculateBugReportPoints,
  sortTesterRankings,
} from '../utils/ecosystemRules.ts';

/**
 * Shared Axios Client & Domain API Services for Riyadah Elite
 * Uses one shared Axios instance with auth token interceptor, consistent error normalization,
 * and deterministic local data store so all sections and NEXUS routes operate reliably.
 */

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'game-eclipse-protocol',
    slug: 'eclipse-protocol',
    title: 'Eclipse Protocol',
    studio: 'Vanguard Interactive',
    category: 'Extraction Sci-Fi',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    description:
      'Squad-based tactical orbital extraction shooter featuring zero-gravity breach mechanics and dynamic telemetry objectives.',
    testingStatus: 'Bug Bounty Active',
    buildVersion: 'v0.9.4-RC2',
    activeTesters: 428,
    verifiedBugsResolved: 164,
    bountyRewardPoints: 250,
    artworkUrl: '/assets/generated/games/eclipse-protocol.png',
    testObjectives: [
      'Validate airlock depressurization physics at 120Hz frame rates',
      'Stress-test 24-player orbital extraction matchmaking relay',
      'Inspect weapon recoil patterns on controller vs. mouse input',
    ],
  },
  {
    id: 'game-valkyrie-drift',
    slug: 'valkyrie-drift',
    title: 'Valkyrie Drift: Zero',
    studio: 'Aether Velocity Studios',
    category: 'Cyber Racing',
    platforms: ['PC', 'PS5'],
    description:
      'High-speed precision canyon circuit racer with active aerodynamic telemetry, slipstream energy recovery, and custom suspension tuning.',
    testingStatus: 'Open Playtest',
    buildVersion: 'v0.8.2-BETA',
    activeTesters: 312,
    verifiedBugsResolved: 118,
    bountyRewardPoints: 180,
    artworkUrl: '/assets/generated/games/valkyrie-drift.png',
    testObjectives: [
      'Verify wet-asphalt tire grip curves in Sector 3 hairpins',
      'Report ghost replay desynchronization on leaderboards',
      'Test ultrawide HUD scaling on 21:9 displays',
    ],
  },
  {
    id: 'game-aether-bastion',
    slug: 'aether-bastion',
    title: 'Aether Bastion',
    studio: 'Monolith Forge',
    category: 'Strategy Arena',
    platforms: ['PC'],
    description:
      'Competitive 5v5 citadel siege and tactical territory control combining vertical traversal with modular bastion fortifications.',
    testingStatus: 'Open Playtest',
    buildVersion: 'v0.7.9-PLAYTEST',
    activeTesters: 276,
    verifiedBugsResolved: 203,
    bountyRewardPoints: 200,
    artworkUrl: '/assets/generated/games/aether-bastion.png',
    testObjectives: [
      'Evaluate siege ward line-of-sight collision meshes',
      'Measure server tick stability during final citadel collapse',
    ],
  },
  {
    id: 'game-chrono-sunder',
    slug: 'chrono-sunder',
    title: 'Chrono Sunder',
    studio: 'Riftline Digital',
    category: 'Action RPG',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    description:
      'Time-fractured boss-rush action RPG where co-op teams rewind combat timelines to parry phase-shifting anomalies.',
    testingStatus: 'Closed Beta',
    buildVersion: 'v0.6.5-CBT',
    activeTesters: 184,
    verifiedBugsResolved: 89,
    bountyRewardPoints: 220,
    artworkUrl: '/assets/generated/games/chrono-sunder.png',
    testObjectives: [
      'Check state rollback memory usage after 3 consecutive rewinds',
      'Verify co-op animation sync on Temporal Parry counters',
    ],
  },
  {
    id: 'game-sandstorm-vanguard',
    slug: 'sandstorm-vanguard',
    title: 'Sandstorm Vanguard',
    studio: 'DuneCrest Interactive',
    category: 'Tactical Shooter',
    platforms: ['PC', 'Xbox Series X'],
    description:
      'Combined-arms mechanized desert warfare featuring dynamic sandstorm visibility shifts and modular walker loadouts.',
    testingStatus: 'Bug Bounty Active',
    buildVersion: 'v0.9.1-RC1',
    activeTesters: 365,
    verifiedBugsResolved: 142,
    bountyRewardPoints: 250,
    artworkUrl: '/assets/generated/games/sandstorm-vanguard.png',
    testObjectives: [
      'Audit volumetric dust shader GPU memory footprint',
      'Test thermal optics contrast across day/night transitions',
    ],
  },
  {
    id: 'game-mythos-tactics',
    slug: 'mythos-tactics',
    title: 'Mythos Tactics',
    studio: 'HexCore Collective',
    category: 'Strategy Arena',
    platforms: ['PC', 'Mobile'],
    description:
      'Turn-based competitive hex-grid battler designed for Simultaneous Turn execution and tournament draft play.',
    testingStatus: 'Live Release',
    buildVersion: 'v1.2.0-LIVE',
    activeTesters: 510,
    verifiedBugsResolved: 312,
    bountyRewardPoints: 120,
    artworkUrl: '/assets/generated/games/mythos-tactics.png',
    testObjectives: [
      'Validate cross-platform mobile and desktop turn timer parity',
      'Verify spectator mode fog-of-war toggle behavior',
    ],
  },
];

export const INITIAL_TOURNAMENTS: TournamentItem[] = [
  {
    id: 'tourney-nexus-cup',
    title: 'NEXUS Championship Cup — Season IV',
    gameTitle: 'Eclipse Protocol',
    date: 'Nov 22, 2026',
    registrationDeadline: 'Nov 19, 2026',
    slotsFilled: 58,
    slotsTotal: 64,
    prizePool: '$25,000',
    format: 'Double Elimination (5v5)',
    region: 'MENA & Europe',
    status: 'Registration Open',
    bannerUrl: '/assets/generated/tournaments/nexus-championship-cup.png',
    bracket: [
      {
        id: 'm1',
        round: 'Quarterfinals',
        teamA: 'Riyadh Falcons',
        scoreA: 2,
        teamB: 'Orion Syndicate',
        scoreB: 1,
        winner: 'Riyadh Falcons',
        status: 'Completed',
      },
      {
        id: 'm2',
        round: 'Quarterfinals',
        teamA: 'Apex Mirage',
        scoreA: 2,
        teamB: 'Kestrel Nine',
        scoreB: 0,
        winner: 'Apex Mirage',
        status: 'Completed',
      },
      {
        id: 'm3',
        round: 'Semifinals',
        teamA: 'Riyadh Falcons',
        scoreA: 1,
        teamB: 'Apex Mirage',
        scoreB: 1,
        status: 'Live',
      },
      {
        id: 'm4',
        round: 'Grand Final',
        teamA: 'TBD Semifinal 1',
        scoreA: 0,
        teamB: 'Vanguard Zero',
        scoreB: 0,
        status: 'Upcoming',
      },
    ],
  },
  {
    id: 'tourney-valkyrie-sprint',
    title: 'Valkyrie Telemetry Grand Prix',
    gameTitle: 'Valkyrie Drift: Zero',
    date: 'Nov 14, 2026',
    registrationDeadline: 'Nov 12, 2026',
    slotsFilled: 32,
    slotsTotal: 32,
    prizePool: '$12,500',
    format: 'Time-Attack + Knockout Heats',
    region: 'Global Cross-Play',
    status: 'Live Bracket',
    bannerUrl: '/assets/generated/tournaments/valkyrie-speed-series.png',
    bracket: [
      {
        id: 'vm1',
        round: 'Semifinals',
        teamA: 'Zephyr_GT',
        scoreA: 3,
        teamB: 'ApexDrifter',
        scoreB: 2,
        winner: 'Zephyr_GT',
        status: 'Completed',
      },
      {
        id: 'vm2',
        round: 'Grand Final',
        teamA: 'Zephyr_GT',
        scoreA: 1,
        teamB: 'Tariq_Velocity',
        scoreB: 1,
        status: 'Live',
      },
    ],
  },
  {
    id: 'tourney-bastion-invitational',
    title: 'Aether Bastion Siege Invitational',
    gameTitle: 'Aether Bastion',
    date: 'Dec 04, 2026',
    registrationDeadline: 'Nov 30, 2026',
    slotsFilled: 24,
    slotsTotal: 32,
    prizePool: '$18,000',
    format: 'Swiss Stage into Top-8 Bracket',
    region: 'MENA Regional',
    status: 'Registration Open',
    bannerUrl: '/assets/generated/tournaments/bastion-invitational.png',
    bracket: [],
  },
  {
    id: 'tourney-mena-challenger',
    title: 'Sandstorm Vanguard Tactical Open',
    gameTitle: 'Sandstorm Vanguard',
    date: 'Oct 24, 2026',
    registrationDeadline: 'Oct 20, 2026',
    slotsFilled: 48,
    slotsTotal: 48,
    prizePool: '$10,000',
    format: 'Single Elimination',
    region: 'GCC & Levant',
    status: 'Completed',
    bannerUrl: '/assets/generated/tournaments/mena-challenger-open.png',
    bracket: [],
  },
];

const INITIAL_TESTER_RANKINGS: TesterRankingEntry[] = [
  {
    rank: 1,
    id: 'tester-1',
    handle: 'Nadia_Vanguard',
    roleTitle: 'Principal Netcode & Frame Verifier',
    tier: 'Apex Verifier',
    reputationPoints: 4850,
    verifiedBugs: 74,
    criticalBugs: 21,
    playtestsCompleted: 26,
    reproductionAccuracy: '99.2%',
  },
  {
    rank: 2,
    id: 'tester-2',
    handle: 'Tariq_QA_Core',
    roleTitle: 'Graphics & Shader Pipeline Analyst',
    tier: 'Apex Verifier',
    reputationPoints: 4490,
    verifiedBugs: 68,
    criticalBugs: 17,
    playtestsCompleted: 24,
    reproductionAccuracy: '98.5%',
  },
  {
    rank: 3,
    id: 'tester-3',
    handle: 'Kestrel_Zero',
    roleTitle: 'Collision & Physics Boundary Specialist',
    tier: 'Senior Analyst',
    reputationPoints: 3980,
    verifiedBugs: 59,
    criticalBugs: 14,
    playtestsCompleted: 21,
    reproductionAccuracy: '97.1%',
  },
  {
    rank: 4,
    id: 'tester-4',
    handle: 'Salma_Hex',
    roleTitle: 'Combat Balance & Telemetry Auditor',
    tier: 'Senior Analyst',
    reputationPoints: 3640,
    verifiedBugs: 52,
    criticalBugs: 11,
    playtestsCompleted: 19,
    reproductionAccuracy: '96.4%',
  },
  {
    rank: 5,
    id: 'tester-5',
    handle: 'Rami_Nexus',
    roleTitle: 'Cross-Platform Input & UI Verifier',
    tier: 'Core Playtester',
    reputationPoints: 3290,
    verifiedBugs: 46,
    criticalBugs: 9,
    playtestsCompleted: 17,
    reproductionAccuracy: '95.0%',
  },
];

const INITIAL_TOURNAMENT_STANDINGS: TournamentStandingEntry[] = [
  {
    rank: 1,
    id: 'comp-1',
    handle: 'Faisal_Falcons',
    teamName: 'Riyadh Falcons',
    region: 'MENA',
    tournamentPoints: 6200,
    tournamentsWon: 5,
    matchesWon: 42,
    winRate: '84.0%',
  },
  {
    rank: 2,
    id: 'comp-2',
    handle: 'Zayd_Mirage',
    teamName: 'Apex Mirage',
    region: 'MENA',
    tournamentPoints: 5740,
    tournamentsWon: 4,
    matchesWon: 38,
    winRate: '79.2%',
  },
  {
    rank: 3,
    id: 'comp-3',
    handle: 'Elena_Syndicate',
    teamName: 'Orion Syndicate',
    region: 'EU-West',
    tournamentPoints: 5310,
    tournamentsWon: 3,
    matchesWon: 35,
    winRate: '76.1%',
  },
  {
    rank: 4,
    id: 'comp-4',
    handle: 'Zephyr_GT',
    teamName: 'Velocity Protocol',
    region: 'GCC',
    tournamentPoints: 4890,
    tournamentsWon: 3,
    matchesWon: 31,
    winRate: '73.8%',
  },
  {
    rank: 5,
    id: 'comp-5',
    handle: 'Kareem_Vanguard',
    teamName: 'DuneCrest Five',
    region: 'Levant',
    tournamentPoints: 4420,
    tournamentsWon: 2,
    matchesWon: 28,
    winRate: '70.0%',
  },
];

const INITIAL_BUG_REPORTS: BugReportItem[] = [
  {
    id: 'BUG-9042',
    gameId: 'game-eclipse-protocol',
    gameTitle: 'Eclipse Protocol',
    title: 'Orbital Airlock Door State Desyncs Under Simultaneous Squad Interaction',
    severity: 'Critical',
    category: 'Network / Desync',
    reproductionSteps:
      '1. Load Orbital Sector 4 with 2+ players. 2. Interact with inner and outer airlock panels within a 100ms window.',
    expectedResult: 'Server authoritative lock resolves to first packet and rejects secondary trigger.',
    actualResult: 'Airlock door geometry oscillates rapidly and traps squad inside bulkhead.',
    reporterHandle: 'Nadia_Vanguard',
    createdAt: '2 hours ago',
    status: 'Verified',
    pointsAwarded: 250,
  },
  {
    id: 'BUG-9038',
    gameId: 'game-valkyrie-drift',
    gameTitle: 'Valkyrie Drift: Zero',
    title: 'Telemetry Slip-Angle Widget Clips on 360px Mobile Companion Viewport',
    severity: 'Medium',
    category: 'Visual / Shader',
    reproductionSteps:
      '1. Open Valkyrie Telemetry companion HUD at 360px width. 2. Enter Canyon Sector 3 hairpin.',
    expectedResult: 'Telemetry readout truncates cleanly within card container.',
    actualResult: 'Slip-angle label overlaps lap delta counter by 8px.',
    reporterHandle: 'Tariq_QA_Core',
    createdAt: '5 hours ago',
    status: 'Resolved',
    pointsAwarded: 85,
  },
  {
    id: 'BUG-9031',
    gameId: 'game-sandstorm-vanguard',
    gameTitle: 'Sandstorm Vanguard',
    title: 'Volumetric Dust Shader Frame-Time Spike When Switching Thermal Optics',
    severity: 'High',
    category: 'Crash / Freeze',
    reproductionSteps:
      '1. Enter active Category-4 sandstorm zone. 2. Toggle Thermal Optics 4 times in 3 seconds.',
    expectedResult: 'Post-processing shader buffer reuses existing volumetric texture pool.',
    actualResult: 'Frame time spikes from 8.2ms to 46ms due to redundant buffer allocation.',
    reporterHandle: 'Kestrel_Zero',
    createdAt: '1 day ago',
    status: 'In Triage',
    pointsAwarded: 150,
  },
];

// In-memory store backing the Axios local adapter
const store = {
  games: [...INITIAL_GAMES],
  tournaments: [...INITIAL_TOURNAMENTS],
  testerRankings: [...INITIAL_TESTER_RANKINGS],
  tournamentStandings: [...INITIAL_TOURNAMENT_STANDINGS],
  bugReports: [...INITIAL_BUG_REPORTS],
  enrolledGameIds: new Set<string>(['game-eclipse-protocol']),
  registeredTournamentIds: new Set<string>(['tourney-nexus-cup']),
  simulatedFailureEndpoint: null as string | null,
};

export function setSimulatedApiFailure(endpoint: string | null) {
  store.simulatedFailureEndpoint = endpoint;
}

const requestInterceptors: Array<(config: any) => any> = [];
const responseInterceptors: Array<(res: any) => any> = [];

async function handleApiRequest(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  let cfg = config;
  for (const interceptor of requestInterceptors) {
    try {
      cfg = interceptor(cfg) || cfg;
    } catch {}
  }

  const url = cfg.url || '';
  const method = (cfg.method || 'get').toLowerCase();

  if (store.simulatedFailureEndpoint && url.includes(store.simulatedFailureEndpoint)) {
    throw new Error(`Network Error: Unable to reach ${url}. Please retry.`);
  }

  const buildResponse = <T>(data: T, status = 200): AxiosResponse<T> => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: cfg,
  });

  if (method === 'get' && url === '/games') {
    return buildResponse({
      items: store.games,
      enrolledIds: Array.from(store.enrolledGameIds),
    });
  }

  if (method === 'post' && url === '/games/enroll') {
    const body = typeof cfg.data === 'string' ? JSON.parse(cfg.data) : cfg.data;
    const gameId = body?.gameId;
    if (gameId) {
      if (store.enrolledGameIds.has(gameId)) {
        store.enrolledGameIds.delete(gameId);
      } else {
        store.enrolledGameIds.add(gameId);
      }
    }
    return buildResponse({
      enrolledIds: Array.from(store.enrolledGameIds),
    });
  }

  if (method === 'get' && url === '/tournaments') {
    return buildResponse({
      items: store.tournaments,
      registeredIds: Array.from(store.registeredTournamentIds),
    });
  }

  if (method === 'post' && url === '/tournaments/register') {
    const body = typeof cfg.data === 'string' ? JSON.parse(cfg.data) : cfg.data;
    const tournamentId = body?.tournamentId;
    if (tournamentId) {
      if (store.registeredTournamentIds.has(tournamentId)) {
        store.registeredTournamentIds.delete(tournamentId);
      } else {
        store.registeredTournamentIds.add(tournamentId);
      }
    }
    return buildResponse({
      registeredIds: Array.from(store.registeredTournamentIds),
    });
  }

  if (method === 'get' && url === '/leaderboards') {
    return buildResponse({
      testerRankings: store.testerRankings,
      tournamentStandings: store.tournamentStandings,
    });
  }

  if (method === 'get' && url === '/bug-reports') {
    return buildResponse({
      items: store.bugReports,
    });
  }

  if (method === 'post' && url === '/bug-reports') {
    const body = typeof cfg.data === 'string' ? JSON.parse(cfg.data) : cfg.data;
    const points = calculateBugReportPoints(body?.severity || 'Low');
    const newReport: BugReportItem = {
      id: `rep-${Date.now()}`,
      gameId: body?.gameId || 'game-eclipse-protocol',
      gameTitle: store.games.find((g) => g.id === (body?.gameId || 'game-eclipse-protocol'))?.title || 'Eclipse Protocol',
      title: body?.title || 'Reported Issue',
      severity: body?.severity || 'Low',
      category: body?.category || 'Visual & UI Glitch',
      status: 'In Triage',
      reporterHandle: body?.reporterHandle || 'Nadia_Vanguard',
      reproductionSteps: body?.reproductionSteps || '',
      expectedResult: body?.expectedResult || '',
      actualResult: body?.actualResult || '',
      pointsAwarded: points,
      createdAt: new Date().toISOString().split('T')[0],
    };
    store.bugReports = [newReport, ...store.bugReports];

    const existingTester = store.testerRankings.find(
      (t) => t.handle === newReport.reporterHandle
    );
    if (existingTester) {
      existingTester.reputationPoints += points;
      existingTester.verifiedBugs += 1;
      if (newReport.severity === 'Critical') {
        existingTester.criticalBugs += 1;
      }
    }
    store.testerRankings = sortTesterRankings(store.testerRankings);

    return buildResponse({
      report: newReport,
      testerRankings: store.testerRankings,
    }, 201);
  }

  return buildResponse({ ok: true });
}

export const apiClient: AxiosInstance = {
  interceptors: {
    request: {
      use: (fn: (config: any) => any) => {
        requestInterceptors.push(fn);
      },
    },
    response: {
      use: (fn: (res: any) => any) => {
        responseInterceptors.push(fn);
      },
    },
  },
  async get<T = any>(url: string, config?: any) {
    return handleApiRequest({ ...config, url, method: 'get' }) as Promise<AxiosResponse<T>>;
  },
  async post<T = any>(url: string, data?: any, config?: any) {
    return handleApiRequest({ ...config, url, method: 'post', data }) as Promise<AxiosResponse<T>>;
  },
};

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('riyadah_elite_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore storage access errors in restricted frames
  }
  return config;
});

// Domain Service Functions
export const gameService = {
  async getGames() {
    const res = await apiClient.get<{ items: GameItem[]; enrolledIds: string[] }>('/games');
    return res.data;
  },
  async togglePlaytestEnrollment(gameId: string) {
    const res = await apiClient.post<{ enrolledIds: string[] }>('/games/enroll', { gameId });
    return res.data;
  },
};

export const tournamentService = {
  async getTournaments() {
    const res = await apiClient.get<{ items: TournamentItem[]; registeredIds: string[] }>(
      '/tournaments'
    );
    return res.data;
  },
  async toggleTournamentRegistration(tournamentId: string) {
    const res = await apiClient.post<{ registeredIds: string[] }>('/tournaments/register', {
      tournamentId,
    });
    return res.data;
  },
};

export const leaderboardService = {
  async getLeaderboards() {
    const res = await apiClient.get<{
      testerRankings: TesterRankingEntry[];
      tournamentStandings: TournamentStandingEntry[];
    }>('/leaderboards');
    return res.data;
  },
};

export const bugReportService = {
  async getBugReports() {
    const res = await apiClient.get<{ items: BugReportItem[] }>('/bug-reports');
    return res.data;
  },
  async submitBugReport(payload: {
    gameId: string;
    title: string;
    severity: BugReportItem['severity'];
    category: BugReportItem['category'];
    reproductionSteps: string;
    expectedResult: string;
    actualResult: string;
    reporterHandle?: string;
  }) {
    const res = await apiClient.post<{
      report: BugReportItem;
      testerRankings: TesterRankingEntry[];
    }>('/bug-reports', payload);
    return res.data;
  },
};
