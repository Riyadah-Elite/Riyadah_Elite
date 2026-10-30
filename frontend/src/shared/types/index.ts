export type UserRole = 'ADMIN' | 'USER' | 'ORG' | 'DEVELOPER';

export type TestingStatus = 'pending' | 'inprogress' | 'completed' | 'failure';
export type TournamentStatus = 'pending' | 'inprogress' | 'completed' | 'failure';
export type ListingStatus = 'active' | 'inactive';
export type PlatformType = 'android' | 'web' | 'ios' | 'windows' | 'console' | 'linux' | 'macos';
export type BugStatus = 'open' | 'inprogress' | 'resolved' | 'closed';
export type Currency = 'USD' | 'INR' | 'QAR' | 'SDG' | 'EUR';
export type NotificationType = 'system' | 'promotion' | 'event';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  testingPoints: number;
  testingRank?: string;
  isNotificationAllowed: boolean;
  testingStatus?: TestingStatus;
  tournamentStatus?: TournamentStatus;
  createdAt?: string;
}

export interface Amount {
  id: string;
  amount: number;
  currency: Currency;
}

export interface GameListing {
  id: string;
  gameName: string;
  categoryId: string;
  categoryName?: string;
  userId?: string;
  status: ListingStatus;
  maxEntry: number;
  minEntry: number;
  description?: string;
  bugsListing?: string;
  guides?: string;
  platform?: PlatformType;
  gameUrl?: string;
  imageUrl?: string;
  fileUrl?: string;
  amount?: Amount;
  registrationEndDate: string;
  testingDeadline: string;
  scheduling?: string;
  enrolledCount?: number;
  openBugsCount?: number;
  createdAt: string;
}

export interface TournamentListing {
  id: string;
  tournamentName: string;
  gameListingId: string;
  gameName?: string;
  userId?: string;
  description?: string;
  tournamentDate?: string;
  tournamentTime?: string;
  maxEntry: number;
  minEntry: number;
  teamSize: number;
  status: ListingStatus;
  tournamentUrl?: string;
  imageUrl?: string;
  fileUrl?: string;
  amount?: Amount;
  registrationEndDate?: string;
  scheduling?: string;
  enrolledCount?: number;
  createdAt: string;
}

export interface BugReport {
  id: string;
  userId: string;
  userName?: string;
  userRank?: string;
  gameListingId: string;
  gameName?: string;
  bugDescription: string;
  reproSteps?: string[];
  severity?: 'critical' | 'major' | 'minor' | 'trivial';
  imageUrl?: string;
  fileUrl?: string;
  status: BugStatus;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  markAsRead: boolean;
  type: NotificationType;
  createdAt: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatarUrl?: string;
  testingPoints: number;
  tierName: string;
  bugsResolved: number;
  accuracyRate: string;
}

export type NavRoute = 'home' | 'tournaments' | 'games' | 'bug-report' | 'notifications' | 'profile';

