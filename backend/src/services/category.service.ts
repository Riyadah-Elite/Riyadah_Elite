/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { STATUS_CODE } from "../constants/constants.js";
import { CATEGORY_ERRORS } from "../constants/error.js";
import ApiError from "../utils/apiError.js";
import Logger from "../utils/logger.js";
import CategoryRepository from "../repositories/category.repository.js";
import {
  CategoryResponse,
  CreateCategoryInput,
} from "../types/category.types.js";

@injectable()
export default class CategoryService {
  @inject(TYPES.CategoryRepository)
  categoryRepository!: CategoryRepository;

  @inject(TYPES.Logger)
  logger!: Logger;

  /** Admin-only (enforced by authMiddleware on the route). */
  async createCategory(
    adminId: string,
    input: CreateCategoryInput,
  ): Promise<CategoryResponse> {
    this.logger.info("creating category", { adminId });

    const existing = await this.categoryRepository.findByName(
      input.categoryName,
    );

    if (existing) {
      throw new ApiError(
        CATEGORY_ERRORS.ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    const category = await this.categoryRepository.create({
      categoryName: input.categoryName,
      adminId,
    });

    this.logger.info("category created", { categoryId: category.id });

    return this.toResponse(category);
  }

  async listCategories(): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepository.list();

    return categories.map((category) => this.toResponse(category));
  }

  async getById(categoryId: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new ApiError(CATEGORY_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return this.toResponse(category);
  }

  private toResponse(category: {
    id: string;
    categoryName: string;
    adminId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): CategoryResponse {
    return {
      id: category.id,
      categoryName: category.categoryName,
      adminId: category.adminId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
