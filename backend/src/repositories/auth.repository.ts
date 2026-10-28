/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { DbClient } from "../types/database.types.js";
import {
  CreateUserFileInput,
  CreateUserInput,
  UpdateUserProgressInput,
  UserListQuery,
} from "../types/user.types.js";
import { INITIAL_TESTING_RANK } from "../utils/rank.js";

/**
 * The columns any caller may see. Kept as one object so the "public" rule is
 * defined once instead of being re-typed per query - adding an email or a
 * testing field to the model can never leak by accident.
 */
const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  role: true,
  createdAt: true,
  avatar: { select: { imageUrl: true } },
} as const;

@injectable()
export default class AuthRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  /**
   * Fields are listed explicitly instead of spreading `userData`, so a new
   * column on the model can never be written by accident.
   *
   * An avatar is a row in File that the user then points at via `avatarId`,
   * and File needs the user's id - so it is a transaction rather than a nested
   * write, otherwise the two halves could disagree.
   */
  async createUser(userData: CreateUserInput, avatar?: CreateUserFileInput) {
    return await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          testingRank: INITIAL_TESTING_RANK,
          ...(userData.avatarId ? { avatarId: userData.avatarId } : {}),
        },
        include: { avatar: { select: { imageUrl: true } } },
      });

      if (!avatar?.imageUrl) {
        return user;
      }

      const file = await tx.file.create({
        data: {
          userId: user.id,
          imageUrl: avatar.imageUrl,
          description: avatar.description ?? null,
          fileUrl: avatar.fileUrl ?? null,
        },
      });

      return await tx.user.update({
        where: { id: user.id },
        data: { avatarId: file.id },
        include: { avatar: { select: { imageUrl: true } } },
      });
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
      include: { avatar: { select: { imageUrl: true } } },
    });
  }

  async findUserById(id: string) {
    return await this.db.user.findUnique({
      where: { id, isDeleted: false },
      include: { avatar: { select: { imageUrl: true } } },
    });
  }

  async findUserByIdIncludingDeleted(id: string) {
    return await this.db.user.findUnique({
      where: { id },
      include: { avatar: { select: { imageUrl: true } } },
    });
  }

  async findUserForAuthorization(id: string) {
    return await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        isDeleted: true,
        tokenVersion: true,
      },
    });
  }

  async isTokenBlacklisted(token: string) {
    return await this.db.blacklistToken.findUnique({
      where: { token },
    });
  }

  /**
   * One page of users plus the total count.
   *
   * Both queries run together so the count cannot drift from the rows - two
   * separate round trips would race with concurrent writes.
   */
  async listUsers(query: UserListQuery) {
    const where = {
      ...(query.search
        ? { username: { contains: query.search, mode: "insensitive" as const } }
        : {}),
      ...(query.role ? { role: query.role } : {}),
      isDeleted: false,
    };

    const [users, total] = await this.db.$transaction([
      this.db.user.findMany({
        where,
        select: PUBLIC_USER_SELECT,
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.user.count({ where }),
    ]);

    return { users, total };
  }

  async findByUsername(username: string) {
    return await this.db.user.findFirst({
      where: { username, isDeleted: false },
      select: { id: true, email: true, role: true },
    });
  }

  /** Fields an admin may change. Password is never in this path. */
  async updateUser(
    id: string,
    data: {
      username?: string;
      role?: CreateUserInput["role"];
      isNotificationAllowed?: boolean;
      testingStatus?: UpdateUserProgressInput["testingStatus"];
      testingPoints?: number;
      testingRank?: string | null;
      tournamentStatus?: UpdateUserProgressInput["tournamentStatus"];
      exitReason?: string | null;
    },
  ) {
    return await this.db.user.update({
      where: { id },
      data,
      include: { avatar: { select: { imageUrl: true } } },
    });
  }

  /**
   * Replaces the avatar with a new File row and repoints `avatarId`. The old
   * File row is deleted in the same transaction so the bucket and the table do
   * not drift apart.
   */
  async replaceAvatar(id: string, imageUrl: string) {
    return await this.db.$transaction(async (tx) => {
      const current = await tx.user.findUnique({
        where: { id },
        select: { avatarId: true },
      });

      const file = await tx.file.create({
        data: { userId: id, imageUrl },
      });

      const user = await tx.user.update({
        where: { id },
        data: { avatarId: file.id },
        include: { avatar: { select: { imageUrl: true } } },
      });

      if (current?.avatarId && current.avatarId !== file.id) {
        await tx.file.delete({ where: { id: current.avatarId } });
      }

      return user;
    });
  }

  /** Invalidates every previously issued access token and soft-deletes once. */
  async softDeleteUser(id: string) {
    return await this.db.user.updateMany({
      where: { id, isDeleted: false },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        tokenVersion: { increment: 1 },
      },
    });
  }

  async restoreUser(id: string) {
    return await this.db.user.updateMany({
      where: { id, isDeleted: true },
      data: { isDeleted: false, deletedAt: null },
    });
  }

  async createToken(token: string, userId: string, expiresAt: Date) {
    return await this.db.blacklistToken.create({
      data: { token, userId, expiresAt },
    });
  }
}