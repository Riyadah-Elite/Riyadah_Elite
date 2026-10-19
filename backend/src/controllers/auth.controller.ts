/**
 * @author aliasgarbootwala3@gmial.com
 */

import { httpPost, controller, httpGet, httpDelete, httpPatch } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types.js";
import BaseController from "./base.controller.js";
import {
  ALL_USER_ROLES,
  STATUS_CODE,
  USER_ROLE,
} from "../constants/constants.js";
import {
  loginSchema,
  registerSchema,
  updateUserDetailsSchema,
  userIdParamsSchema,
  userListQuerySchema,
  validateOrThrow,
} from "../validators/user.validator.js";
import { Request, Response } from "express";
import AuthService from "../services/auth.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Logger from "../utils/logger.js";
import { MulterMiddleware } from "../middlewares/multer.middleware.js";
import type { UserListQuery } from "../types/user.types.js";

@controller("/api/v1/user")
export default class AuthController extends BaseController {
  @inject(TYPES.AuthService)
  authService!: AuthService;

  @inject(TYPES.Logger)
  logger!: Logger;

  @httpPost("/register", MulterMiddleware.upload.single("avatar"))
  async register(req: Request, res: Response) {
    try {
      const body = validateOrThrow(registerSchema, req.body);

      if (!req.file) {
        return this.error(res, "Avatar is required", STATUS_CODE.BAD_REQUEST);
      }

      const user = await this.authService.register({
        ...body,
        avatarPath: req.file.path,
        avatarMimeType: req.file.mimetype,
      });

      res.cookie("token", user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return this.success(res, user, STATUS_CODE.CREATED);
    } catch (error) {
      this.logger.error(
        "register: request failed",
        error instanceof Error
          ? { error: error.message, stack: error.stack }
          : { error: String(error) },
      );
      return this.handleError(res, error);
    }
  }

  @httpPost("/login")
  async login(req: Request, res: Response) {
    try {
      const body = validateOrThrow(loginSchema, req.body);

      const user = await this.authService.login(body);

      res.cookie("token", user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return this.success(res, user, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @httpGet("/profile", authMiddleware(ALL_USER_ROLES))
  async profile(req: Request, res: Response) {
    try {
      const token =
        req.cookies?.token ??
        req.headers.authorization?.slice("Bearer ".length) ??
        "";

      const user = await this.authService.profile({
        userId: req.user!.userId,
        token,
      });
      return this.success(res, user, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @httpGet("/logout", authMiddleware(ALL_USER_ROLES))
  async logout(req: Request, res: Response) {
    this.logger.info("requesting logout", { userId: req.user?.userId });
    try {
      const token =
        req.cookies?.token ??
        req.headers.authorization?.slice("Bearer ".length) ??
        "";

      await this.authService.logout({ token, userId: req.user!.userId });

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return this.success(
        res,
        { message: "Logged out successfully" },
        STATUS_CODE.OK,
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @httpPatch("/restore/:userId", authMiddleware(USER_ROLE.ADMIN))
  async restore(req: Request, res: Response) {
    try {
      const { userId } = validateOrThrow(userIdParamsSchema, req.params);
      const user = await this.authService.restoreUser(req.user!.userId, userId);

      return this.success(res, user, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/user?page=1&limit=20&search=ali&role=USER */
  @httpGet("/", authMiddleware(ALL_USER_ROLES))
  async list(req: Request, res: Response) {
    try {
      const query = validateOrThrow(userListQuerySchema, req.query);

      /* skip/take are derived here, never accepted straight from the client. */
      const page = Number(query.page);
      const limit = Number(query.limit);

      const listQuery: UserListQuery = {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
        search: query.search,
        role: query.role,
      };

      const result = await this.authService.listUsers(listQuery);

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** PATCH /api/v1/user/:userId */
  @httpPatch("/:userId", authMiddleware(ALL_USER_ROLES))
  async update(req: Request, res: Response) {
    try {
      const { userId } = validateOrThrow(userIdParamsSchema, req.params);
      const body = validateOrThrow(updateUserDetailsSchema, req.body);

      const user = await this.authService.updateUserDetails(req.user!.userId, {
        userId,
        ...body,
      });

      return this.success(res, user, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** DELETE /api/v1/user/:userId */
  @httpDelete("/:userId", authMiddleware(ALL_USER_ROLES))
  async remove(req: Request, res: Response) {
    try {
      const { userId } = validateOrThrow(userIdParamsSchema, req.params);

      await this.authService.deleteUser(req.user!.userId, userId);

      return this.success(res, { message: "User deleted" }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
  
}
