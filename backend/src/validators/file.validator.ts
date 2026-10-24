/**
 * @author aliasgarbootwala3@gmial.com
 */

import Joi from "joi";

/** `:fileId` route param; ids are cuid, so reject anything else early. */
export const fileIdParamsSchema = Joi.object({
  fileId: Joi.string()
    .pattern(/^c[a-z0-9]{24}$/)
    .required(),
});

/** Optional metadata sent alongside the multipart image. */
export const uploadFileSchema = Joi.object({
  description: Joi.string().trim().allow(null, "").max(500),
});
