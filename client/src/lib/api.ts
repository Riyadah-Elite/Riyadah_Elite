export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthSuccessResponse {
  status: "ok";
  message: string;
  data: {
    user: UserProfile;
    token: string;
  };
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
}

export interface PlayerProfileData {
  id?: string;
  userId?: string;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  primaryPlatform?: string | null;
  favoriteGenres?: string[];
  hardwareGpu?: string | null;
  hardwareCpu?: string | null;
  hardwareRam?: string | null;
  hardwareOs?: string | null;
  testerScore?: number;
  totalGamesTested?: number;
  avatarUrl?: string | null;
  discordHandle?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameOpportunityItem {
  id: string;
  slug: string;
  title: string;
  studio: string;
  genre: string;
  platform: string;
  stage: string;
  version?: string | null;
  description: string;
  focusAreas: string[];
  requirements: string[];
  capacity: number;
  rewardText?: string | null;
  imageUrl?: string | null;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export interface GameTestingApplicationItem {
  id: string;
  userId: string;
  opportunityId: string;
  status: "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  platform: string;
  primaryGames: string[];
  hardwareGpu: string;
  hardwareCpu: string;
  hardwareRam: string;
  availabilityHours: string;
  experienceNotes?: string | null;
  agreedNda: boolean;
  agreedTelemetry: boolean;
  createdAt: string;
  opportunity?: GameOpportunityItem;
}

export interface TournamentItem {
  id: string;
  slug: string;
  title: string;
  game: string;
  organizer: string;
  format: string;
  bracketType?: string;
  platform: string;
  region: string;
  prizePool?: string | null;
  entryFee: string;
  teamSize: number;
  maxParticipants: number;
  participantCount?: number;
  registrationDeadline?: string | null;
  startDate: string;
  endDate?: string | null;
  rules: string[];
  description: string;
  bannerUrl?: string | null;
  discordUrl?: string | null;
  status: "DRAFT" | "REGISTRATION_OPEN" | "REGISTRATION_CLOSED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  isFull?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TournamentRegistrationItem {
  id: string;
  tournamentId: string;
  userId: string;
  registrationMode: "SOLO" | "EXISTING_TEAM" | "NEW_TEAM";
  status: "CONFIRMED" | "WAITLISTED" | "CHECKED_IN" | "WITHDRAWN" | "DISQUALIFIED";
  inGameHandle: string;
  preferredRoles: string[];
  teamName?: string | null;
  discordHandle?: string | null;
  agreedRules: boolean;
  agreedAntiCheat: boolean;
  ticketCode: string;
  createdAt: string;
  tournament?: TournamentItem;
}

export interface PlayerOverviewResponse {
  status: "ok";
  data: {
    user: UserProfile;
    profile: PlayerProfileData | null;
    metrics: {
      activeTests: number;
      pendingApplications: number;
      completedTests: number;
      registeredTournaments?: number;
      upcomingTournaments?: number;
      activeTournaments?: number;
      completedTournaments?: number;
      testerScore: number;
    };
    applications: GameTestingApplicationItem[];
    tournamentRegistrations?: TournamentRegistrationItem[];
  };
}

export interface PlayerTournamentsResponse {
  status: "ok";
  data: {
    registrations: TournamentRegistrationItem[];
    metrics: {
      total: number;
      upcoming: number;
      active: number;
      completed: number;
    };
  };
}

export interface TournamentRegistrationPayload {
  registrationMode: "SOLO" | "EXISTING_TEAM" | "NEW_TEAM";
  inGameHandle: string;
  preferredRoles: string[];
  teamName?: string | null;
  discordHandle?: string | null;
  agreedRules: boolean;
  agreedAntiCheat: boolean;
}

// ==========================================
// DEVELOPER WORKSPACE CONTRACTS & MODELS
// ==========================================

export interface DeveloperGameItem {
  id: string;
  slug: string;
  title: string;
  studio: string;
  genre: string;
  platform: string;
  stage: string;
  version?: string | null;
  description: string;
  focusAreas: string[];
  requirements: string[];
  capacity: number;
  rewardText?: string | null;
  imageUrl?: string | null;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
  createdAt: string;
  updatedAt?: string;
  activeCampaignsCount?: number;
  totalTestersCount?: number;
  ratingScore?: number;
}

export interface DeveloperCampaignItem {
  id: string;
  gameId: string;
  title: string;
  gameTitle: string;
  stage: string;
  targetTesters: number;
  enrolledTesters: number;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  startDate: string;
  endDate: string;
  rewardPool?: string | null;
  primaryFocus: string;
}

export interface DeveloperTesterItem {
  id: string;
  testerTag: string;
  campaignTitle: string;
  enrolledDate: string;
  status: "ACTIVE" | "COMPLETED" | "WITHDRAWN";
  platform: string;
  bugsReported: number;
  hoursPlayed: number;
  ndaSigned: boolean;
}

export interface DeveloperFeedbackItem {
  id: string;
  gameTitle: string;
  campaignTitle: string;
  testerTag: string;
  category: "BUG" | "GAMEPLAY" | "PERFORMANCE" | "UX";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  details: string;
  rating: number;
  submittedAt: string;
  status: "NEW" | "INVESTIGATING" | "RESOLVED" | "WONT_FIX";
}

export interface DeveloperOverviewResponse {
  status: "ok";
  data: {
    developerName: string;
    studioName: string;
    tier: string;
    verificationStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
    escrowBalance: string;
    metrics: {
      totalGames: number;
      activeCampaigns: number;
      activeTesters: number;
      pendingReports: number;
      avgRating: number;
      totalEarningsSAR: number;
    };
    games: DeveloperGameItem[];
    recentCampaigns: DeveloperCampaignItem[];
    recentFeedback: DeveloperFeedbackItem[];
  };
}

export interface HostOverviewResponse {
  status: "ok";
  data: {
    hostName: string;
    organizationName: string;
    tier: string;
    verificationStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
    metrics: {
      totalTournaments: number;
      activeTournaments: number;
      totalParticipants: number;
      completedTournaments: number;
      pendingCheckIns: number;
      escrowDisbursedSAR: number;
    };
    recentTournaments: TournamentItem[];
  };
}

export interface HostParticipantItem {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  inGameHandle: string;
  teamName?: string | null;
  registrationMode: string;
  status: "CONFIRMED" | "WAITLISTED" | "CHECKED_IN" | "WITHDRAWN" | "DISQUALIFIED";
  preferredRoles: string[];
  discordHandle?: string | null;
  seed?: number;
  score?: number;
  createdAt: string;
}

export interface HostMatchItem {
  id: string;
  tournamentId: string;
  roundName: string;
  matchNumber: number;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  winnerName?: string | null;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "DISPUTED";
  scheduledTime?: string;
}

export interface HostProfileData {
  hostName: string;
  organizationName: string;
  contactEmail: string;
  discordHandle?: string | null;
  country: string;
  city: string;
  bio: string;
  tier: string;
  isVerified: boolean;
  telemetryWebhook?: string | null;
  autoCheckIn: boolean;
  requireAntiCheat: boolean;
}


// -------------------------------------------------------------
// Internal Admin Workspace Contracts (Phase 5A / 5B)
// -------------------------------------------------------------

export interface AdminTelemetryNode {
  nodeId: string;
  name: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latencyMs: number;
  region: string;
  enclaveLevel: number;
}

export interface AdminEcosystemMetrics {
  totalRegisteredUsers: number;
  activePlaytestSessions: number;
  liveTournamentsCount: number;
  openReportsQueue: number;
  activeDevelopersCount: number;
  escrowSecuredSAR: number;
  systemHealthScore: number;
}

export interface AdminFounderOverviewData {
  authLevel: 5;
  operatorName: string;
  operatorTitle: string;
  systemMetrics: AdminEcosystemMetrics;
  criticalEscrowLocks: Array<{
    id: string;
    refCode: string;
    title: string;
    amountSAR: number;
    reason: string;
    flaggedAt: string;
    status: "FROZEN" | "PENDING_AUDIT" | "RESOLVED";
  }>;
  pendingFounderAuthorizations: Array<{
    id: string;
    category: string;
    description: string;
    riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
    requestedBy: string;
    requestedAt: string;
  }>;
  staffGovernanceEvents: Array<{
    id: string;
    adminName: string;
    role: string;
    action: string;
    ipAddress: string;
    timestamp: string;
  }>;
}

export interface AdminViceOverviewData {
  authLevel: 4;
  operatorName: string;
  operatorTitle: string;
  operationalMetrics: AdminEcosystemMetrics;
  urgentAttentionItems: Array<{
    id: string;
    refCode: string;
    priority: "HIGH" | "MEDIUM" | "CRITICAL";
    title: string;
    description: string;
    department: string;
    timestamp: string;
  }>;
  departmentQueues: Array<{
    department: string;
    pendingCount: number;
    slaStatus: "HEALTHY" | "AT_RISK" | "BREACHED";
    leadContact: string;
  }>;
  recentAuditStream: Array<{
    id: string;
    actor: string;
    scope: string;
    detail: string;
    timeAgo: string;
  }>;
}

export interface AdminUserListItem {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "PLAYER" | "DEVELOPER" | "HOST" | "ADMIN";
  status: "ACTIVE" | "RESTRICTED" | "BANNED" | "FLAGGED";
  isVerified: boolean;
  country: string;
  totalTournamentsJoined: number;
  conductScore: number;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface AdminDeveloperItem {
  id: string;
  studioName: string;
  contactName: string;
  email: string;
  crNumber?: string | null;
  status: "VERIFIED" | "PENDING_REVIEW" | "REJECTED" | "SUSPENDED";
  submittedGamesCount: number;
  activeCampaignsCount: number;
  totalPayoutsSAR: number;
  country: string;
  registeredAt: string;
}

export interface AdminTournamentArbiterItem {
  id: string;
  title: string;
  game: string;
  organizerName: string;
  format: string;
  status: "SANCTIONED" | "IN_PROGRESS" | "UNDER_REVIEW" | "DISPUTED" | "COMPLETED";
  participantsCount: number;
  maxParticipants: number;
  prizePoolSAR: number;
  activeDisputesCount: number;
  scheduledDate: string;
}

export interface AdminFinanceOverviewData {
  totalEscrowBalanceSAR: number;
  pendingDisbursementsSAR: number;
  settledTransactionsCount: number;
  activeGatewayDisputesCount: number;
  vatLiabilitySAR: number;
  transactions: Array<{
    id: string;
    reference: string;
    type: "DEVELOPER_PAYOUT" | "TOURNAMENT_ESCROW" | "PRIZE_SETTLEMENT" | "REFUND";
    beneficiary: string;
    amountSAR: number;
    channel: "MADA" | "VISA_MC" | "WIRE_TRANSFER" | "STC_PAY";
    status: "SETTLED" | "PENDING_MULTI_SIG" | "FLAGGED" | "HELD";
    createdAt: string;
  }>;
  integrationStatus?: {
    paymentGateway: "UNCONFIGURED" | "ACTIVE" | "DEGRADED";
    samaReconciliation: "STANDBY" | "ACTIVE" | "FAILED";
  };
}

export interface AdminTrustSafetyItem {
  id: string;
  caseNumber: string;
  category: "ANTI_CHEAT_ANOMALY" | "HARASSMENT" | "MATCH_FIXING" | "UNAUTHORIZED_SOFTWARE" | "TERMS_VIOLATION";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  reportedUser: string;
  reporter: string;
  status: "OPEN" | "UNDER_INVESTIGATION" | "ACTION_TAKEN" | "DISMISSED";
  evidenceNotes: string;
  createdAt: string;
}

export interface AdminVerificationItem {
  id: string;
  applicantType: "STUDIO_DEVELOPER" | "TOURNAMENT_ORGANIZER" | "PRO_PLAYER";
  entityName: string;
  contactEmail: string;
  documentType: "COMMERCIAL_REGISTRATION" | "NATIONAL_ID" | "ESPORTS_LICENSE";
  status: "PENDING_REVIEW" | "DOCUMENT_REQUESTED" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewerNotes?: string | null;
}

export interface AdminStaffItem {
  id: string;
  fullName: string;
  email: string;
  title: string;
  department: "EXECUTIVE" | "OPERATIONS" | "TRUST_AND_SAFETY" | "ARBITRATION" | "FINANCE";
  clearanceLevel: number;
  status: "ACTIVE" | "ON_LEAVE" | "REVOKED";
  lastActiveAt: string;
}

export interface AdminPlatformServiceStatus {
  serviceName: string;
  category: "CORE_GATEWAY" | "MATCHMAKING_NETCODE" | "ESCROW_VAULT" | "CDN_EDGE";
  uptimePercentage: number;
  status: "HEALTHY" | "DEGRADED" | "OUTAGE";
  latencyMs: number;
}

export interface AdminContentItem {
  id: string;
  title: string;
  contentType: "ANNOUNCEMENT" | "HERO_BANNER" | "FEATURED_GAME" | "TOURNAMENT_SPOTLIGHT";
  targetPlacement: "HOMEPAGE" | "GAMES_DISCOVERY" | "TOURNAMENTS_HUB";
  status: "PUBLISHED" | "SCHEDULED" | "DRAFT" | "ARCHIVED";
  authorName: string;
  publishedAt?: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ ok: true; data: T } | { ok: false; error: string; errors?: Record<string, string[]> }> {
  try {
    const token = localStorage.getItem("riyadah_auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const body = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: body.message || `Request failed with status ${response.status}`,
        errors: body.errors,
      };
    }

    return { ok: true, data: body };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Unable to reach server. Please check your network connection.";
    return { ok: false, error: errorMsg };
  }
}

