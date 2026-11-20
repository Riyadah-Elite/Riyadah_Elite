/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import { DbClient } from "../types/database.types.js";
import type {
  BugReportQuery,
  BugStatus,
  CreateBugReportInput,
} from "../types/bugreport.types.js";

const BUG_REPORT_INCLUDE = {
  user: { select: { id: true, username: true, role: true } },
  gameListing: { select: { id: true, gameName: true, userId: true } },
  image: { select: { id: true, imageUrl: true } },
  attachment: { select: { id: true, fileUrl: true } },
} as const;

@injectable()
export default class BugReportRepository {
  private readonly db: DbClient;

  constructor(@inject(TYPES.PrismaClient) db: DbClient) {
    this.db = db;
  }

  // -------------------------------------------------------------------------
  // Preconditions
  // -------------------------------------------------------------------------

  async findGameListing(id: string) {
    return await this.db.gameListing.findUnique({
      where: { id },
      select: {
        id: true,
        gameName: true,
        userId: true,
        status: true,
        testingDeadline: true,
      },
    });
  }

  async isEnrolled(userId: string, gameListingId: string) {
    return (
      (await this.db.joinListing.count({
        where: { userId, gameListingId },
      })) > 0
    );
  }

  async fileOwnedBy(fileId: string, userId: string) {
    return (await this.db.file.count({ where: { id: fileId, userId } })) > 0;
  }

  async findUser(userId: string) {
    return await this.db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
  }

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  async create(data: CreateBugReportInput & { userId: string }) {
    return await this.db.bugReport.create({
      data: {
        userId: data.userId,
        gameListingId: data.gameListingId,
        bugDescription: data.bugDescription,
        imageId: data.imageId ?? null,
        fileId: data.fileId ?? null,
      },
      include: BUG_REPORT_INCLUDE,
    });
  }

  async updateStatus(bugId: string, status: BugStatus) {
    return await this.db.bugReport.update({
      where: { id: bugId },
      data: { status },
      include: BUG_REPORT_INCLUDE,
    });
  }

  // -------------------------------------------------------------------------
  // Reads (role scoped)
  // -------------------------------------------------------------------------

  async listForUser(userId: string, query: BugReportQuery) {
    const where = { userId, ...this.filters(query) };

<<<<<<< HEAD
    const [items, total] = await this.db.$transaction([
=======
    const [items, total] = await Promise.all([
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
      this.db.bugReport.findMany({
        where,
        include: BUG_REPORT_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.bugReport.count({ where }),
    ]);

    return { items, total };
  }

  async listForDeveloper(developerId: string, query: BugReportQuery) {
    const where = {
      gameListing: { userId: developerId },
      ...this.filters(query),
    };

<<<<<<< HEAD
    const [items, total] = await this.db.$transaction([
=======
    const [items, total] = await Promise.all([
      this.db.bugReport.findMany({
        where,
        include: BUG_REPORT_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.bugReport.count({ where }),
    ]);

    return { items, total };
  }

  async listForAdmin(query: BugReportQuery) {
    const where = this.filters(query);

    const [items, total] = await Promise.all([
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
      this.db.bugReport.findMany({
        where,
        include: BUG_REPORT_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.take,
      }),
      this.db.bugReport.count({ where }),
    ]);

    return { items, total };
  }

  async findForUser(bugId: string, userId: string) {
    return await this.db.bugReport.findFirst({
      where: { id: bugId, userId },
      include: BUG_REPORT_INCLUDE,
    });
  }

  async findForDeveloper(bugId: string, developerId: string) {
    return await this.db.bugReport.findFirst({
      where: { id: bugId, gameListing: { userId: developerId } },
      include: BUG_REPORT_INCLUDE,
    });
  }

<<<<<<< HEAD
=======
  async findForAdmin(bugId: string) {
    return await this.db.bugReport.findUnique({
      where: { id: bugId },
      include: BUG_REPORT_INCLUDE,
    });
  }

>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  private filters(query: BugReportQuery) {
    return {
      ...(query.gameListingId
        ? { gameListingId: query.gameListingId }
        : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            bugDescription: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };
  }
}
