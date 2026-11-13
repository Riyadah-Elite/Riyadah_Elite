/**
 * @author aliasgarbootwala3@gmial.com
 */

import { NOTIFICATION_TYPE } from "../constants/constants.js";
import type { PaginationMeta } from "./user.types.js";

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export const NOTIFICATION_TYPES = Object.values(
  NOTIFICATION_TYPE,
) as NotificationType[];

export interface CreateNotificationInput {
  userId: string;
  message: string;
  type: NotificationType;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  message: string;
  markAsRead: boolean;
  type: NotificationType;
  createdAt: Date;
}

export interface NotificationQuery {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginatedNotifications {
  items: NotificationRecord[];
  pagination: PaginationMeta;
  unreadCount: number;
}
