/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { USER_ROLE } from "../constants/constants.js";
import { DbClient } from "../types/database.types.js";
import {
  CreateGameListingInput,
  CreateTournamentInput,
  GameListingQuery,
  TournamentQuery,
  UserTrackingQuery,
  UpdateGameListingInput,
  UpdateTournamentInput,
} from "../types/listing.types.js";

const LISTING_INCLUDE = {
  category: { select: { id: true, categoryName: true } },
  amount: true,
  image: { select: { id: true, imageUrl: true } },
  attachment: { select: { id: true, imageUrl: true, fileUrl: true } },
} as const;

const TOURNAMENT_INCLUDE = {
  gameListing: { select: { id: true, gameName: true } },
  amount: true,
  image: { select: { id: true, imageUrl: true } },
  attachment: { select: { id: true, imageUrl: true, fileUrl: true } },
} as const;

@injectable()
export default class ListingRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  // -------------------------------------------------------------------------
  // Existence / ownership checks
  // -------------------------------------------------------------------------

  async categoryExists(categoryId: string) {
    return (await this.db.category.count({ where: { id: categoryId } })) > 0;
  }

  async amountExists(amountId: string) {
    return (await this.db.amount.count({ where: { id: amountId } })) > 0;
  }

  async fileOwnedBy(fileId: string, userId: string) {
    return (await this.db.file.count({ where: { id: fileId, userId } })) > 0;
  }

  async gameListingExists(gameListingId: string) {
    return (
      (await this.db.gameListing.count({
        where: { id: gameListingId },
      })) > 0
    );
  }

  // -------------------------------------------------------------------------
  // Game listing
  // -------------------------------------------------------------------------

  async createGameListing(data: CreateGameListingInput & { userId: string }) {
    return await this.db.gameListing.create({
      data: {
        gameName: data.gameName,
        categoryId: data.categoryId,
        userId: data.userId,
        status: data.status ?? "active",
        maxEntry: data.maxEntry ?? 0,
        minEntry: data.minEntry ?? 0,
        description: data.description ?? null,
        bugsListing: data.bugsListing ?? null,
        guides: data.guides ?? null,
        platform: data.platform ?? null,
        gameUrl: data.gameUrl ?? null,
        imageId: data.imageId ?? null,
        amountId: data.amountId ?? null,
        fileId: data.fileId ?? null,
        registrationEndDate: data.registrationEndDate,
        testingDeadline: data.testingDeadline,
        scheduling: data.scheduling ?? null,
      },
      include: LISTING_INCLUDE,
    });
  }

  async findGameListing(id: string) {
    return await this.db.gameListing.findUnique({
      where: { id },
      include: LISTING_INCLUDE,
    });
  }

  async findOwnedGameListing(id: string, userId: string) {
    return await this.db.gameListing.findFirst({
      where: { id, userId },
      include: LISTING_INCLUDE,
    });
  }

  async listGameListings(userId: string, query: GameListingQuery) {
    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.platform ? { platform: query.platform } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.search
        ? { gameName: { contains: query.search, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await this.db.$transaction([
      this.db.gameListing.findMany({
        where,
        include: LISTING_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.gameListing.count({ where }),
    ]);

    return { items, total };
  }

  async updateGameListing(id: string, data: UpdateGameListingInput) {
    return await this.db.gameListing.update({
      where: { id },
      data: {
        gameName: data.gameName,
        categoryId: data.categoryId,
        status: data.status,
        maxEntry: data.maxEntry,
        minEntry: data.minEntry,
        description: data.description,
        bugsListing: data.bugsListing,
        guides: data.guides,
        platform: data.platform,
        gameUrl: data.gameUrl,
        imageId: data.imageId,
        amountId: data.amountId,
        fileId: data.fileId,
        registrationEndDate: data.registrationEndDate,
        testingDeadline: data.testingDeadline,
        scheduling: data.scheduling,
      },
      include: LISTING_INCLUDE,
    });
  }

  async countGameListingDependents(id: string) {
    const [tournaments, bugReports] = await this.db.$transaction([
      this.db.tournamentListing.count({ where: { gameListingId: id } }),
      this.db.bugReport.count({ where: { gameListingId: id } }),
    ]);

    return { tournaments, bugReports };
  }

  async deleteGameListing(id: string) {
    return await this.db.gameListing.delete({ where: { id } });
  }

  // -------------------------------------------------------------------------
  // Tournament listing
  // -------------------------------------------------------------------------

  async createTournament(data: CreateTournamentInput & { userId: string }) {
    return await this.db.tournamentListing.create({
      data: {
        tournamentName: data.tournamentName,
        gameListingId: data.gameListingId,
        userId: data.userId,
        status: data.status ?? "active",
        maxEntry: data.maxEntry ?? 0,
        minEntry: data.minEntry ?? 0,
        teamSize: data.teamSize ?? 1,
        description: data.description ?? null,
        tournamentDate: data.tournamentDate ?? null,
        tournamentTime: data.tournamentTime ?? null,
        amountId: data.amountId ?? null,
        imageId: data.imageId ?? null,
        tournamentUrl: data.tournamentUrl ?? null,
        fileId: data.fileId ?? null,
        registrationEndDate: data.registrationEndDate ?? null,
        scheduling: data.scheduling ?? null,
      },
      include: TOURNAMENT_INCLUDE,
    });
  }

  async findTournament(id: string) {
    return await this.db.tournamentListing.findUnique({
      where: { id },
      include: TOURNAMENT_INCLUDE,
    });
  }

  async findOwnedTournament(id: string, userId: string) {
    return await this.db.tournamentListing.findFirst({
      where: { id, userId },
      include: TOURNAMENT_INCLUDE,
    });
  }

  async listTournaments(userId: string, query: TournamentQuery) {
    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.gameListingId
        ? { gameListingId: query.gameListingId }
        : {}),
      ...(query.search
        ? {
            tournamentName: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };

    const [items, total] = await this.db.$transaction([
      this.db.tournamentListing.findMany({
        where,
        include: TOURNAMENT_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.tournamentListing.count({ where }),
    ]);

    return { items, total };
  }

  async updateTournament(id: string, data: UpdateTournamentInput) {
    return await this.db.tournamentListing.update({
      where: { id },
      data: {
        tournamentName: data.tournamentName,
        gameListingId: data.gameListingId,
        status: data.status,
        maxEntry: data.maxEntry,
        minEntry: data.minEntry,
        teamSize: data.teamSize,
        description: data.description,
        tournamentDate: data.tournamentDate,
        tournamentTime: data.tournamentTime,
        amountId: data.amountId,
        imageId: data.imageId,
        tournamentUrl: data.tournamentUrl,
        fileId: data.fileId,
        registrationEndDate: data.registrationEndDate,
        scheduling: data.scheduling,
      },
      include: TOURNAMENT_INCLUDE,
    });
  }

  async deleteTournament(id: string) {
    return await this.db.tournamentListing.delete({ where: { id } });
  }

  // -------------------------------------------------------------------------
  // User tracking
  // -------------------------------------------------------------------------

  /**
   * Testers (USER / DEVELOPER) with their testing progress. Organizations use
   * this to track who is testing; `reportCount` is the number of bug reports
   * that user has filed anywhere.
   */
  async listTrackedUsers(query: UserTrackingQuery) {
    const where = {
      isDeleted: false,
      role: { in: [USER_ROLE.USER, USER_ROLE.DEVELOPER] },
      ...(query.testingStatus
        ? { testingStatus: query.testingStatus }
        : {}),
      ...(query.search
        ? { username: { contains: query.search, mode: "insensitive" as const } }
        : {}),
    };

    const [rows, total] = await this.db.$transaction([
      this.db.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          role: true,
          testingStatus: true,
          testingPoints: true,
          testingRank: true,
          tournamentStatus: true,
          createdAt: true,
          _count: { select: { bugReports: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.user.count({ where }),
    ]);

    return { rows, total };
  }
  
}
