/**
 * @author aliasgarbootwala3@gmial.com
 */
import { Request } from "express";
import { FileFilterCallback } from "multer";
import ApiError from "../utils/apiError.js";
import { STATUS_CODE } from "../constants/constants.js";
import { FILE_ERRORS } from "../constants/error.js";
import { Extensions, allowedMimeTypes } from "../constants/multerFile.js";

export const multerConfig = {
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    try {
      const extension = file.originalname
        .toLowerCase()
        .substring(file.originalname.lastIndexOf("."));

      const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);

      const isExtensionAllowed = Extensions.includes(extension);

      if (!isMimeTypeAllowed || !isExtensionAllowed) {
        return cb(
          new ApiError(
            FILE_ERRORS.INVALID_TYPE,
            STATUS_CODE.BAD_REQUEST,
          ),
        );
      }

      return cb(null, true);
    } catch (error) {
      return cb(
        error instanceof Error
          ? error
          : new ApiError(
              FILE_ERRORS.VALIDATION_FAILED,
              STATUS_CODE.INTERNAL_SERVER_ERROR,
            ),
      );
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
