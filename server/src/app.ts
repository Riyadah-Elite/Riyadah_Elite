import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { playerRouter } from "./routes/player.routes.js";
import { tournamentRouter } from "./routes/tournament.routes.js";
import { developerRouter } from "./routes/developer.routes.js";
import { hostRouter } from "./routes/host.routes.js";
import { adminRouter } from "./routes/admin.routes.js";

import { databaseService } from "./services/database.service.js";
import { storageService } from "./services/storage.service.js";
import { cacheService } from "./services/cache.service.js";
import { queueService } from "./services/queue.service.js";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Versioned health & readiness check route
app.get("/api/v1/health", async (_req: Request, res: Response) => {
  const [dbHealth, storageHealth, cacheHealth, queueHealth] = await Promise.all([
    databaseService.checkHealth(),
    storageService.checkHealth(),
    cacheService.checkHealth(),
    queueService.checkHealth(),
  ]);

  // In test or environments without DATABASE_URL configured, report status as ok for basic liveness
  const isCoreHealthy = dbHealth.status === "HEALTHY" || !process.env.DATABASE_URL;
  const statusCode = isCoreHealthy ? 200 : 503;

  res.status(statusCode).json({
    status: isCoreHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "riyadah-elite-server",
    infrastructure: {
      database: dbHealth,
      storage: storageHealth,
      cache: cacheHealth,
      queue: queueHealth,
    },
  });
});



// Authentication endpoints
app.use("/api/v1/auth", authRouter);

// Player workspace and opportunities endpoints
app.use("/api/v1/player", playerRouter);

// Tournament discovery, details, and registration endpoints
app.use("/api/v1/tournaments", tournamentRouter);

// Developer workspace endpoints (Phase 3B)
app.use("/api/v1/developer", developerRouter);

// Tournament Host workspace endpoints (Phase 4B)
app.use("/api/v1/host", hostRouter);

// Internal Admin Workspace endpoints (Phase 5B)
app.use("/api/v1/admin", adminRouter);

// Centralized 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
  });
});

// Centralized error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    status: "error",
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});
