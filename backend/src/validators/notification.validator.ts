/**
 * Boundary validation for the notification endpoints.
 *
 * @author aliasgarbootwala3@gmial.com
 */

import Joi from "joi";
import { PAGINATION } from "../constants/constants.js";

const cuid = Joi.string().pattern(/^c[a-z0-9]{24}$/);

export const notificationAllowedSchema = Joi.object({
  isNotificationAllowed: Joi.boolean().required(),
});

export const notificationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
});

export const notificationIdParamsSchema = Joi.object({
  notificationId: cuid.required(),
});
