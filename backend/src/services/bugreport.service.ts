/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { STATUS_CODE, USER_ROLE, type UserRole } from "../constants/constants.js";
import { BUG_REPORT_ERRORS } from "../constants/error.js";
import { NOTIFICATION_MESSAGES } from "../constants/notification.js";
import { notifyEvent, notifySystem } from "../utils/notification.js";
import ApiError from "../utils/apiError.js";
import Logger from "../utils/logger.js";
import BugReportRepository from "../repositories/bugreport.repository.js";
import ListingStatusService from "./listingstatus.service.js";
import UserProgressService from "./userprogress.service.js";
import { COMPLETED_BUG_STATUSES } from "../types/bugreport.types.js";
import type {
  BugReportQuery,
  BugStatus,
  CreateBugReportInput,
} from "../types/bugreport.types.js";
import type { PaginationMeta } from "../types/user.types.js";

@injectable()
export default class BugReportService {
  @inject(TYPES.BugReportRepository)
  bugReportRepository!: BugReportRepository;

  @inject(TYPES.ListingStatusService)
  listingStatusService!: ListingStatusService;

  @inject(TYPES.UserProgressService)
  userProgressService!: UserProgressService;

  @inject(TYPES.Logger)
  logger!: Logger;

  /**
   * A USER may only report bugs after joining the game testing, and only while
   * testing is still open (`testingDeadline` not reached).
   */
  async createReport(userId: string, input: CreateBugReportInput) {
    await this.listingStatusService.syncStatuses();
    await this.userProgressService.syncStatuses(userId);

    const listing = await this.bugReportRepository.findGameListing(
      input.gameListingId,
    );

    if (!listing) {
      throw new ApiError(
        BUG_REPORT_ERRORS.GAME_LISTING_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    if (listing.testingDeadline.getTime() <= Date.now()) {
      throw new ApiError(
        BUG_REPORT_ERRORS.TESTING_ENDED,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    const enrolled = await this.bugReportRepository.isEnrolled(
      userId,
      input.gameListingId,
    );

    if (!enrolled) {
      throw new ApiError(BUG_REPORT_ERRORS.NOT_ENROLLED, STATUS_CODE.FORBIDDEN);
    }

    await this.assertImage(input.imageId, userId);
    await this.assertAttachment(input.fileId, userId);

    const report = await this.bugReportRepository.create({
      ...input,
      userId,
    });

    await this.userProgressService.markTestingInProgress(
      userId,
      listing.gameName,
    );

    if (listing.userId) {
      const user = await this.bugReportRepository.findUser(userId);

      await notifyEvent(
        listing.userId,
        NOTIFICATION_MESSAGES.BUG_REPORT_CREATED(
          user?.username ?? "A user",
          listing.gameName,
        ),
      );
    }

    this.logger.info("bug report created", {
      bugReportId: report.id,
      userId,
      gameListingId: input.gameListingId,
    });

    return report;
  }

  /** USER sees their own reports; DEVELOPER sees reports on their listings. */
  async listReports(
    requesterId: string,
    role: UserRole,
    query: BugReportQuery,
  ) {
    await this.listingStatusService.syncStatuses();

    const { items, total } =
      role === USER_ROLE.DEVELOPER
        ? await this.bugReportRepository.listForDeveloper(requesterId, query)
        : await this.bugReportRepository.listForUser(requesterId, query);

    return {
      items,
      pagination: this.paginate(query.page, query.limit, total),
    };
  }

  async getReport(requesterId: string, role: UserRole, bugId: string) {
    const report =
      role === USER_ROLE.DEVELOPER
        ? await this.bugReportRepository.findForDeveloper(bugId, requesterId)
        : await this.bugReportRepository.findForUser(bugId, requesterId);

    if (!report) {
      throw new ApiError(BUG_REPORT_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return report;
  }

  /**
   * A developer may move a bug report through its workflow. Points are
   * recomputed from the number of resolved/closed reports, so updating the same
   * report twice cannot award the 100 points more than once.
   */
  async updateStatus(
    developerId: string,
    bugId: string,
    status: BugStatus,
  ) {
    const report = await this.bugReportRepository.findForDeveloper(
      bugId,
      developerId,
    );

    if (!report) {
      throw new ApiError(BUG_REPORT_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (report.status === status) {
      const progress = await this.userProgressService.recalculateTestingPoints(
        report.userId,
      );

      return { bugReport: report, testingProgress: progress };
    }

    const updated = await this.bugReportRepository.updateStatus(bugId, status);
    const progress = await this.userProgressService.recalculateTestingPoints(
      report.userId,
    );

    const wasCompleted = COMPLETED_BUG_STATUSES.includes(report.status);
    const isCompleted = COMPLETED_BUG_STATUSES.includes(status);

    await notifySystem(
      report.userId,
      NOTIFICATION_MESSAGES.BUG_REPORT_STATUS_UPDATED(
        report.gameListing.gameName,
        status,
      ),
    );

    if (!wasCompleted && isCompleted) {
      await notifySystem(
        report.userId,
        NOTIFICATION_MESSAGES.TESTING_POINTS_UPDATED(
          progress.points,
          progress.rank,
        ),
      );
    }

    this.logger.info("bug report status updated", {
      bugReportId: bugId,
      developerId,
      status,
    });

    return { bugReport: updated, testingProgress: progress };
  }

  private async assertImage(
    imageId: string | null | undefined,
    userId: string,
  ) {
    if (!imageId) {
      return;
    }

    if (!(await this.bugReportRepository.fileOwnedBy(imageId, userId))) {
      throw new ApiError(BUG_REPORT_ERRORS.IMAGE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
  }

  private async assertAttachment(
    fileId: string | null | undefined,
    userId: string,
  ) {
    if (!fileId) {
      return;
    }

    if (!(await this.bugReportRepository.fileOwnedBy(fileId, userId))) {
      throw new ApiError(
        BUG_REPORT_ERRORS.ATTACHMENT_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
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
