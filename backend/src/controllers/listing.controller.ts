/**
 * @author aliasgarbootwala3@gmial.com
 */

import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../config/types.js";
import { STATUS_CODE, USER_ROLE } from "../constants/constants.js";
import BaseController from "./base.controller.js";
import ListingService from "../services/listing.service.js";
import Logger from "../utils/logger.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateOrThrow } from "../validators/validate.js";
import {
  createGameListingSchema,
  createTournamentSchema,
  listingIdParamsSchema,
  listingQuerySchema,
  tournamentIdParamsSchema,
  tournamentQuerySchema,
  userTrackingQuerySchema,
  updateGameListingSchema,
  updateTournamentSchema,
} from "../validators/listing.validator.js";
import type {
  GameListingQuery,
  TournamentQuery,
  UserTrackingQuery,
} from "../types/listing.types.js";

/**
 * Game listings are owned by DEVELOPER accounts; tournaments are owned by ORG
 * accounts. Each route applies the middleware for its own role, and every query
 * is scoped to the signed-in owner.
 */
@controller("/api/v1")
export default class ListingController extends BaseController {
  @inject(TYPES.ListingService)
  listingService!: ListingService;

  @inject(TYPES.Logger)
  logger!: Logger;

  // ===========================================================================
  // GAME LISTING (DEVELOPER)
  // ===========================================================================

