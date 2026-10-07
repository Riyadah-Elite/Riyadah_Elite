import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import { StorageService } from "./services/storage.service.js";
import { CacheService } from "./services/cache.service.js";
import { QueueService } from "./services/queue.service.js";
import { DatabaseService } from "./services/database.service.js";
import { generateAuthToken } from "./lib/security.js";
import { prisma } from "./lib/prisma.js";

describe("Infrastructure Layer Services & Integration", () => {
  const testUser = {
    userId: "usr-infra-tester-1",
    email: "infra.tester@riyadahelite.com",
    username: "infratester",
    role: "PLAYER",
  };
  const token = generateAuthToken(testUser);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("StorageService (MinIO / S3 Abstraction)", () => {
    it("generates structured, safe storage keys scoped by category and user", () => {
      const storage = new StorageService();
      const key = storage.generateStorageKey("evidence", "Screen_Shot #1!.png", "user-123");

      expect(key).toMatch(/^evidence\/user-user-123\/\d+-[a-z0-9]+-screen_shot__1_.png$/);
    });

    it("generates presigned upload URL with fallback and correct parameters", async () => {
      const storage = new StorageService({
        endpoint: "http://localhost:9000",
        bucket: "test-bucket",
      });

      const res = await storage.getPresignedUploadUrl("evidence/test.png", "image/png", 600);
      expect(res.storageKey).toBe("evidence/test.png");
      expect(res.expiresInSeconds).toBe(600);
      expect(res.uploadUrl).toBeDefined();
      expect(res.publicUrl).toContain("test-bucket/evidence/test.png");
    });

    it("supports file deletion safely with fallback", async () => {
      const storage = new StorageService();
      const result = await storage.deleteFile("evidence/old.png");
      expect(result).toBe(true);
    });

    it("reports DISABLED status when credentials are not injected", async () => {
      const storage = new StorageService();
      const health = await storage.checkHealth();
      expect(health.status).toBe("DISABLED");
    });
  });

  describe("CacheService (Redis Abstraction)", () => {
    it("reports DISABLED status cleanly when Redis is not running or configured", async () => {
      const cache = new CacheService();
      const health = await cache.checkHealth();
      expect(health.status).toBe("DISABLED");
    });

    it("handles get, set, del gracefully in fallback mode without crashing", async () => {
      const cache = new CacheService();

      const getRes = await cache.get("any:key");
      expect(getRes).toBeNull();

      const setRes = await cache.set("any:key", { test: true }, 60);
      expect(setRes).toBe(false);

      const delRes = await cache.del("any:key");
      expect(delRes).toBe(false);

      const invRes = await cache.invalidatePrefix("any");
      expect(invRes).toBe(false);
    });
  });

  describe("QueueService (RabbitMQ Abstraction)", () => {
    it("reports DISABLED status cleanly when RabbitMQ is not configured", async () => {
      const queue = new QueueService();
      const health = await queue.checkHealth();
      expect(health.status).toBe("DISABLED");
    });

    it("publishes jobs in fallback mode without losing application availability", async () => {
      const queue = new QueueService();
      const published = await queue.publish("email_queue", "USER_WELCOME_TEST", { email: "test@riyadahelite.com" });
      expect(published).toBe(true);
    });
  });

  describe("DatabaseService (Neon / Prisma Abstraction)", () => {
    it("wraps Prisma client cleanly", () => {
      expect(DatabaseService.client).toBeDefined();
    });

    it("returns database health status", async () => {
      // In CI / test environment where mock or real DB runs
      const health = await DatabaseService.checkHealth();
      expect(["HEALTHY", "UNHEALTHY"]).toContain(health.status);
    });
  });

  describe("Media & Presigned Upload REST API Integration", () => {
    it("generates presigned upload URL for authenticated player", async () => {
      const res = await request(app)
        .post("/api/v1/player/media/presigned-url")
        .set("Authorization", `Bearer ${token}`)
        .send({
          filename: "game_crash_evidence.png",
          category: "evidence",
          mimeType: "image/png",
          size: 1024000,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.data).toHaveProperty("uploadUrl");
      expect(res.body.data).toHaveProperty("storageKey");
      expect(res.body.data.storageKey).toContain("evidence/");
      expect(res.body.data).toHaveProperty("publicUrl");
      expect(res.body.data.expiresInSeconds).toBe(900);
    });

    it("rejects unauthorized presigned URL generation request", async () => {
      const res = await request(app)
        .post("/api/v1/player/media/presigned-url")
        .send({
          filename: "game_crash_evidence.png",
          category: "evidence",
          mimeType: "image/png",
          size: 1024000,
        });

      expect(res.status).toBe(401);
    });

    it("validates disallowed MIME types (e.g., .exe, .sh binaries)", async () => {
      const res = await request(app)
        .post("/api/v1/player/media/presigned-url")
        .set("Authorization", `Bearer ${token}`)
        .send({
          filename: "malicious_script.exe",
          category: "evidence",
          mimeType: "application/x-msdownload",
          size: 1024,
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Invalid presigned URL request");
    });

    it("enforces media ownership when deleting file", async () => {
      vi.spyOn(prisma.fileMedia, "findUnique").mockResolvedValue({
        id: "file-not-mine",
        userId: "different-user-999",
        filename: "secret.png",
        storageKey: "evidence/secret.png",
        url: "https://storage.riyadahelite.com/evidence/secret.png",
        mimeType: "image/png",
        size: 1024,
        fileType: "EVIDENCE",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const res = await request(app)
        .delete("/api/v1/player/media/file-not-mine")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("Forbidden: You do not own this file");
    });

    it("allows owner to delete file and removes both metadata and object storage", async () => {
      vi.spyOn(prisma.fileMedia, "findUnique").mockResolvedValue({
        id: "file-mine",
        userId: testUser.userId,
        filename: "my_evidence.png",
        storageKey: "evidence/my_evidence.png",
        url: "https://storage.riyadahelite.com/evidence/my_evidence.png",
        mimeType: "image/png",
        size: 1024,
        fileType: "EVIDENCE",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      vi.spyOn(prisma.fileMedia, "delete").mockResolvedValue({} as any);

      const res = await request(app)
        .delete("/api/v1/player/media/file-mine")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.message).toContain("deleted successfully");
    });
  });

  describe("Comprehensive Infrastructure Health Endpoint", () => {
    it("reports diagnostics for database, storage, cache, and queue", async () => {
      const res = await request(app).get("/api/v1/health");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("infrastructure");
      expect(res.body.infrastructure).toHaveProperty("database");
      expect(res.body.infrastructure).toHaveProperty("storage");
      expect(res.body.infrastructure).toHaveProperty("cache");
      expect(res.body.infrastructure).toHaveProperty("queue");
    });
  });
});
