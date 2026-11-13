/**
 * @author aliasgarbootwala3@gmial.com
 */

import { BUG_STATUS } from "../constants/constants.js";
import type { PaginationMeta } from "./user.types.js";

export type BugStatus = (typeof BUG_STATUS)[keyof typeof BUG_STATUS];

export const BUG_STATUSES = Object.values(BUG_STATUS) as BugStatus[];

export const COMPLETED_BUG_STATUSES: BugStatus[] = [
  BUG_STATUS.RESOLVED,
  BUG_STATUS.CLOSED,
];

export interface CreateBugReportInput {
  gameListingId: string;
  bugDescription: string;
  imageId?: string | null;
  fileId?: string | null;
}

export interface UpdateBugReportStatusInput {
  status: BugStatus;
}

export interface BugReportQuery {
  page: number;
  limit: number;
  skip: number;
  take: number;
  gameListingId?: string;
  status?: BugStatus;
  search?: string;
}

export interface PaginatedBugReports<T> {
  items: T[];
  pagination: PaginationMeta;
}
