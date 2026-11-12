/**
 * @author aliasgarbootwala3@gmial.com
 */

import "./config/config.js";
import express, { Request, Response } from "express";
import "reflect-metadata";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./config/container.js";
import "./controllers/index.js";
import { TYPES } from "./config/types.js";
import { IDatabase } from "./types/database.types.js";
import { requestContextMiddleware } from "./middlewares/requestContext.middleware.js";
import cors from "cors";
import type { Application } from "express";

const server = new InversifyExpressServer(container);

const db = container.get<IDatabase>(TYPES.Database);

try {
  await db.connect();
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}

server.setConfig((app: Application ) => {
  /*
   * First, so every later log line — including the body parsers and
   * morgan — carries the request id.
   */
  app.use(requestContextMiddleware);

  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.static("public"));

  /*
   * `credentials: true` and a wildcard origin are mutually exclusive in the
   * browser: the response must echo the caller's origin for cookies to be
   * accepted. A literal "*" therefore means "reflect the origin"; a
   * comma-separated list narrows it for production.
   */
  const configuredOrigin = process.env.CORS_ORIGIN?.trim() || "*";
  const allowedOrigins =
    configuredOrigin === "*"
      ? true
      : configuredOrigin.split(",").map((origin) => origin.trim());

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
});

const app = server.build();

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.send("OK");
});

export default app;
