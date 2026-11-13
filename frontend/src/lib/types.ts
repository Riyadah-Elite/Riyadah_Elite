export interface ApiEnvelope<T> {
  data: T;
  success: boolean;
}

export type UserRole = 'ADMIN' | 'USER' | 'ORG' | 'DEVELOPER';

export type TestingStatus = 'pending' | 'inprogress' | 'completed' | 'failure';
export type TournamentStatus = TestingStatus;

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isNotificationAllowed: boolean;
  testingStatus: TestingStatus | null;
  testingPoints: number | null;
  testingRank: string | null;
  tournamentStatus: TournamentStatus | null;
  exitReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export type NotificationType = 'system' | 'promotion' | 'event';

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  markAsRead: boolean;
  type: NotificationType;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NotificationPage {
  items: AppNotification[];
  pagination: PaginationMeta;
  unreadCount: number;
}

export interface LeaderboardEntry {
  position: number;
  id: string;
  username: string;
  role: UserRole;
  avatarUrl: string | null;
  testingPoints: number;
  testingRank: string;
  createdAt: string;
}

export interface LeaderboardPage {
  items: LeaderboardEntry[];
}

export interface TournamentAmount {
  id: string;
  amount: number;
  currency: string;
}

export interface TournamentItem {
  id: string;
  tournamentName: string;
  gameListingId: string;
  userId?: string | null;
  description?: string | null;
  tournamentDate?: string | null;
  tournamentTime?: string | null;
  maxEntry: number;
  minEntry: number;
  teamSize: number;
  status: 'active' | 'inactive';
  tournamentUrl?: string | null;
  registrationEndDate?: string | null;
  scheduling?: string | null;
  createdAt: string;
  updatedAt: string;
  gameListing?: {
    id: string;
    gameName: string;
  };
  amount?: TournamentAmount | null;
  image?: {
    id: string;
    imageUrl: string | null;
  } | null;
  attachment?: {
    id: string;
    imageUrl: string | null;
    fileUrl: string | null;
  } | null;
}

export interface TournamentPage {
  items: TournamentItem[];
  pagination: PaginationMeta;
}

export interface CreateTournamentPayload {
  tournamentName: string;
  gameListingId: string;
  description?: string;
  tournamentUrl?: string;
  tournamentDate?: string;
  teamSize?: number;
  maxEntry?: number;
  minEntry?: number;
  amount?: number;
  currency?: 'USD' | 'INR' | 'QAR' | 'SDG' | 'EUR';
  imageId?: string | null;
  fileId?: string | null;
  registrationEndDate?: string;
  status?: 'active' | 'inactive';
}

export interface GameOption {
  id: string;
  gameName: string;
}

export interface GameListingItem {
  id: string;
  gameName: string;
  categoryId: string;
  userId?: string | null;
  description?: string | null;
  bugsListing?: string | null;
  guides?: string | null;
  platform?: 'android' | 'web' | 'ios' | 'windows' | 'console' | 'linux' | 'macos' | null;
  gameUrl?: string | null;
  maxEntry?: number;
  minEntry?: number;
  status: 'active' | 'inactive';
  registrationEndDate: string;
  testingDeadline: string;
  scheduling?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    categoryName: string;
  };
  user?: {
    id: string;
    username: string;
  };
  image?: {
    id: string;
    imageUrl: string | null;
  } | null;
}

export interface GameListingPage {
  items: GameListingItem[];
  pagination: PaginationMeta;
}

export interface CreateGameListingPayload {
  gameName: string;
  categoryId: string;
  description?: string;
  bugsListing?: string;
  guides?: string;
  platform?: 'android' | 'web' | 'ios' | 'windows' | 'console' | 'linux' | 'macos';
  gameUrl?: string;
  registrationEndDate: string;
  testingDeadline: string;
  maxEntry?: number;
  minEntry?: number;
  amount?: number;
  currency?: 'USD' | 'INR' | 'QAR' | 'SDG' | 'EUR';
  imageId?: string | null;
  fileId?: string | null;
  status?: 'active' | 'inactive';
}

export type BugReportStatus = 'open' | 'inprogress' | 'resolved' | 'closed';

export interface BugReportItem {
  id: string;
  userId: string;
  gameListingId: string;
  bugDescription: string;
  status: BugReportStatus;
  imageId?: string | null;
  fileId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    role: UserRole;
  };
  gameListing?: {
    id: string;
    gameName: string;
    userId?: string | null;
  };
  image?: {
    id: string;
    imageUrl: string | null;
  } | null;
  attachment?: {
    id: string;
    fileUrl: string | null;
  } | null;
}

export interface BugReportPage {
  items: BugReportItem[];
  pagination: PaginationMeta;
}

export interface CreateBugReportPayload {
  gameListingId: string;
  bugDescription: string;
  imageId?: string | null;
  fileId?: string | null;
}

export interface CategoryItem {
  id: string;
  categoryName: string;
}

export interface EnrolledGameItem {
  id: string;
  userId: string;
  gameListingId: string;
  createdAt: string;
  gameListing?: GameListingItem;
}
