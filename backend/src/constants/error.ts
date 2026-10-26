/**
 * Centralized user-facing error messages.
 *
 * Controllers, services and middleware throw/report messages from here instead
 * of hard-coding strings, so wording stays consistent and can be changed in one
 * place.
 *
 * @author aliasgarbootwala3@gmial.com
 */

export const COMMON_ERRORS = {
  INTERNAL_SERVER_ERROR: "Something went wrong",
  VALIDATION_FAILED: "Invalid request",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "You are not allowed to access this resource",
} as const;

export const USER_ERRORS = {
  EMAIL_ALREADY_EXISTS: "This email is already registered",
  USERNAME_ALREADY_EXISTS: "Username is already taken",
  NOT_FOUND: "User not found",
  ACCOUNT_DELETED: "This account has been deleted",
  REGISTRATION_FAILED: "Something went wrong while registering",
  UPDATE_FORBIDDEN: "You are not allowed to update another user",
  DELETE_FORBIDDEN: "You are not allowed to delete another user",
  ROLE_CHANGE_FORBIDDEN: "Only an admin can change a role",
  RESTORE_FORBIDDEN: "Only an admin can restore a user",
} as const;

export const AUTH_ERRORS = {
  REQUIRED: "Authentication required",
  INVALID_TOKEN: "Invalid token",
  INVALID_PASSWORD: "Invalid password",
  TOKEN_INVALID: "Token is not valid",
  TOKEN_ALREADY_BLACKLISTED: "Token is already blacklisted",
  ACCOUNT_DELETED: "This account has been deleted",
  FORBIDDEN: "You are not allowed to access this resource",
} as const;

export const FILE_ERRORS = {
  REQUIRED: "Image file is required",
  NOT_FOUND: "File not found",
  INVALID_TYPE: "Only JPEG and PNG files are allowed",
  UPLOAD_FAILED: "Failed to upload file",
  VALIDATION_FAILED: "Error while validating uploaded file",
  NOT_RETRIEVABLE: "File content is not available",
} as const;

export const CATEGORY_ERRORS = {
  ALREADY_EXISTS: "Category already exists",
  NOT_FOUND: "Category not found",
  CREATE_FORBIDDEN: "Only an admin can create a category",
} as const;

export const LISTING_ERRORS = {
  NOT_FOUND: "Listing not found",
  CATEGORY_NOT_FOUND: "Category not found",
  AMOUNT_NOT_FOUND: "Amount not found",
  IMAGE_NOT_FOUND: "Image not found",
  ATTACHMENT_NOT_FOUND: "Attachment not found",
  INVALID_DATE_RANGE:
    "Testing deadline must be on or after the registration end date",
  HAS_RELATED_RECORDS:
    "Listing has related tournaments or bug reports and cannot be deleted",
} as const;

export const TOURNAMENT_ERRORS = {
  NOT_FOUND: "Tournament not found",
  GAME_LISTING_NOT_FOUND: "Game listing not found",
  INVALID_DATE_RANGE:
    "Registration end date must be on or before the tournament date",
} as const;

export const JOIN_LISTING_ERRORS = {
  GAME_NOT_FOUND: "Game listing not found",
  TOURNAMENT_NOT_FOUND: "Tournament not found",
  LISTING_NOT_ACTIVE: "This listing is not accepting joins",
  ALREADY_JOINED: "You have already joined this listing",
  JOIN_NOT_FOUND: "Join record not found",
  TOURNAMENT_FULL: "This tournament is full",
} as const;

export const ORG_ERRORS = {
  ROLE_REQUIRED: "Only an organization can access this resource",
} as const;

