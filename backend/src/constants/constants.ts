/**
 * @author aliasgarbootwala3@gmial.com
 */

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

/** Page size ceiling so one request cannot ask for the whole table. */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
  ORG: "ORG",
  DEVELOPER: "DEVELOPER",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLES: UserRole[] = Object.values(USER_ROLE);

export const ALL_USER_ROLES: UserRole[] = [...USER_ROLES];

export const TESTING_STATUS = {
  PENDING: "pending",
  INPROGRESS: "inprogress",
  COMPLETED: "completed",
  FAILURE: "failure",
} as const;

export const TOURNAMENT_STATUS = {
  PENDING: "pending",
  INPROGRESS: "inprogress",
  COMPLETED: "completed",
  FAILURE: "failure",
} as const;

export const LISTING_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const PLATFORM = {
  ANDROID: "android",
  WEB: "web",
  IOS: "ios",
  WINDOWS: "windows",
  CONSOLE: "console",
  LINUX: "linux",
  MACOS: "macos"
} as const;

export const BUG_STATUS = {
  OPEN: "open",
  INPROGRESS: "inprogress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export const CURRENCY = {
  USD: "USD",
  INR: "INR",
  QAR: "QAR",
  SDG: "SDG",
  EUR: "EUR",
} as const;

export const NOTIFICATION_TYPE = {
  SYSTEM: "system",
  PROMOTION: "promotion",
  EVENT: "event",
} as const;