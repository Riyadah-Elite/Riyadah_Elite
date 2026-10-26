/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { NOTIFICATION_TYPE, type UserRole } from "../constants/constants.js";
import Logger from "../utils/logger.js";
import NotificationRepository from "../repositories/notification.repository.js";
import type {
  CreateNotificationInput,
  NotificationType,
} from "../types/notification.types.js";

@injectable()
export default class NotificationService {
  @inject(TYPES.NotificationRepository)
  notificationRepository!: NotificationRepository;

  @inject(TYPES.Logger)
  logger!: Logger;

  async create(input: CreateNotificationInput) {
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
