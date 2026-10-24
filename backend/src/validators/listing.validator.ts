/**
 * @author aliasgarbootwala3@gmial.com
 */

import Joi from "joi";
import { PAGINATION } from "../constants/constants.js";
import { TESTING_STATUSES } from "../types/user.types.js";
import { LISTING_STATUSES, PLATFORMS } from "../types/listing.types.js";

const cuid = Joi.string().pattern(/^c[a-z0-9]{24}$/);

const gameListingFields = {
  gameName: Joi.string().trim().min(2).max(100).required(),
  categoryId: cuid.required(),
  description: Joi.string().trim().allow(null, "").max(5000),
  bugsListing: Joi.string().trim().allow(null, "").max(5000),
  guides: Joi.string().trim().allow(null, "").max(5000),
  platform: Joi.string()
    .valid(...PLATFORMS)
    .allow(null),
  gameUrl: Joi.string().uri().allow(null, ""),
  imageId: cuid.allow(null),
  amountId: cuid.allow(null),
  fileId: cuid.allow(null),
  maxEntry: Joi.number().min(0),
  minEntry: Joi.number().min(0),
  status: Joi.string().valid(...LISTING_STATUSES),
  registrationEndDate: Joi.date().iso().required(),
  testingDeadline: Joi.date().iso().required(),
  scheduling: Joi.date().iso().allow(null),
};

export const createGameListingSchema = Joi.object(gameListingFields);

export const updateGameListingSchema = Joi.object(gameListingFields)
  .fork(
    ["gameName", "categoryId", "registrationEndDate", "testingDeadline"],
    (schema) => schema.optional(),
  )
  .min(1);

const tournamentFields = {
  tournamentName: Joi.string().trim().min(2).max(100).required(),
  gameListingId: cuid.required(),
  description: Joi.string().trim().allow(null, "").max(5000),
  tournamentDate: Joi.date().iso().allow(null),
  tournamentTime: Joi.date().iso().allow(null),
  maxEntry: Joi.number().min(0),
  minEntry: Joi.number().min(0),
  teamSize: Joi.number().integer().min(1),
  status: Joi.string().valid(...LISTING_STATUSES),
  amountId: cuid.allow(null),
  imageId: cuid.allow(null),
  tournamentUrl: Joi.string().uri().allow(null, ""),
  fileId: cuid.allow(null),
  registrationEndDate: Joi.date().iso().allow(null),
  scheduling: Joi.date().iso().allow(null),
};

export const createTournamentSchema = Joi.object(tournamentFields);

export const updateTournamentSchema = Joi.object(tournamentFields)
  .fork(["tournamentName", "gameListingId"], (schema) => schema.optional())
  .min(1);

const paginationFields = {
  page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
};

export const listingQuerySchema = Joi.object({
  ...paginationFields,
  search: Joi.string().trim().min(1).max(100),
  status: Joi.string().valid(...LISTING_STATUSES),
  platform: Joi.string().valid(...PLATFORMS),
  categoryId: cuid,
});

export const tournamentQuerySchema = Joi.object({
  ...paginationFields,
  search: Joi.string().trim().min(1).max(100),
  status: Joi.string().valid(...LISTING_STATUSES),
  gameListingId: cuid,
});

export const userTrackingQuerySchema = Joi.object({
  ...paginationFields,
  search: Joi.string().trim().min(1).max(100),
  testingStatus: Joi.string().valid(...TESTING_STATUSES),
});

export const listingIdParamsSchema = Joi.object({
  listingId: cuid.required(),
});

export const tournamentIdParamsSchema = Joi.object({
  tournamentId: cuid.required(),
});
