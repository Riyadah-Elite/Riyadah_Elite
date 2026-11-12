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
