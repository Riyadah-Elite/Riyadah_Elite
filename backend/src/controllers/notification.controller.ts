/**
 * Authenticated notification endpoints.
 *
 * Every route is scoped to the caller: a user can only read, mark or delete
 * their own notifications.
 *
 * @author aliasgarbootwala3@gmial.com
 */

import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
} from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../config/types.js";
import { ALL_USER_ROLES, STATUS_CODE } from "../constants/constants.js";
import BaseController from "./base.controller.js";
import NotificationService from "../services/notification.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateOrThrow } from "../validators/validate.js";
import {
  notificationAllowedSchema,
  notificationIdParamsSchema,
  notificationQuerySchema,
} from "../validators/notification.validator.js";
import type { NotificationQuery } from "../types/notification.types.js";

@controller("/api/v1/notification")
export default class NotificationController extends BaseController {
  @inject(TYPES.NotificationService)
  notificationService!: NotificationService;

  /** PATCH /api/v1/notification/allow */
  @httpPatch("/allow", authMiddleware(ALL_USER_ROLES))
  async setAllowed(req: Request, res: Response) {
    try {
      const { isNotificationAllowed } = validateOrThrow(
        notificationAllowedSchema,
        req.body,
      );

      const result = await this.notificationService.setNotificationAllowed(
        req.user!.userId,
        isNotificationAllowed,
      );

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/notification?page=1&limit=20 */
  @httpGet("/", authMiddleware(ALL_USER_ROLES))
  async list(req: Request, res: Response) {
    try {
      const query = validateOrThrow(notificationQuerySchema, req.query);

      const page = Number(query.page);
      const limit = Number(query.limit);

      const notificationQuery: NotificationQuery = {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
      };

      const result = await this.notificationService.listForUser(
        req.user!.userId,
        notificationQuery,
      );

      return this.success(res, result, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** PATCH /api/v1/notification/:notificationId/read */
  @httpPatch("/:notificationId/read", authMiddleware(ALL_USER_ROLES))
  async markAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = validateOrThrow(
        notificationIdParamsSchema,
        req.params,
      );

      const notification = await this.notificationService.markAsRead(
        req.user!.userId,
        notificationId,
      );

      return this.success(res, { notification }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** DELETE /api/v1/notification/:notificationId */
  @httpDelete("/:notificationId", authMiddleware(ALL_USER_ROLES))
  async remove(req: Request, res: Response) {
    try {
      const { notificationId } = validateOrThrow(
        notificationIdParamsSchema,
        req.params,
      );

      await this.notificationService.deleteNotification(
        req.user!.userId,
        notificationId,
      );

      return this.success(
        res,
        { message: "Notification deleted" },
        STATUS_CODE.OK,
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }
  
}
