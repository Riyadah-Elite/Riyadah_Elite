/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import {
  LISTING_STATUS,
  STATUS_CODE,
  USER_ROLE,
  type UserRole,
} from "../constants/constants.js";
import {
  LISTING_ERRORS,
  TOURNAMENT_ERRORS,
} from "../constants/error.js";
import { NOTIFICATION_MESSAGES } from "../constants/notification.js";
import { notifyRole } from "../utils/notification.js";
import { rankForPoints } from "../utils/rank.js";
import ApiError from "../utils/apiError.js";
import Logger from "../utils/logger.js";
import ListingRepository from "../repositories/listing.repository.js";
import ListingStatusService from "./listingstatus.service.js";
import UserProgressService from "./userprogress.service.js";
import {
  CreateGameListingInput,
  CreateTournamentInput,
  GameListingQuery,
  ListingStatus,
  TournamentQuery,
  UserTrackingQuery,
  PaginatedResult,
  TrackedUser,
  UpdateGameListingInput,
  UpdateTournamentInput,
} from "../types/listing.types.js";
import type { PaginationMeta } from "../types/user.types.js";

@injectable()
export default class ListingService {
  @inject(TYPES.ListingRepository)
  listingRepository!: ListingRepository;

  @inject(TYPES.ListingStatusService)
  listingStatusService!: ListingStatusService;

  @inject(TYPES.UserProgressService)
  userProgressService!: UserProgressService;

  @inject(TYPES.Logger)
  logger!: Logger;

  // ===========================================================================
  // GAME LISTING
  // ===========================================================================

  async createGameListing(ownerId: string, input: CreateGameListingInput) {
    this.logger.info("creating game listing", { ownerId });

    await this.assertCategory(input.categoryId);
    await this.assertAmount(input.amountId);
    await this.assertImage(input.imageId, ownerId);
    await this.assertAttachment(input.fileId, ownerId);

    this.assertListingDates(
      input.registrationEndDate,
      input.testingDeadline,
    );

    const listing = await this.listingRepository.createGameListing({
      ...input,
      status: this.resolveInitialStatus(input.scheduling, input.status),
      userId: ownerId,
    });

    this.logger.info("game listing created", { listingId: listing.id });

    await notifyRole(
      USER_ROLE.USER,
      NOTIFICATION_MESSAGES.GAME_LISTING_CREATED(listing.gameName),
    );

    return listing;
  }

  async listGameListings(
    requesterId: string,
    role: UserRole,
    query: GameListingQuery,
  ) {
    await this.listingStatusService.syncStatuses();

    const { items, total } =
      role === USER_ROLE.DEVELOPER
        ? await this.listingRepository.listGameListings(requesterId, query)
        : await this.listingRepository.listOpenGameListings(query);

    return {
      items,
      pagination: this.paginate(query.page, query.limit, total),
    };
  }

