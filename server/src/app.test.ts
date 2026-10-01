import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./app.js";

describe("Health Check API", () => {
  it("GET /api/v1/health should return status ok", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("service", "riyadah-elite-server");
    expect(response.body).toHaveProperty("timestamp");
  });

  it("GET /api/v1/nonexistent should return 404", async () => {
    const response = await request(app).get("/api/v1/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", "error");
  });
});
