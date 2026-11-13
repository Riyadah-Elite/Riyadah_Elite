/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { DbClient } from "../types/database.types.js";
import type { EnrollmentRecord } from "../types/joinlisting.types.js";

@injectable()
export default class JoinListingRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  // -------------------------------------------------------------------------
  // Listing lookups
  // -------------------------------------------------------------------------

  async findGameListing(id: string) {
    return await this.db.gameListing.findUnique({
      where: { id },
      select: { id: true, status: true, gameName: true, userId: true },
    });
  }

  async findTournament(id: string) {
    return await this.db.tournamentListing.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        tournamentName: true,
        userId: true,
        maxEntry: true,
      },
    });
  }

  async findUser(userId: string) {
    return await this.db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
  }

  // -------------------------------------------------------------------------
  // Join records
  // -------------------------------------------------------------------------

  async findGameJoin(userId: string, gameListingId: string) {
    return await this.db.joinListing.findFirst({
      where: { userId, gameListingId },
    });
  }

  async findTournamentJoin(userId: string, tournamentListingId: string) {
    return await this.db.joinListing.findFirst({
      where: { userId, tournamentListingId },
    });
  }

  async createGameJoin(userId: string, gameListingId: string) {
    return await this.db.joinListing.create({
      data: { userId, gameListingId },
    });
  }

  async createTournamentJoin(userId: string, tournamentListingId: string) {
    return await this.db.joinListing.create({
      data: { userId, tournamentListingId },
    });
  }

  async findUserJoin(joinId: string, userId: string) {
    return await this.db.joinListing.findFirst({
      where: { id: joinId, userId },
      select: {
        id: true,
        gameListingId: true,
        tournamentListingId: true,
        gameListing: { select: { gameName: true } },
        tournamentListing: { select: { tournamentName: true } },
      },
    });
  }

  async deleteJoin(joinId: string) {
    return await this.db.joinListing.delete({ where: { id: joinId } });
  }

  async countTournamentJoins(tournamentListingId: string) {
    return await this.db.joinListing.count({
      where: { tournamentListingId },
    });
  }

  // -------------------------------------------------------------------------
  // Enrollment report (explicit SQL joins)
  // -------------------------------------------------------------------------

  /**
   * Returns every listing the user has joined, with the status shown to the
   * caller. Game status comes from `User.testingStatus`; tournament status comes
   * from `User.tournamentStatus`. `bugReportCount` is pulled from BugReport so
   * game-testing progress can be shown next to the enrollment.
   */
  async listUserEnrollments(userId: string): Promise<EnrollmentRecord[]> {
    return await this.db.$queryRaw<EnrollmentRecord[]>`
      SELECT
        jl.id                              AS "joinId",
        'game'                             AS "type",
        gl.id                              AS "listingId",
        gl."gameName"                      AS "name",
        jl."createdAt"                     AS "joinedAt",
        COALESCE(u."testingStatus"::text, 'pending') AS "status",
        gl.status::text                    AS "listingStatus",
        (
          SELECT COUNT(*)::int
          FROM "BugReport" br
          WHERE br."userId" = jl."userId"
            AND br."gameListingId" = gl.id
        )                                  AS "bugReportCount"
      FROM "JoinListing" jl
      INNER JOIN "GameListing" gl ON gl.id = jl."gameListingId"
      INNER JOIN "User" u ON u.id = jl."userId"
      WHERE jl."userId" = ${userId}

      UNION ALL

      SELECT
        jl.id                              AS "joinId",
        'tournament'                       AS "type",
        tl.id                              AS "listingId",
        tl."tournamentName"                AS "name",
        jl."createdAt"                     AS "joinedAt",
        COALESCE(u."tournamentStatus"::text, 'pending') AS "status",
        tl.status::text                    AS "listingStatus",
        0                                  AS "bugReportCount"
      FROM "JoinListing" jl
      INNER JOIN "TournamentListing" tl ON tl.id = jl."tournamentListingId"
      INNER JOIN "User" u ON u.id = jl."userId"
      WHERE jl."userId" = ${userId}

      ORDER BY "joinedAt" DESC
    `;
  }
  
}
