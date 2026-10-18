/**
 * @author aliasgarbootwala3@gmial.com
 */
import { Request } from "express";
import { FileFilterCallback } from "multer";
import ApiError from "../utils/apiError.js";
import { STATUS_CODE } from "../constants/constants.js";
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
            "Only JPEG and PNG files are allowed",
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
              "Error while validating uploaded file",
              STATUS_CODE.INTERNAL_SERVER_ERROR,
            ),
      );
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
