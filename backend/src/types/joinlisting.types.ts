/**
 * @author aliasgarbootwala3@gmial.com
 */

import type { ListingStatus } from "./listing.types.js";
import type { TestingStatus } from "./user.types.js";

export type EnrollmentType = "game" | "tournament";

/**
 * One row returned by the enrollment query.
 *
 * There is deliberately no `status` column on `JoinListing`: the status the
 * caller sees always comes from the listing (`ListingStatus`) or the tester's
 * progress (`TestingStatus`), so it stays in sync when either changes.
 */
export interface EnrollmentRecord {
  joinId: string;
  type: EnrollmentType;
  listingId: string;
  name: string;
  joinedAt: Date;
  /** Game enrollments: the tester's TestingStatus. Tournaments: ListingStatus. */
  status: TestingStatus | ListingStatus;
  /** Current status of the underlying game/tournament listing. */
  listingStatus: ListingStatus;
  /** Number of bug reports this user filed for the joined game. */
  bugReportCount: number;
}
