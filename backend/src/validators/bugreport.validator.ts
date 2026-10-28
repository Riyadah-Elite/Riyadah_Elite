/**
 * @author aliasgarbootwala3@gmial.com
 */

import Joi from "joi";
import { PAGINATION } from "../constants/constants.js";
import { BUG_STATUSES } from "../types/bugreport.types.js";

const cuid = Joi.string().pattern(/^c[a-z0-9]{24}$/);

export const createBugReportSchema = Joi.object({
  gameListingId: cuid.required(),
  bugDescription: Joi.string().trim().min(1).max(5000).required(),
  imageId: cuid.allow(null),
  fileId: cuid.allow(null),
});

export const bugReportQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
  gameListingId: cuid,
  status: Joi.string().valid(...BUG_STATUSES),
  search: Joi.string().trim().min(1).max(100),
});

export const bugReportIdParamsSchema = Joi.object({
  bugId: cuid.required(),
});

export const updateBugReportStatusSchema = Joi.object({
  status: Joi.string().valid(...BUG_STATUSES).required(),
});
