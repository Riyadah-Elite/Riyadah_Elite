/**
 * @author aliasgarbootwala3@gmial.com
 */

import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../config/types.js";
import { ALL_USER_ROLES, STATUS_CODE } from "../constants/constants.js";
import { FILE_ERRORS } from "../constants/error.js";
import BaseController from "./base.controller.js";
import FileService from "../services/file.service.js";
import Logger from "../utils/logger.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { MulterMiddleware } from "../middlewares/multer.middleware.js";
import {
  fileIdParamsSchema,
  uploadFileSchema,
} from "../validators/file.validator.js";
import { validateOrThrow } from "../validators/validate.js";

@controller("/api/v1/file")
export default class FileController extends BaseController {
  @inject(TYPES.FileService)
  fileService!: FileService;

  @inject(TYPES.Logger)
  logger!: Logger;

  /** POST /api/v1/file - upload an image and store it in the File model. */
  @httpPost(
    "/",
    authMiddleware(ALL_USER_ROLES),
    MulterMiddleware.upload.single("image"),
  )
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return this.error(res, FILE_ERRORS.REQUIRED, STATUS_CODE.BAD_REQUEST);
      }

      const { description } = validateOrThrow(uploadFileSchema, req.body);

      const file = await this.fileService.upload({
        userId: req.user!.userId,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
        description,
      });

      return this.success(res, { file }, STATUS_CODE.CREATED);
    } catch (error) {
      this.logger.error(
        "file upload: request failed",
        error instanceof Error
          ? { error: error.message, stack: error.stack }
          : { error: String(error) },
      );
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/file/:fileId - file metadata, including the data URL. */
  @httpGet("/:fileId", authMiddleware(ALL_USER_ROLES))
  async get(req: Request, res: Response) {
    try {
      const { fileId } = validateOrThrow(fileIdParamsSchema, req.params);

      const file = await this.fileService.getById(fileId);

      return this.success(res, { file }, STATUS_CODE.OK);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  /** GET /api/v1/file/:fileId/raw - stream the image bytes. */
  @httpGet("/:fileId/raw", authMiddleware(ALL_USER_ROLES))
  async raw(req: Request, res: Response) {
    try {
      const { fileId } = validateOrThrow(fileIdParamsSchema, req.params);

      const { buffer, mimeType } = await this.fileService.getContent(fileId);

      res.setHeader("Content-Type", mimeType);
      res.setHeader("Cache-Control", "private, max-age=3600");

      return res.status(STATUS_CODE.OK).send(buffer);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
  
}
