/**
 * Persistence for the per-user testing / tournament progress fields.
 *
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { BUG_STATUS } from "../constants/constants.js";
import { DbClient } from "../types/database.types.js";
import type {
  TestingStatus,
  TournamentStatus,
} from "../types/user.types.js";

const PROGRESS_SELECT = {
  testingStatus: true,
  tournamentStatus: true,
  testingPoints: true,
  testingRank: true,
  exitReason: true,
} as const;

export interface UserProgressSnapshot {
  testingStatus: TestingStatus | null;
  tournamentStatus: TournamentStatus | null;
  testingPoints: number | null;
  testingRank: string | null;
  exitReason: string | null;
}

export interface GameProgressCandidate {
  userId: string;
  testingStatus: TestingStatus | null;
  gameName: string;
  registrationEndDate: Date;
  testingDeadline: Date;
}

export interface TournamentProgressCandidate {
  userId: string;
  tournamentStatus: TournamentStatus | null;
  tournamentName: string;
  registrationEndDate: Date | null;
  tournamentDate: Date | null;
  tournamentTime: Date | null;
}

@injectable()
export default class UserProgressRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  async findProgress(userId: string): Promise<UserProgressSnapshot | null> {
    return await this.db.user.findUnique({
      where: { id: userId },
      select: PROGRESS_SELECT,
    });
  }

  async setTestingStatus(userId: string, status: TestingStatus) {
    return await this.db.user.updateMany({
      where: { id: userId, isDeleted: false },
      data: { testingStatus: status },
    });
  }

  async setTestingStatuses(userIds: string[], status: TestingStatus) {
    if (userIds.length === 0) {
      return { count: 0 };
    }

    return await this.db.user.updateMany({
      where: { id: { in: userIds }, isDeleted: false },
      data: { testingStatus: status },
    });
  }

  async setTournamentStatus(
    userId: string,
    status: TournamentStatus,
    exitReason?: string | null,
  ) {
    return await this.db.user.updateMany({
      where: { id: userId, isDeleted: false },
      data: {
        tournamentStatus: status,
        ...(exitReason !== undefined ? { exitReason } : {}),
      },
    });
  }

  async setTournamentStatuses(
    userIds: string[],
    status: TournamentStatus,
  ) {
    if (userIds.length === 0) {
      return { count: 0 };
    }

    return await this.db.user.updateMany({
      where: { id: { in: userIds }, isDeleted: false },
      data: { tournamentStatus: status },
    });
  }

  async resetTournamentToPending(userId: string) {
    return await this.db.user.updateMany({
      where: { id: userId, isDeleted: false },
      data: { tournamentStatus: "pending", exitReason: null },
    });
  }

  async setPointsAndRank(
    userId: string,
    testingPoints: number,
    testingRank: string,
  ) {
    return await this.db.user.update({
      where: { id: userId },
      data: { testingPoints, testingRank },
    });
  }

  async countCompletedBugReports(userId: string) {
    return await this.db.bugReport.count({
      where: {
        userId,
        status: { in: [BUG_STATUS.RESOLVED, BUG_STATUS.CLOSED] },
      },
    });
  }

  /**
   * The most recent game enrollment for each user. Using the latest join keeps
   * an older, already-finished game from overwriting the status of a new one.
   */
  async listGameProgressCandidates(userId?: string) {
    return await this.db.$queryRaw<GameProgressCandidate[]>`
      SELECT DISTINCT ON (jl."userId")
        jl."userId"                         AS "userId",
        u."testingStatus"::text             AS "testingStatus",
        gl."gameName"                       AS "gameName",
        gl."registrationEndDate"            AS "registrationEndDate",
        gl."testingDeadline"                AS "testingDeadline"
      FROM "JoinListing" jl
      INNER JOIN "User" u ON u.id = jl."userId"
      INNER JOIN "GameListing" gl ON gl.id = jl."gameListingId"
      WHERE jl."gameListingId" IS NOT NULL
        AND u."isDeleted" = false
        AND (${userId ?? null}::text IS NULL OR jl."userId" = ${userId ?? null})
      ORDER BY jl."userId", jl."createdAt" DESC, jl.id DESC
    `;
  }

  /**
   * The most recent tournament enrollment for each user.
   */
  async listTournamentProgressCandidates(userId?: string) {
    return await this.db.$queryRaw<TournamentProgressCandidate[]>`
      SELECT DISTINCT ON (jl."userId")
        jl."userId"                         AS "userId",
        u."tournamentStatus"::text          AS "tournamentStatus",
        tl."tournamentName"                 AS "tournamentName",
        tl."registrationEndDate"            AS "registrationEndDate",
        tl."tournamentDate"                 AS "tournamentDate",
        tl."tournamentTime"                 AS "tournamentTime"
      FROM "JoinListing" jl
      INNER JOIN "User" u ON u.id = jl."userId"
      INNER JOIN "TournamentListing" tl ON tl.id = jl."tournamentListingId"
      WHERE jl."tournamentListingId" IS NOT NULL
        AND u."isDeleted" = false
        AND (${userId ?? null}::text IS NULL OR jl."userId" = ${userId ?? null})
      ORDER BY jl."userId", jl."createdAt" DESC, jl.id DESC
    `;
  }
  
}
