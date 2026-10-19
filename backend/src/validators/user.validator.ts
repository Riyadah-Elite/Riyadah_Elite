/**
 * @author aliasgarbootwala3@gmial.com
 */

import Joi from "joi";
import { PAGINATION, STATUS_CODE, USER_ROLE } from "../constants/constants.js";
import ApiError from "../utils/apiError.js";
import {
  TESTING_STATUSES,
  TOURNAMENT_STATUSES,
  USER_ROLES,
} from "../types/user.types.js";

/*
 * Boundary validation for everything the User model accepts. The allowed enum
 * values come from types/user.types.ts, which mirrors prisma/schema.prisma, so
 * adding a role to the schema does not require hunting through this file.
 */

/*
 * bcrypt hashes at most 72 bytes and silently truncates anything longer, so 72
 * characters is the real ceiling - rejecting earlier than that is pointless and
 * accepting beyond it is a security hole.
 */
const PASSWORD_MAX = 72;

const username = Joi.string().trim().min(3).max(30);

const email = Joi.string().trim().email({ tlds: false }).max(254).lowercase();

const password = Joi.string().min(8).max(PASSWORD_MAX);

/**
 * Registration body. The avatar is a multipart file handled by multer, so it is
 * not part of this schema.
 */
export const registerSchema = Joi.object({
  username: username.required(),
  email: email.required(),
  password: password.required(),
  // Defaults to the least-privileged role; a client cannot self-assign ADMIN.
  role: Joi.string()
    .valid(...USER_ROLES)
    .default(USER_ROLE.USER),
});

/**
 * Login body. Deliberately does not enforce the registration password policy:
 * length rules belong at account creation, and copying them here would lock
 * out anyone whose password is already stored from before the policy changed.
 */
export const loginSchema = Joi.object({
  email: email.required(),
  password: Joi.string().required(),
});

/** A user editing their own profile. `role` is intentionally not editable. */
export const updateProfileSchema = Joi.object({
  username,
  isNotificationAllowed: Joi.boolean(),
}).min(1);

/** Admin-only: change a user's role. */
export const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...USER_ROLES)
    .required(),
});

/** Testing and tournament progress. */
export const updateUserProgressSchema = Joi.object({
  testingStatus: Joi.string().valid(...TESTING_STATUSES),
  exitReason: Joi.string().allow(null, "").max(500),
  tournamentStatus: Joi.string().valid(...TOURNAMENT_STATUSES),
  testingPoints: Joi.number().min(0),
  testingRank: Joi.string().allow(null, "").max(50),
}).min(1);

/** Optional avatar metadata, for a client that uploads it as JSON metadata. */
export const avatarMetadataSchema = Joi.object({
  imageUrl: Joi.string().uri().allow(null, ""),
  description: Joi.string().allow(null, "").max(500),
});

/**
 * Throws the first validation error as a message string, or returns null when
 * the payload is valid. Keeps controllers to a single `if` instead of making
 * them unpack `error.details`.
 */
export function firstErrorMessage(error: Joi.ValidationError): string {
  return error.details[0]?.message ?? "Invalid request";
}

/**
 * `:userId` route params.
 *
 * Ids are cuid (or a uuid for tokens), so the pattern rejects anything else
 * before it reaches a query.
 */
export const userIdParamsSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[a-z0-9]+$/i)
    .max(64)
    .required(),
});

/**
 * Query string for the list endpoint.
 *
 * Everything arrives as text, so `convert: true` (the default) is what turns
 * "2" into 2 - the values below are typed as numbers, not strings.
 */
export const userListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
  search: Joi.string().trim().min(1).max(30),
  role: Joi.string().valid(...USER_ROLES),
});

/**
 * Body for updating another user. Every field is optional but at least one must
 * be present, otherwise PATCH /:userId would silently succeed doing nothing.
 */
export const updateUserDetailsSchema = Joi.object({
  username,
  role: Joi.string().valid(...USER_ROLES),
  isNotificationAllowed: Joi.boolean(),
}).min(1);

/**
 * Runs a schema and returns the coerced value, or throws an ApiError the
 * controller already knows how to turn into a 400.
 *
 * `stripUnknown` drops fields the schema does not declare instead of failing,
 * so an older client sending extra keys is not rejected - but those keys can
 * never reach the service either.
 */
export function validateOrThrow<TSchema extends Joi.Schema>(
  schema: TSchema,
  payload: unknown,
): Joi.UnwrapSchemaLikeWithoutArray<TSchema> {
  const { error, value } = schema.validate(payload, {
    abortEarly: true,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    throw new ApiError(error.details[0]?.message ?? "Invalid request", STATUS_CODE.BAD_REQUEST);
  }

  return value as Joi.UnwrapSchemaLikeWithoutArray<TSchema>;
}