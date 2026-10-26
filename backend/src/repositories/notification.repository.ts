/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import type { UserRole } from "../constants/constants.js";
import { DbClient } from "../types/database.types.js";
import type { CreateNotificationInput } from "../types/notification.types.js";

@injectable()
export default class NotificationRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
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
      where: { role, isDeleted: false },
      select: { id: true },
    });
  }
  
}
