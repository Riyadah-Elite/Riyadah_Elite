/**
 * @author aliasgarbootwala3@gmial.com
 */
import multer from "multer";
import path from "path";
import fs from "fs";
import { multerConfig } from "../config/multer.js";

const tempDirectory = path.resolve("./public/temp");

if (!fs.existsSync(tempDirectory)) {
  fs.mkdirSync(tempDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, fileName);
  },
});

export const MulterMiddleware = {
  upload: multer({
    storage,
    ...multerConfig,
  }),
};