  /** POST /api/v1/listing */
  @httpPost("/listing", authMiddleware(USER_ROLE.DEVELOPER))
  async createListing(req: Request, res: Response) {
    try {
      const body = validateOrThrow(createGameListingSchema, req.body);

      const listing = await this.listingService.createGameListing(
        req.user!.userId,
        body,
      );

      return this.success(res, { listing }, STATUS_CODE.CREATED);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/listing?page=1&limit=20 */
  @httpGet(
    "/listing",
    authMiddleware([USER_ROLE.USER, USER_ROLE.DEVELOPER]),
  )
  async listListings(req: Request, res: Response) {
    try {
      const query = validateOrThrow(listingQuerySchema, req.query);

      const result = await this.listingService.listGameListings(
        req.user!.userId,
        req.user!.role,
        this.toListingQuery(query),
      );

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/listing/:listingId */
  @httpGet(
    "/listing/:listingId",
    authMiddleware([USER_ROLE.USER, USER_ROLE.DEVELOPER]),
  )
  async getListing(req: Request, res: Response) {
    try {
      const { listingId } = validateOrThrow(
        listingIdParamsSchema,
        req.params,
      );

      const listing = await this.listingService.getGameListing(
        req.user!.userId,
        req.user!.role,
        listingId,
      );

      return this.success(res, { listing }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** PATCH /api/v1/listing/:listingId */
  @httpPatch("/listing/:listingId", authMiddleware(USER_ROLE.DEVELOPER))
  async updateListing(req: Request, res: Response) {
    try {
      const { listingId } = validateOrThrow(
        listingIdParamsSchema,
        req.params,
      );
      const body = validateOrThrow(updateGameListingSchema, req.body);

      const listing = await this.listingService.updateGameListing(
        req.user!.userId,
        listingId,
        body,
      );

      return this.success(res, { listing }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** DELETE /api/v1/listing/:listingId */
  @httpDelete("/listing/:listingId", authMiddleware(USER_ROLE.DEVELOPER))
  async deleteListing(req: Request, res: Response) {
    try {
      const { listingId } = validateOrThrow(
        listingIdParamsSchema,
        req.params,
      );

      await this.listingService.deleteGameListing(
        req.user!.userId,
        listingId,
      );

      return this.success(
        res,
        { message: "Listing deleted" },
        STATUS_CODE.OK,
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  // ===========================================================================
  // TOURNAMENT LISTING (ORG)
  // ===========================================================================

  /** POST /api/v1/tournament */
  @httpPost("/tournament", authMiddleware(USER_ROLE.ORG))
  async createTournament(req: Request, res: Response) {
    try {
      const body = validateOrThrow(createTournamentSchema, req.body);

      const tournament = await this.listingService.createTournament(
        req.user!.userId,
        body,
      );

      return this.success(res, { tournament }, STATUS_CODE.CREATED);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/tournament?page=1&limit=20 */
  @httpGet(
    "/tournament",
    authMiddleware([USER_ROLE.USER, USER_ROLE.ORG]),
  )
  async listTournaments(req: Request, res: Response) {
    try {
      const query = validateOrThrow(tournamentQuerySchema, req.query);

      const result = await this.listingService.listTournaments(
        req.user!.userId,
        req.user!.role,
        this.toTournamentQuery(query),
      );

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/tournament/:tournamentId */
  @httpGet(
    "/tournament/:tournamentId",
    authMiddleware([USER_ROLE.USER, USER_ROLE.ORG]),
  )
  async getTournament(req: Request, res: Response) {
    try {
      const { tournamentId } = validateOrThrow(
        tournamentIdParamsSchema,
        req.params,
      );

      const tournament = await this.listingService.getTournament(
        req.user!.userId,
        req.user!.role,
        tournamentId,
      );

      return this.success(res, { tournament }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** PATCH /api/v1/tournament/:tournamentId */
  @httpPatch("/tournament/:tournamentId", authMiddleware(USER_ROLE.ORG))
  async updateTournament(req: Request, res: Response) {
    try {
      const { tournamentId } = validateOrThrow(
        tournamentIdParamsSchema,
        req.params,
      );
      const body = validateOrThrow(updateTournamentSchema, req.body);

      const tournament = await this.listingService.updateTournament(
        req.user!.userId,
        tournamentId,
        body,
      );

      return this.success(res, { tournament }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** DELETE /api/v1/tournament/:tournamentId */
  @httpDelete("/tournament/:tournamentId", authMiddleware(USER_ROLE.ORG))
  async deleteTournament(req: Request, res: Response) {
    try {
      const { tournamentId } = validateOrThrow(
        tournamentIdParamsSchema,
        req.params,
      );

      await this.listingService.deleteTournament(
        req.user!.userId,
        tournamentId,
      );

      return this.success(
        res,
        { message: "Tournament deleted" },
        STATUS_CODE.OK,
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  // ===========================================================================
  // USER TRACKING (ORG)
  // ===========================================================================

  /** GET /api/v1/org/users?page=1&limit=20 */
  @httpGet("/org/users", authMiddleware(USER_ROLE.ORG))
  async trackUsers(req: Request, res: Response) {
    try {
      const query = validateOrThrow(userTrackingQuerySchema, req.query);

      const result = await this.listingService.listTrackedUsers(
        req.user!.userId,
        this.toTrackingQuery(query),
      );

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  // ===========================================================================
  // QUERY NORMALISATION
  // ===========================================================================

  private paginateFields(page: number, limit: number) {
    return {
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  private toListingQuery(query: {
    page: number;
    limit: number;
    search?: string;
    status?: GameListingQuery["status"];
    platform?: GameListingQuery["platform"];
    categoryId?: string;
  }): GameListingQuery {
    return {
      ...this.paginateFields(Number(query.page), Number(query.limit)),
      search: query.search,
      status: query.status,
      platform: query.platform,
      categoryId: query.categoryId,
    };
  }

  private toTournamentQuery(query: {
    page: number;
    limit: number;
    search?: string;
    status?: TournamentQuery["status"];
    gameListingId?: string;
  }): TournamentQuery {
    return {
      ...this.paginateFields(Number(query.page), Number(query.limit)),
      search: query.search,
      status: query.status,
      gameListingId: query.gameListingId,
    };
  }

  private toTrackingQuery(query: {
    page: number;
    limit: number;
    search?: string;
    testingStatus?: UserTrackingQuery["testingStatus"];
  }): UserTrackingQuery {
    return {
      ...this.paginateFields(Number(query.page), Number(query.limit)),
      search: query.search,
      testingStatus: query.testingStatus,
    };
  }
  
}
