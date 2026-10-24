/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { DbClient } from "../types/database.types.js";
import { CreateFileInput } from "../types/file.types.js";

@injectable()
export default class FileRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  async create(data: CreateFileInput) {
    return await this.db.file.create({
      data: {
        userId: data.userId,
        imageUrl: data.imageUrl,
        description: data.description ?? null,
        fileUrl: data.fileUrl ?? null,
        gameListingId: data.gameListingId ?? null,
        tournamentId: data.tournamentId ?? null,
      },
    });
  }

  async findById(id: string) {
    return await this.db.file.findUnique({ where: { id } });
  }

  async findByUser(userId: string) {
    return await this.db.file.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
  
}
