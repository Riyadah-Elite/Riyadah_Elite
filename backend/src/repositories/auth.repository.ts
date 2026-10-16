/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { DbClient } from "../types/database.types.js";
import { CreateUserInput } from "../types/auth.types.js";

@injectable()
export default class AuthRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  async createUser(userData: CreateUserInput) {
    return await this.db.user.create({
      data: userData,
    });
  }

  /**
   * `password` is omitted client-wide, so the login check has to opt back in
   * to it explicitly. Every other read of a user gets the hash-free shape.
   */
  async findByEmail(email: string) {
    return await this.db.user.findUnique({
      where: { email },
      omit: { password: false },
    });
  }

  async findUserById(id: string) {
    return await this.db.user.findUnique({
      where: { id },
    });
  }

  async isTokenBlacklisted(token: string) {
    return await this.db.blacklistToken.findUnique({
      where: { token },
    });
  }

  async createToken(token: string, userId: string, expiresAt: Date) {
    return await this.db.blacklistToken.create({
      data: { token, userId, expiresAt },
    });
  }
  
}