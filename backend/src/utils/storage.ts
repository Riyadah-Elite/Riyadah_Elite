/**
 * @author aliasgarbootwala3@gmial.com
*/
import { injectable, inject } from "inversify";
import { Client as MinioClient } from "minio";
import fs from "fs";
import { TYPES } from "../config/types.js";
import Logger from "./logger.js";
import { IStorage } from "../types/storage.types.js";
import ApiError from "./apiError.js";
import { STATUS_CODE } from "../constants/constants.js";
import { FILE_ERRORS } from "../constants/error.js";

@injectable()
export default class StorageService implements IStorage {
  private readonly client: MinioClient;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly logger: Logger;

  constructor(
    @inject(TYPES.Logger)
    logger: Logger,
  ) {
    const url = new URL(process.env.S3_ENDPOINT!);

    this.endpoint = url.origin;

    this.client = new MinioClient({
      endPoint: url.hostname,

      port: url.port ? Number(url.port) : url.protocol === "https:" ? 443 : 80,

      accessKey: process.env.S3_ACCESS_KEY!,

      secretKey: process.env.S3_SECRET_KEY!,

      useSSL: url.protocol === "https:" || process.env.S3_USE_SSL === "true",
    });

    this.bucket = process.env.S3_BUCKET!;

    this.logger = logger;
  }

  private static formatError(error: unknown): string {
    if (error instanceof Error) {
      const code = (error as NodeJS.ErrnoException).code;

      return code ? `${code}: ${error.message}` : error.message;
    }

    return String(error);
  }

  async put(
    key: string,
    filePath: string,
    mimeType: string,
  ): Promise<{ url: string; buffer: Buffer }> {
    try {
      // 1. Make sure bucket exists
      await this.ensureBucket();

      // 2. Read temporary file
      const fileBuffer = await fs.promises.readFile(filePath);

      // 3. Upload file to MinIO
      await this.client.putObject(
        this.bucket,
        key,
        fileBuffer,
        fileBuffer.length,
        {
          "Content-Type": mimeType,
        },
      );

      this.logger.info("File uploaded to MinIO", {
        bucket: this.bucket,
        key,
      });

      // 4. Delete temporary file
      await this.deleteTempFile(filePath);

      // 5. Return MinIO URL and buffer
      return {
        url: `${this.endpoint}/${this.bucket}/${key}`,
        buffer: fileBuffer,
      };
    } catch (error) {
      // Upload failed, but we still
      // need to remove the temporary file.
      await this.deleteTempFile(filePath);

      this.logger.error("Failed to upload file to MinIO", {
        filePath,
        key,
        error: StorageService.formatError(error),
      });

      throw new ApiError(
        FILE_ERRORS.UPLOAD_FAILED,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async get(key: string): Promise<{
    buffer: Buffer;
    mimeType: string;
  }> {
    const stat = await this.client.statObject(this.bucket, key);

    const stream = await this.client.getObject(this.bucket, key);

    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return {
      buffer: Buffer.concat(chunks),
      mimeType:
        stat.metaData["content-type"] ||
        stat.metaData["Content-Type"] ||
        "application/octet-stream",
    };
  }

  private async ensureBucket(): Promise<void> {
    const bucketExists = await this.client.bucketExists(this.bucket);

    if (!bucketExists) {
      await this.client.makeBucket(this.bucket);

      this.logger.info(`Bucket ${this.bucket} created`);
    }
  }

  private async deleteTempFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);

      this.logger.info("Temporary file deleted", {
        filePath,
      });
    } catch (error: any) {
      // If file doesn't exist, don't treat it
      // as a serious failure.
      if (error?.code === "ENOENT") {
        return;
      }

      this.logger.error("Failed to delete temporary file", {
        filePath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}