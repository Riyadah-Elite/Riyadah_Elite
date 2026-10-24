/**
 * @author aliasgarbootwala3@gmial.com
 */

import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../config/types.js";
import {
  ALL_USER_ROLES,
  STATUS_CODE,
  USER_ROLE,
} from "../constants/constants.js";
import BaseController from "./base.controller.js";
import CategoryService from "../services/category.service.js";
import Logger from "../utils/logger.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  categoryIdParamsSchema,
  createCategorySchema,
} from "../validators/category.validator.js";
import { validateOrThrow } from "../validators/validate.js";

@controller("/api/v1/category")
export default class CategoryController extends BaseController {
  @inject(TYPES.CategoryService)
  categoryService!: CategoryService;

  @inject(TYPES.Logger)
  logger!: Logger;

  /** POST /api/v1/category - admin only. */
  @httpPost("/", authMiddleware(USER_ROLE.ADMIN))
  async create(req: Request, res: Response) {
    try {
      const body = validateOrThrow(createCategorySchema, req.body);

      const category = await this.categoryService.createCategory(
        req.user!.userId,
        body,
      );

      return this.success(res, { category }, STATUS_CODE.CREATED);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/category - any signed-in user. */
  @httpGet("/", authMiddleware(ALL_USER_ROLES))
  async list(_req: Request, res: Response) {
    try {
      const categories = await this.categoryService.listCategories();

      return this.success(res, { categories }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/category/:categoryId */
  @httpGet("/:categoryId", authMiddleware(ALL_USER_ROLES))
  async get(req: Request, res: Response) {
    try {
      const { categoryId } = validateOrThrow(
        categoryIdParamsSchema,
        req.params,
      );

      const category = await this.categoryService.getById(categoryId);

      return this.success(res, { category }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
  
}
