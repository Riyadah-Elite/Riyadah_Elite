import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Versioned health check route
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "riyadah-elite-server",
  });
});

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
