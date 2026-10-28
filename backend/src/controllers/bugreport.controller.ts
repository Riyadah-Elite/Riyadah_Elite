/**
 * @author aliasgarbootwala3@gmial.com
 */

import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../config/types.js";
import { STATUS_CODE, USER_ROLE } from "../constants/constants.js";
import BaseController from "./base.controller.js";
import BugReportService from "../services/bugreport.service.js";
import Logger from "../utils/logger.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateOrThrow } from "../validators/validate.js";
import {
  bugReportIdParamsSchema,
  bugReportQuerySchema,
  createBugReportSchema,
  updateBugReportStatusSchema,
} from "../validators/bugreport.validator.js";
import type { BugReportQuery } from "../types/bugreport.types.js";

@controller("/api/v1/bug")
export default class BugReportController extends BaseController {
  @inject(TYPES.BugReportService)
  bugReportService!: BugReportService;

  @inject(TYPES.Logger)
  logger!: Logger;

  /** POST /api/v1/bug/report - only enrolled USERs, during testing. */
  @httpPost("/report", authMiddleware(USER_ROLE.USER))
  async createReport(req: Request, res: Response) {
    try {
      const body = validateOrThrow(createBugReportSchema, req.body);

      const bugReport = await this.bugReportService.createReport(
        req.user!.userId,
        body,
      );

      return this.success(res, { bugReport }, STATUS_CODE.CREATED);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/bug/report?page=1&limit=20 - USER own, DEVELOPER their games. */
  @httpGet(
    "/report",
    authMiddleware([USER_ROLE.USER, USER_ROLE.DEVELOPER]),
  )
  async listReports(req: Request, res: Response) {
    try {
      const query = validateOrThrow(bugReportQuerySchema, req.query);

      const result = await this.bugReportService.listReports(
        req.user!.userId,
        req.user!.role,
        this.toBugReportQuery(query),
      );

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/bug/report/:bugId */
  @httpGet(
    "/report/:bugId",
    authMiddleware([USER_ROLE.USER, USER_ROLE.DEVELOPER]),
  )
  async getReport(req: Request, res: Response) {
    try {
      const { bugId } = validateOrThrow(bugReportIdParamsSchema, req.params);

      const bugReport = await this.bugReportService.getReport(
        req.user!.userId,
        req.user!.role,
        bugId,
      );

      return this.success(res, { bugReport }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** PATCH /api/v1/bug/report/:bugId/status - DEVELOPER only. */
  @httpPatch(
    "/report/:bugId/status",
    authMiddleware(USER_ROLE.DEVELOPER),
  )
  async updateStatus(req: Request, res: Response) {
    try {
      const { bugId } = validateOrThrow(bugReportIdParamsSchema, req.params);
      const { status } = validateOrThrow(
        updateBugReportStatusSchema,
        req.body,
      );

      const result = await this.bugReportService.updateStatus(
        req.user!.userId,
        bugId,
        status,
      );

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private toBugReportQuery(query: {
    page: number;
    limit: number;
    gameListingId?: string;
    status?: BugReportQuery["status"];
    search?: string;
  }): BugReportQuery {
    const page = Number(query.page);
    const limit = Number(query.limit);

    return {
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit,
      gameListingId: query.gameListingId,
      status: query.status,
      search: query.search,
    };
  }
  
}
