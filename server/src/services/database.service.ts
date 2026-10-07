import { prisma } from "../lib/prisma.js";

export class DatabaseService {
  public static get client() {
    return prisma;
  }

  public static async checkHealth(): Promise<{ status: "HEALTHY" | "UNHEALTHY"; latencyMs?: number; message?: string }> {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: "HEALTHY",
        latencyMs: Date.now() - start,
      };
    } catch (err: any) {
      return {
        status: "UNHEALTHY",
        latencyMs: Date.now() - start,
        message: err.message || "Database connection query failed",
      };
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      await prisma.$disconnect();
    } catch (err) {
      console.error("[DATABASE] Error disconnecting Prisma client:", err);
    }
  }
}

export const databaseService = DatabaseService;
