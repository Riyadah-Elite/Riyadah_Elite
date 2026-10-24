/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import path from "path";
import { TYPES } from "../config/types.js";
import { STATUS_CODE } from "../constants/constants.js";
import { FILE_ERRORS } from "../constants/error.js";
import ApiError from "../utils/apiError.js";
import Logger from "../utils/logger.js";
import StorageService from "../utils/storage.js";
import FileRepository from "../repositories/file.repository.js";
import {
  FileContent,
  FileResponse,
  UploadFileInput,
} from "../types/file.types.js";

/** `data:<mime>;base64,<payload>` */
const DATA_URL_PATTERN = /^data:([^;,]+);base64,(.*)$/s;

@injectable()
export default class FileService {
  @inject(TYPES.FileRepository)
  fileRepository!: FileRepository;

  @inject(TYPES.StorageService)
  storageService!: StorageService;

  @inject(TYPES.Logger)
  logger!: Logger;

  /**
   * Uploads the temp file to MinIO, keeps a data URL for direct rendering and
   * records both on a new File row.
   */
  async upload(input: UploadFileInput): Promise<FileResponse> {
    this.logger.info("uploading file", { userId: input.userId });

    const extension =
      path.extname(input.originalName) || path.extname(input.filePath);

    const key = `files/${Date.now()}-${input.userId}${extension}`;

    const { url, buffer } = await this.storageService.put(
      key,
      input.filePath,
      input.mimeType,
    );

    const imageUrl = `data:${input.mimeType};base64,${buffer.toString("base64")}`;

    const file = await this.fileRepository.create({
      userId: input.userId,
      imageUrl,
      fileUrl: url,
      description: input.description ?? null,
    });

    this.logger.info("file uploaded", { fileId: file.id });

    return this.toResponse(file);
  }

  async getById(fileId: string): Promise<FileResponse> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new ApiError(FILE_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return this.toResponse(file);
  }

  /**
   * Resolves the stored image back to bytes so it can be streamed to a client.
   * Files created by this service hold a data URL; a plain remote URL is also
   * supported as a fallback.
   */
  async getContent(fileId: string): Promise<FileContent> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new ApiError(FILE_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const dataUrl = file.imageUrl ? DATA_URL_PATTERN.exec(file.imageUrl) : null;

    if (dataUrl) {
      return {
        buffer: Buffer.from(dataUrl[2], "base64"),
        mimeType: dataUrl[1],
      };
    }

    if (file.imageUrl || file.fileUrl) {
      const remoteUrl = file.imageUrl ?? file.fileUrl;

      if (remoteUrl && /^https?:\/\//i.test(remoteUrl)) {
        const response = await fetch(remoteUrl);

        if (response.ok) {
          return {
            buffer: Buffer.from(await response.arrayBuffer()),
            mimeType:
              response.headers.get("content-type") ?? "application/octet-stream",
          };
        }
      }
    }

    throw new ApiError(
      FILE_ERRORS.NOT_RETRIEVABLE,
      STATUS_CODE.INPROCESSABLE_ENTITY,
    );
  }

  private toResponse(file: {
    id: string;
    userId: string;
    imageUrl: string | null;
    description: string | null;
    fileUrl: string | null;
    gameListingId: string | null;
    tournamentId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): FileResponse {
    return {
      id: file.id,
      userId: file.userId,
      imageUrl: file.imageUrl,
      description: file.description,
      fileUrl: file.fileUrl,
      gameListingId: file.gameListingId,
      tournamentId: file.tournamentId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
