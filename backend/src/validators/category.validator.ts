/**
 * @author aliasgarbootwala3@gmial.com
 */

import Joi from "joi";

/** Body for POST /api/v1/category (admin only). */
export const createCategorySchema = Joi.object({
  categoryName: Joi.string().trim().min(2).max(50).required(),
});

export const categoryIdParamsSchema = Joi.object({
  categoryId: Joi.string()
    .pattern(/^c[a-z0-9]{24}$/)
    .required(),
});
