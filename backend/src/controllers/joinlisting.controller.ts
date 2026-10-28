/**
 * @author aliasgarbootwala3@gmial.com
 */

import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../config/types.js";
import { STATUS_CODE, USER_ROLE } from "../constants/constants.js";
import BaseController from "./base.controller.js";
import JoinListingService from "../services/joinlisting.service.js";
import Logger from "../utils/logger.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateOrThrow } from "../validators/validate.js";
import {
  joinGameListingParamsSchema,
  joinListingIdParamsSchema,
  joinTournamentParamsSchema,
  leaveJoinSchema,
} from "../validators/joinlisting.validator.js";

/**
 * USER-only enrollment endpoints.
 *
 * A user can join a game listing (testing) or a tournament listing. The join
 * record stores only membership; the status shown by `GET /joinlisting` is
 * always read from the listing / tester progress so it stays current.
 */
@controller("/api/v1/joinlisting")
export default class JoinListingController extends BaseController {
  @inject(TYPES.JoinListingService)
  joinListingService!: JoinListingService;

  @inject(TYPES.Logger)
  logger!: Logger;

  /** POST /api/v1/joinlisting/game/:listingId */
  @httpPost("/game/:listingId", authMiddleware(USER_ROLE.USER))
  async joinGame(req: Request, res: Response) {
    try {
      const { listingId } = validateOrThrow(
        joinGameListingParamsSchema,
        req.params,
      );

      const enrollment = await this.joinListingService.joinGameListing(
        req.user!.userId,
        listingId,
      );

      return this.success(res, { enrollment }, STATUS_CODE.CREATED);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** POST /api/v1/joinlisting/tournament/:tournamentId */
  @httpPost("/tournament/:tournamentId", authMiddleware(USER_ROLE.USER))
  async joinTournament(req: Request, res: Response) {
    try {
      const { tournamentId } = validateOrThrow(
        joinTournamentParamsSchema,
        req.params,
      );

      const enrollment = await this.joinListingService.joinTournament(
        req.user!.userId,
        tournamentId,
      );

      return this.success(res, { enrollment }, STATUS_CODE.CREATED);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/joinlisting */
  @httpGet("/", authMiddleware(USER_ROLE.USER))
  async myEnrollments(req: Request, res: Response) {
    try {
      const enrollments = await this.joinListingService.listUserEnrollments(
        req.user!.userId,
      );

      return this.success(res, { enrollments }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** DELETE /api/v1/joinlisting/:joinId */
  @httpDelete("/:joinId", authMiddleware(USER_ROLE.USER))
  async leave(req: Request, res: Response) {
    try {
      const { joinId } = validateOrThrow(joinListingIdParamsSchema, req.params);
      const body = validateOrThrow(leaveJoinSchema, req.body ?? {});

      await this.joinListingService.leave(
        req.user!.userId,
        joinId,
        body.exitReason ?? null,
      );

      return this.success(res, { message: "Left listing" }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
  
}
