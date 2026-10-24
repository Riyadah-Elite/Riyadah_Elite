/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { DbClient } from "../types/database.types.js";
import { CreateCategoryRow } from "../types/category.types.js";

@injectable()
export default class CategoryRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  async create(data: CreateCategoryRow) {
    return await this.db.category.create({
      data: {
        categoryName: data.categoryName,
        adminId: data.adminId,
      },
    });
  }

  async findByName(categoryName: string) {
    return await this.db.category.findUnique({
      where: { categoryName },
    });
  }

  async findById(id: string) {
    return await this.db.category.findUnique({ where: { id } });
  }

  async list() {
    return await this.db.category.findMany({
      orderBy: { categoryName: "asc" },
    });
  }
  
}
