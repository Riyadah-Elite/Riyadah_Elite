/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import type { UserRole } from "../constants/constants.js";
import { DbClient } from "../types/database.types.js";
import type {
  CreateNotificationInput,
  NotificationQuery,
} from "../types/notification.types.js";

@injectable()
export default class NotificationRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  /**
   * Notifications are opt-in. A missing user is treated as opted out so a
   * deleted or stale id can never produce an orphaned notification.
   */
  async isNotificationAllowed(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { isNotificationAllowed: true },
    });

    return user?.isNotificationAllowed ?? false;
  }

  async setNotificationAllowed(userId: string, allowed: boolean) {
    return await this.db.user.update({
      where: { id: userId },
      data: { isNotificationAllowed: allowed },
      select: { id: true, isNotificationAllowed: true },
    });
  }

  async listForUser(userId: string, query: NotificationQuery) {
    const where = { userId };

    const [items, total, unreadCount] = await this.db.$transaction([
      this.db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.notification.count({ where }),
      this.db.notification.count({
        where: { userId, markAsRead: false },
      }),
    ]);

    return { items, total, unreadCount };
  }

  async findForUser(notificationId: string, userId: string) {
    return await this.db.notification.findFirst({
      where: { id: notificationId, userId },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return await this.db.notification.updateMany({
      where: { id: notificationId, userId },
      data: { markAsRead: true },
    });
  }

  async deleteForUser(notificationId: string, userId: string) {
    return await this.db.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }

  async create(data: CreateNotificationInput) {
    return await this.db.notification.create({
      data: {
        userId: data.userId,
        message: data.message,
        type: data.type,
      },
    });
  }

  /** Bulk insert used when an event targets a whole role. */
  async createMany(data: CreateNotificationInput[]) {
    if (data.length === 0) {
      return { count: 0 };
    }

    return await this.db.notification.createMany({
      data: data.map((item) => ({
        userId: item.userId,
        message: item.message,
        type: item.type,
      })),
    });
  }

  async listActiveUserIdsByRole(role: UserRole) {
    return await this.db.user.findMany({
      where: { role, isDeleted: false, isNotificationAllowed: true },
      select: { id: true },
    });
  }
  
}
