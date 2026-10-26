/**
 * Single entry point for creating notifications from any service.
 *
 * Services call `notifySystem`, `notifyEvent`, `notifyPromotion` or
 * `notifyRole` instead of talking to the repository directly. The
 * `NotificationService` is registered once by the DI container (see
 * `config/container.ts`), which avoids importing the container here and
 * creating a module cycle.
 *
 * Delivery failures are logged but never bubble up: a notification is a side
 * effect of the main action (register, create listing) and must not fail it.
 *
 * @author aliasgarbootwala3@gmial.com
 */

import { NOTIFICATION_TYPE, type UserRole } from "../constants/constants.js";
import type NotificationService from "../services/notification.service.js";
import type { NotificationType } from "../types/notification.types.js";
import Logger from "./logger.js";

const logger = new Logger();

let resolveNotificationService: (() => NotificationService) | null = null;
let notificationService: NotificationService | null = null;

/**
 * The container passes a resolver (not an instance) so the database client is
 * only built the first time a notification is actually sent.
 */
export function setNotificationService(resolver: () => NotificationService) {
  resolveNotificationService = resolver;
}

function getNotificationService(): NotificationService | null {
  if (!notificationService && resolveNotificationService) {
    notificationService = resolveNotificationService();
  }

  return notificationService;
}

async function run<T>(
  label: string,
  operation: (service: NotificationService) => Promise<T>,
): Promise<T | null> {
  try {
    const service = getNotificationService();

    if (!service) {
      logger.error("notification service is not registered", { label });
      return null;
    }

    return await operation(service);
  } catch (error) {
    logger.error("failed to create notification", { label, cause: error });
    return null;
  }
}

/** ADMIN / system notification (register, delete, restore). */
export function notifySystem(userId: string, message: string) {
  return run("system", (service) => service.createSystem(userId, message));
}

/** ORG / DEVELOPER event notification (new listing, bug report). */
export function notifyEvent(userId: string, message: string) {
  return run("event", (service) => service.createEvent(userId, message));
}

export function notifyPromotion(userId: string, message: string) {
  return run("promotion", (service) => service.createPromotion(userId, message));
}

/** Sends one event notification to every active account with `role`. */
export function notifyRole(
  role: UserRole,
  message: string,
  type: NotificationType = NOTIFICATION_TYPE.EVENT,
) {
  return run("role", (service) => service.notifyRole(role, message, type));
}
