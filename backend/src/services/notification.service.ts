/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import {
  NOTIFICATION_TYPE,
  STATUS_CODE,
  type UserRole,
} from "../constants/constants.js";
import { NOTIFICATION_ERRORS } from "../constants/error.js";
import ApiError from "../utils/apiError.js";
import Logger from "../utils/logger.js";
import NotificationRepository from "../repositories/notification.repository.js";
import type {
  CreateNotificationInput,
  NotificationQuery,
  NotificationType,
  PaginatedNotifications,
} from "../types/notification.types.js";

@injectable()
export default class NotificationService {
  @inject(TYPES.NotificationRepository)
  notificationRepository!: NotificationRepository;

  @inject(TYPES.Logger)
  logger!: Logger;

  async setNotificationAllowed(userId: string, allowed: boolean) {
    const result = await this.notificationRepository.setNotificationAllowed(
      userId,
      allowed,
    );

    this.logger.info("notification preference updated", {
      userId,
      isNotificationAllowed: result.isNotificationAllowed,
    });

    return result;
  }

  async listForUser(
    userId: string,
    query: NotificationQuery,
  ): Promise<PaginatedNotifications> {
    const { items, total, unreadCount } =
      await this.notificationRepository.listForUser(userId, query);

    const totalPages = Math.ceil(total / query.limit);

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
      unreadCount,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationRepository.findForUser(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new ApiError(
        NOTIFICATION_ERRORS.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    if (!notification.markAsRead) {
      await this.notificationRepository.markAsRead(notificationId, userId);
    }

    return { ...notification, markAsRead: true };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const result = await this.notificationRepository.deleteForUser(
      notificationId,
      userId,
    );

    if (result.count === 0) {
      throw new ApiError(
        NOTIFICATION_ERRORS.NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  async create(input: CreateNotificationInput) {
    const allowed = await this.notificationRepository.isNotificationAllowed(
      input.userId,
    );

    if (!allowed) {
      this.logger.info("notification skipped: recipient opted out", {
        userId: input.userId,
        type: input.type,
      });

      return null;
    }

    const notification = await this.notificationRepository.create(input);

    this.logger.info("notification created", {
      notificationId: notification.id,
      userId: input.userId,
      type: input.type,
    });

    return notification;
  }

  /** ADMIN / system notification (register, delete, restore). */
  async createSystem(userId: string, message: string) {
    return await this.create({
      userId,
      message,
      type: NOTIFICATION_TYPE.SYSTEM,
    });
  }

  /** ORG / DEVELOPER event notification (new listing, bug report). */
  async createEvent(userId: string, message: string) {
    return await this.create({
      userId,
      message,
      type: NOTIFICATION_TYPE.EVENT,
    });
  }

  async createPromotion(userId: string, message: string) {
    return await this.create({
      userId,
      message,
      type: NOTIFICATION_TYPE.PROMOTION,
    });
  }

  /**
   * Fans an event out to every active account with the given role. Used when a
   * listing is published and every tester should be told about it.
   */
  async notifyRole(
    role: UserRole,
    message: string,
    type: NotificationType = NOTIFICATION_TYPE.EVENT,
  ) {
    const users = await this.notificationRepository.listActiveUserIdsByRole(
      role,
    );

    const result = await this.notificationRepository.createMany(
      users.map((user) => ({ userId: user.id, message, type })),
    );

    this.logger.info("notifications created for role", {
      role,
      type,
      count: result.count,
    });

    return result;
  }
  
}
