import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET must be configured in production environment.");
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Riyadah Elite Server running on port ${PORT}`);
});

const handleShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await prisma.$disconnect();
      console.log("Database connection disconnected.");
    } catch (err) {
      console.error("Error disconnecting from database:", err);
    }
    process.exit(0);
  });
};

process.on("SIGTERM", () => void handleShutdown("SIGTERM"));
process.on("SIGINT", () => void handleShutdown("SIGINT"));
