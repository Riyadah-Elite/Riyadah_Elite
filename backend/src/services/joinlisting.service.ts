/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { LISTING_STATUS, STATUS_CODE } from "../constants/constants.js";
import { JOIN_LISTING_ERRORS } from "../constants/error.js";
import ApiError from "../utils/apiError.js";
import Logger from "../utils/logger.js";
import JoinListingRepository from "../repositories/joinlisting.repository.js";
import type { EnrollmentRecord } from "../types/joinlisting.types.js";

@injectable()
export default class JoinListingService {
  @inject(TYPES.JoinListingRepository)
  joinListingRepository!: JoinListingRepository;

  @inject(TYPES.Logger)
  logger!: Logger;

  async joinGameListing(userId: string, listingId: string) {
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

    this.logger.info("user joined game listing", { userId, listingId });

    return join;
  }

  async joinTournament(userId: string, tournamentId: string) {
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

    const join = await this.joinListingRepository.createTournamentJoin(
      userId,
      tournamentId,
    );

    this.logger.info("user joined tournament", { userId, tournamentId });

    return join;
  }

  async leave(userId: string, joinId: string): Promise<void> {
    const join = await this.joinListingRepository.findUserJoin(joinId, userId);

    if (!join) {
      throw new ApiError(
        JOIN_LISTING_ERRORS.JOIN_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    await this.joinListingRepository.deleteJoin(joinId);

    this.logger.info("user left listing", { userId, joinId });
  }

  async listUserEnrollments(userId: string): Promise<EnrollmentRecord[]> {
    this.logger.info("listing user enrollments", { userId });

    return await this.joinListingRepository.listUserEnrollments(userId);
  }
}
