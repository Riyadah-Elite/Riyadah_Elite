/**
 * @author aliasgarbootwala3@gmial.com
 */

import { LISTING_STATUS, PLATFORM } from "../constants/constants.js";
import type {
  PaginationMeta,
  TestingStatus,
  TournamentStatus,
  UserRole,
} from "./user.types.js";

export type ListingStatus =
  (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS];
export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];

export const LISTING_STATUSES = Object.values(LISTING_STATUS) as ListingStatus[];
export const PLATFORMS = Object.values(PLATFORM) as Platform[];

// ---------------------------------------------------------------------------
// Game listing
// ---------------------------------------------------------------------------

export interface CreateGameListingInput {
  gameName: string;
  categoryId: string;
  description?: string | null;
  bugsListing?: string | null;
  guides?: string | null;
  platform?: Platform | null;
  gameUrl?: string | null;
  imageId?: string | null;
  amountId?: string | null;
  fileId?: string | null;
  maxEntry?: number;
  minEntry?: number;
  status?: ListingStatus;
  registrationEndDate: Date;
  testingDeadline: Date;
  scheduling?: Date | null;
}

export type UpdateGameListingInput = Partial<CreateGameListingInput>;

// ---------------------------------------------------------------------------
// Tournament listing
// ---------------------------------------------------------------------------

export interface CreateTournamentInput {
  tournamentName: string;
  gameListingId: string;
  description?: string | null;
  tournamentDate?: Date | null;
  tournamentTime?: Date | null;
  maxEntry?: number;
  minEntry?: number;
  teamSize?: number;
  status?: ListingStatus;
  amountId?: string | null;
  imageId?: string | null;
  tournamentUrl?: string | null;
  fileId?: string | null;
  registrationEndDate?: Date | null;
  scheduling?: Date | null;
}

export type UpdateTournamentInput = Partial<CreateTournamentInput>;

// ---------------------------------------------------------------------------
// Query / response helpers
// ---------------------------------------------------------------------------

export interface PaginationFields {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface GameListingQuery extends PaginationFields {
  search?: string;
  status?: ListingStatus;
  platform?: Platform;
  categoryId?: string;
}

export interface TournamentQuery extends PaginationFields {
  search?: string;
  status?: ListingStatus;
  gameListingId?: string;
}

export interface UserTrackingQuery extends PaginationFields {
  search?: string;
  testingStatus?: TestingStatus;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface TrackedUser {
  id: string;
  username: string;
  role: UserRole;
  testingStatus: TestingStatus | null;
  testingPoints: number | null;
  testingRank: string | null;
  tournamentStatus: TournamentStatus | null;
  reportCount: number;
  createdAt: Date;
}