  async getGameListing(
    requesterId: string,
    role: UserRole,
    listingId: string,
  ) {
    await this.listingStatusService.syncStatuses();

    if (role === USER_ROLE.DEVELOPER) {
      return await this.assertOwnedGameListing(requesterId, listingId);
    }

    const listing = await this.listingRepository.findOpenGameListing(listingId);

    if (!listing) {
      throw new ApiError(LISTING_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return listing;
  }

  async updateGameListing(
    ownerId: string,
    listingId: string,
    input: UpdateGameListingInput,
  ) {
    const existing = await this.assertOwnedGameListing(ownerId, listingId);

    if (input.categoryId !== undefined) {
      await this.assertCategory(input.categoryId);
    }

    if (input.amountId) {
      await this.assertAmount(input.amountId);
    }

    if (input.imageId) {
      await this.assertImage(input.imageId, ownerId);
    }

    if (input.fileId) {
      await this.assertAttachment(input.fileId, ownerId);
    }

    this.assertListingDates(
      input.registrationEndDate ?? existing.registrationEndDate,
      input.testingDeadline ?? existing.testingDeadline,
    );

    const changes: UpdateGameListingInput = { ...input };

    const scheduling =
      input.scheduling !== undefined ? input.scheduling : existing.scheduling;

    if (scheduling && scheduling.getTime() > Date.now()) {
      changes.status = LISTING_STATUS.INACTIVE;
    }

    const listing = await this.listingRepository.updateGameListing(
      listingId,
      changes,
    );

    this.logger.info("game listing updated", { ownerId, listingId });

    return listing;
  }

  async deleteGameListing(ownerId: string, listingId: string): Promise<void> {
    await this.assertOwnedGameListing(ownerId, listingId);

    const dependents =
      await this.listingRepository.countGameListingDependents(listingId);

    if (dependents.tournaments > 0 || dependents.bugReports > 0) {
      throw new ApiError(
        LISTING_ERRORS.HAS_RELATED_RECORDS,
        STATUS_CODE.CONFLICT,
      );
    }

    await this.listingRepository.deleteGameListing(listingId);

    this.logger.info("game listing deleted", { ownerId, listingId });
  }

  // ===========================================================================
  // TOURNAMENT LISTING
  // ===========================================================================

  async createTournament(ownerId: string, input: CreateTournamentInput) {
    this.logger.info("creating tournament", { ownerId });

    await this.assertGameListingExists(input.gameListingId);
    await this.assertAmount(input.amountId);
    await this.assertImage(input.imageId, ownerId);
    await this.assertAttachment(input.fileId, ownerId);

    this.assertTournamentDates(
      input.registrationEndDate,
      input.tournamentDate,
    );

    const tournament = await this.listingRepository.createTournament({
      ...input,
      status: this.resolveInitialStatus(input.scheduling, input.status),
      userId: ownerId,
    });

    this.logger.info("tournament created", { tournamentId: tournament.id });

    await notifyRole(
      USER_ROLE.USER,
      NOTIFICATION_MESSAGES.TOURNAMENT_CREATED(tournament.tournamentName),
    );

    return tournament;
  }

  async listTournaments(
    requesterId: string,
    role: UserRole,
    query: TournamentQuery,
  ) {
    await this.listingStatusService.syncStatuses();

    const { items, total } =
      role === USER_ROLE.ORG
        ? await this.listingRepository.listTournaments(requesterId, query)
        : await this.listingRepository.listOpenTournaments(query);

    return {
      items,
      pagination: this.paginate(query.page, query.limit, total),
    };
  }

  async getTournament(
    requesterId: string,
    role: UserRole,
    tournamentId: string,
  ) {
    await this.listingStatusService.syncStatuses();

    if (role === USER_ROLE.ORG) {
      return await this.assertOwnedTournament(requesterId, tournamentId);
    }

    const tournament = await this.listingRepository.findOpenTournament(
      tournamentId,
    );

    if (!tournament) {
      throw new ApiError(TOURNAMENT_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return tournament;
  }

  async updateTournament(
    ownerId: string,
    tournamentId: string,
    input: UpdateTournamentInput,
  ) {
    const existing = await this.assertOwnedTournament(ownerId, tournamentId);

    if (input.gameListingId !== undefined) {
      await this.assertGameListingExists(input.gameListingId);
    }

    if (input.amountId) {
      await this.assertAmount(input.amountId);
    }

    if (input.imageId) {
      await this.assertImage(input.imageId, ownerId);
    }

    if (input.fileId) {
      await this.assertAttachment(input.fileId, ownerId);
    }

    this.assertTournamentDates(
      input.registrationEndDate ?? existing.registrationEndDate,
      input.tournamentDate ?? existing.tournamentDate,
    );

    const changes: UpdateTournamentInput = { ...input };

    const scheduling =
      input.scheduling !== undefined ? input.scheduling : existing.scheduling;

    if (scheduling && scheduling.getTime() > Date.now()) {
      changes.status = LISTING_STATUS.INACTIVE;
    }

    const tournament = await this.listingRepository.updateTournament(
      tournamentId,
      changes,
    );

    this.logger.info("tournament updated", { ownerId, tournamentId });

    return tournament;
  }

  async deleteTournament(ownerId: string, tournamentId: string): Promise<void> {
    await this.assertOwnedTournament(ownerId, tournamentId);

    await this.listingRepository.deleteTournament(tournamentId);

    this.logger.info("tournament deleted", { ownerId, tournamentId });
  }

  // ===========================================================================
  // USER TRACKING
  // ===========================================================================

  async listTrackedUsers(
    ownerId: string,
    query: UserTrackingQuery,
  ): Promise<PaginatedResult<TrackedUser>> {
    await this.listingStatusService.syncStatuses();
    await this.userProgressService.syncStatuses();

    this.logger.info("listing tracked users", { ownerId });

    const { rows, total } = await this.listingRepository.listTrackedUsers(query);

    const items: TrackedUser[] = rows.map((row) => ({
      id: row.id,
      username: row.username,
      role: row.role,
      testingStatus: row.testingStatus,
      testingPoints: row.testingPoints,
      testingRank: row.testingRank ?? rankForPoints(row.testingPoints),
      tournamentStatus: row.tournamentStatus,
      reportCount: row._count.bugReports,
      createdAt: row.createdAt,
    }));

    return {
      items,
      pagination: this.paginate(query.page, query.limit, total),
    };
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  /**
   * A listing scheduled for the future is created closed. The lifecycle sync
   * flips it to active when `scheduling` is reached.
   */
  private resolveInitialStatus(
    scheduling: Date | null | undefined,
    status: ListingStatus | undefined,
  ): ListingStatus {
    if (scheduling && scheduling.getTime() > Date.now()) {
      return LISTING_STATUS.INACTIVE;
    }

    return status ?? LISTING_STATUS.ACTIVE;
  }

  private async assertOwnedGameListing(ownerId: string, listingId: string) {
    const listing = await this.listingRepository.findOwnedGameListing(
      listingId,
      ownerId,
    );

    if (!listing) {
      throw new ApiError(LISTING_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return listing;
  }

  private async assertGameListingExists(listingId: string) {
    const exists = await this.listingRepository.gameListingExists(listingId);

    if (!exists) {
      throw new ApiError(
        TOURNAMENT_ERRORS.GAME_LISTING_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  private async assertOwnedTournament(ownerId: string, tournamentId: string) {
    const tournament = await this.listingRepository.findOwnedTournament(
      tournamentId,
      ownerId,
    );

    if (!tournament) {
      throw new ApiError(
        TOURNAMENT_ERRORS.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    return tournament;
  }

  private async assertCategory(categoryId: string) {
    if (!(await this.listingRepository.categoryExists(categoryId))) {
      throw new ApiError(
        LISTING_ERRORS.CATEGORY_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  private async assertAmount(amountId?: string | null) {
    if (!amountId) {
      return;
    }

    if (!(await this.listingRepository.amountExists(amountId))) {
      throw new ApiError(
        LISTING_ERRORS.AMOUNT_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  private async assertImage(imageId: string | null | undefined, ownerId: string) {
    if (!imageId) {
      return;
    }

    if (!(await this.listingRepository.fileOwnedBy(imageId, ownerId))) {
      throw new ApiError(
        LISTING_ERRORS.IMAGE_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  private async assertAttachment(
    fileId: string | null | undefined,
    ownerId: string,
  ) {
    if (!fileId) {
      return;
    }

    if (!(await this.listingRepository.fileOwnedBy(fileId, ownerId))) {
      throw new ApiError(
        LISTING_ERRORS.ATTACHMENT_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  private assertListingDates(registrationEndDate: Date, testingDeadline: Date) {
    if (testingDeadline.getTime() < registrationEndDate.getTime()) {
      throw new ApiError(
        LISTING_ERRORS.INVALID_DATE_RANGE,
        STATUS_CODE.BAD_REQUEST,
      );
    }
  }

  private assertTournamentDates(
    registrationEndDate?: Date | null,
    tournamentDate?: Date | null,
  ) {
    if (
      registrationEndDate &&
      tournamentDate &&
      registrationEndDate.getTime() > tournamentDate.getTime()
    ) {
      throw new ApiError(
        TOURNAMENT_ERRORS.INVALID_DATE_RANGE,
        STATUS_CODE.BAD_REQUEST,
      );
    }
  }

  private paginate(
    page: number,
    limit: number,
    total: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
  
}
