/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import Logger from "../utils/logger.js";
import ListingRepository from "../repositories/listing.repository.js";

/**
 * Applies time-based listing transitions. Callers invoke it before any
 * operation where the current status matters (browsing, joining, reporting),
 * which keeps scheduled openings and ended test phases correct without
 * requiring a background worker.
 */
@injectable()
export default class ListingStatusService {
  @inject(TYPES.ListingRepository)
  listingRepository!: ListingRepository;

  @inject(TYPES.Logger)
  logger!: Logger;

  async syncStatuses(): Promise<void> {
    const result = await this.listingRepository.syncListingStatuses(
      new Date(),
    );

    if (
      result.openedGames > 0 ||
      result.openedTournaments > 0 ||
      result.closedGames > 0 ||
      result.closedTournaments > 0
    ) {
      this.logger.info("listing statuses synced", result);
    }
  }
  
}
