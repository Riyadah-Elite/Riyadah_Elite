/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { LISTING_STATUS, STATUS_CODE } from "../constants/constants.js";
import { JOIN_LISTING_ERRORS } from "../constants/error.js";
import { NOTIFICATION_MESSAGES } from "../constants/notification.js";
import { notifyEvent } from "../utils/notification.js";
import ApiError from "../utils/apiError.js";
import Logger from "../utils/logger.js";
import JoinListingRepository from "../repositories/joinlisting.repository.js";
import ListingStatusService from "./listingstatus.service.js";
import UserProgressService from "./userprogress.service.js";
import type { EnrollmentRecord } from "../types/joinlisting.types.js";

@injectable()
export default class JoinListingService {
  @inject(TYPES.JoinListingRepository)
  joinListingRepository!: JoinListingRepository;

  @inject(TYPES.ListingStatusService)
  listingStatusService!: ListingStatusService;

  @inject(TYPES.UserProgressService)
  userProgressService!: UserProgressService;

  @inject(TYPES.Logger)
  logger!: Logger;

  async joinGameListing(userId: string, listingId: string) {
    await this.listingStatusService.syncStatuses();
    await this.userProgressService.syncStatuses(userId);

    const listing = await this.joinListingRepository.findGameListing(listingId);

    if (!listing) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.GAME_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    if (listing.status !== LISTING_STATUS.ACTIVE) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.LISTING_NOT_ACTIVE,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    const existing = await this.joinListingRepository.findGameJoin(
      userId,
      listingId,
    );

    if (existing) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.ALREADY_JOINED,
        STATUS_CODE.CONFLICT,
      );
    }

    const join = await this.joinListingRepository.createGameJoin(
      userId,
      listingId,
    );

    await this.userProgressService.markGamePending(userId, listing.gameName);

    const user = await this.joinListingRepository.findUser(userId);

    if (listing.userId) {
      await notifyEvent(
        listing.userId,
        NOTIFICATION_MESSAGES.USER_JOINED_GAME_TESTING(
          user?.username ?? "A user",
          listing.gameName,
        ),
      );
    }

    this.logger.info("user joined game listing", { userId, listingId });

    return join;
  }

  async joinTournament(userId: string, tournamentId: string) {
    await this.listingStatusService.syncStatuses();
    await this.userProgressService.syncStatuses(userId);

    const tournament = await this.joinListingRepository.findTournament(
      tournamentId,
    );

    if (!tournament) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.TOURNAMENT_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    if (tournament.status !== LISTING_STATUS.ACTIVE) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.LISTING_NOT_ACTIVE,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    const existing = await this.joinListingRepository.findTournamentJoin(
      userId,
      tournamentId,
    );

    if (existing) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.ALREADY_JOINED,
        STATUS_CODE.CONFLICT,
      );
    }

    /*
     * `TournamentListing.maxEntry` is treated as capacity when it is positive;
     * 0 keeps the tournament unlimited.
     */
    const currentJoins =
      await this.joinListingRepository.countTournamentJoins(tournamentId);

    const capacity = tournament.maxEntry;
    const isFull = capacity > 0 && currentJoins >= capacity;

    if (isFull) {
      if (tournament.userId) {
        await notifyEvent(
          tournament.userId,
          NOTIFICATION_MESSAGES.TOURNAMENT_FULL(tournament.tournamentName),
        );
      }

      throw new ApiError(
        JOIN_LISTING_ERRORS.TOURNAMENT_FULL,
        STATUS_CODE.CONFLICT,
      );
    }

    const join = await this.joinListingRepository.createTournamentJoin(
      userId,
      tournamentId,
    );

    await this.userProgressService.markTournamentPending(
      userId,
      tournament.tournamentName,
    );

    const user = await this.joinListingRepository.findUser(userId);

    if (tournament.userId) {
      await notifyEvent(
        tournament.userId,
        NOTIFICATION_MESSAGES.USER_JOINED_TOURNAMENT(
          user?.username ?? "A user",
          tournament.tournamentName,
        ),
      );

      /* The join that fills the last slot also tells the org it is full. */
      if (capacity > 0 && currentJoins + 1 >= capacity) {
        await notifyEvent(
          tournament.userId,
          NOTIFICATION_MESSAGES.TOURNAMENT_FULL(tournament.tournamentName),
        );
      }
    }

    this.logger.info("user joined tournament", { userId, tournamentId });

    return join;
  }

  async leave(
    userId: string,
    joinId: string,
    exitReason?: string | null,
  ): Promise<void> {
    const join = await this.joinListingRepository.findUserJoin(joinId, userId);

    if (!join) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.JOIN_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    await this.joinListingRepository.deleteJoin(joinId);

    if (join.gameListing) {
      await this.userProgressService.markGameFailure(
        userId,
        join.gameListing.gameName,
      );
    }

    if (join.tournamentListing) {
      await this.userProgressService.markTournamentFailure(
        userId,
        join.tournamentListing.tournamentName,
        exitReason,
      );
    }

    this.logger.info("user left listing", { userId, joinId });
  }

  async listUserEnrollments(userId: string): Promise<EnrollmentRecord[]> {
    await this.listingStatusService.syncStatuses();
    await this.userProgressService.syncStatuses(userId);

    this.logger.info("listing user enrollments", { userId });

    return await this.joinListingRepository.listUserEnrollments(userId);
  }
}
