import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  verifyAuthToken,
  generateResetToken,
  hashResetToken,
} from "./lib/security.js";

describe("Security Utilities", () => {
  it("hashes password with salt and successfully verifies match", async () => {
    const rawPassword = "StrongPassword@2026#";
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    expect(hashed.length).toBeGreaterThan(20);

    const isMatch = await verifyPassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword123!", hashed);
    expect(isWrongMatch).toBe(false);
  });

  it("generates and verifies JWT auth tokens", () => {
    const payload = {
      userId: "test-user-uuid-1234",
      email: "player@riyadahelite.com",
      username: "player_one",
      role: "PLAYER",
    };

    const token = generateAuthToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyAuthToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.username).toBe(payload.username);

    const invalidDecoded = verifyAuthToken("invalid.token.signature");
    expect(invalidDecoded).toBeNull();
  });

  it("generates cryptographic reset tokens and matches SHA-256 hashes", () => {
    const { rawToken, tokenHash } = generateResetToken();
    expect(rawToken.length).toBe(64); // 32 bytes hex
    expect(tokenHash.length).toBe(64); // sha256 hex

    const computedHash = hashResetToken(rawToken);
    expect(computedHash).toBe(tokenHash);
  });
});

describe("Authentication Routes Validation & Error Handling", () => {
  it("rejects signup with missing or invalid fields", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        fullName: "",
        username: "bad username with spaces!",
        email: "not-an-email",
        password: "weak",
        confirmPassword: "different",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.errors).toBeDefined();
  });

  it("rejects login with invalid email format", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "invalid-email-format",
        password: "somePassword123",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("rejects access to /api/v1/auth/me without authorization token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Authentication required");
  });

  it("rejects access to /api/v1/auth/me with invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-jwt-token");

    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Invalid or expired session token");
  });

  it("handles forgot password validation safely", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "invalid-format" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("rejects reset password with mismatched passwords", async () => {
    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({
        token: "some-raw-token-1234",
        password: "NewPassword@2026#",
        confirmPassword: "MismatchedPassword@2026#",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });
});
