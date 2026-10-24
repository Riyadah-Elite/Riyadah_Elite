/**
 * @author aliasgarbootwala3@gmial.com
 */

/** Mirrors the `Category` model in prisma/schema.prisma. */
export interface CategoryRecord {
  id: string;
  categoryName: string;
  adminId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryResponse = CategoryRecord;

/** Body for creating a category (admin only). */
export interface CreateCategoryInput {
  categoryName: string;
}

/** Row written to the Category table. */
export interface CreateCategoryRow {
  categoryName: string;
  adminId: string;
}
