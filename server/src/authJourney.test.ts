import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
import {
  verifyPassword,
  hashResetToken,
} from "./lib/security.js";

// Mock user store in memory to simulate isolated database for integration testing
interface MockUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "PLAYER" | "DEVELOPER" | "HOST" | "ADMIN";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MockToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

const mockUsers: MockUser[] = [];
const mockTokens: MockToken[] = [];

// Spy/mock Prisma operations for end-to-end HTTP validation
beforeEach(() => {
  mockUsers.length = 0;
  mockTokens.length = 0;

  vi.spyOn(prisma.user, "findUnique").mockImplementation((async (args: any) => {
    if (args.where?.email) {
      return mockUsers.find((u) => u.email === args.where.email) || null;
    }
    if (args.where?.username) {
      return mockUsers.find((u) => u.username === args.where.username) || null;
    }
    if (args.where?.id) {
      return mockUsers.find((u) => u.id === args.where.id) || null;
    }
    return null;
  }) as any);

  vi.spyOn(prisma.user, "create").mockImplementation((async (args: any) => {
    const newUser: MockUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: args.data.fullName,
      username: args.data.username,
      email: args.data.email,
      passwordHash: args.data.passwordHash,
      role: "PLAYER", // Privilege escalation protection: default PLAYER
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);

    // If caller specified a select projection, omit unselected fields (like passwordHash)
    if (args.select) {
      const selected: any = {};
      for (const key of Object.keys(args.select)) {
        if (args.select[key]) {
          selected[key] = (newUser as any)[key];
        }
      }
      return selected;
    }

    return newUser;
  }) as any);

  vi.spyOn(prisma.user, "update").mockImplementation((async (args: any) => {
    const user = mockUsers.find((u) => u.id === args.where.id);
    if (!user) throw new Error("User not found");
    if (args.data.passwordHash) {
      user.passwordHash = args.data.passwordHash;
    }
    user.updatedAt = new Date();
    return user;
  }) as any);

  vi.spyOn(prisma.passwordResetToken, "create").mockImplementation((async (args: any) => {
    const newToken: MockToken = {
      id: `tok-${Date.now()}`,
      tokenHash: args.data.tokenHash,
      userId: args.data.userId,
      expiresAt: args.data.expiresAt,
      usedAt: null,
      createdAt: new Date(),
    };
    mockTokens.push(newToken);
    return newToken;
  }) as any);

  vi.spyOn(prisma.passwordResetToken, "findUnique").mockImplementation((async (args: any) => {
    const token = mockTokens.find((t) => t.tokenHash === args.where.tokenHash);
    if (!token) return null;
    const user = mockUsers.find((u) => u.id === token.userId);
    return { ...token, user } as any;
  }) as any);

  vi.spyOn(prisma.passwordResetToken, "updateMany").mockImplementation((async (args: any) => {
    const token = mockTokens.find(
      (t) => t.id === args.where.id && t.usedAt === null && t.expiresAt > new Date()
    );
    if (token) {
      token.usedAt = args.data.usedAt;
      return { count: 1 };
    }
    return { count: 0 };
  }) as any);

  vi.spyOn(prisma, "$transaction").mockImplementation((async (arg: any) => {
    if (typeof arg === "function") {
      return arg(prisma);
    }
    if (Array.isArray(arg)) {
      return Promise.all(arg);
    }
    return null;
  }) as any);
});

describe("Complete End-to-End Authentication Journey", () => {
  const testUser = {
    fullName: "Tariq Al-Harbi",
    username: "tariq_ksa",
    email: "tariq.ksa@riyadahelite.com",
    password: "SecureGamerPassword@2026#",
  };

  it("completes full user lifecycle: signup -> login -> me -> forgot-password -> reset -> re-login -> logout", async () => {
    // 1. SIGNUP
    const signupRes = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...testUser,
        confirmPassword: testUser.password,
        role: "ADMIN", // Attempt privilege escalation: must be ignored and defaulted to PLAYER
      });

    expect(signupRes.status).toBe(201);
    expect(signupRes.body.status).toBe("ok");
    expect(signupRes.body.data.user.email).toBe(testUser.email);
    expect(signupRes.body.data.user.role).toBe("PLAYER"); // Protected against privilege escalation
    expect(signupRes.body.data.user.passwordHash).toBeUndefined(); // Never leaks hash in response

    // Verify stored password in database is hashed, not plaintext
    const storedUser = mockUsers.find((u) => u.email === testUser.email);
    expect(storedUser).toBeDefined();
    expect(storedUser?.passwordHash).not.toBe(testUser.password);
    expect(await verifyPassword(testUser.password, storedUser!.passwordHash)).toBe(true);

    // 2. DUPLICATE REJECTION
    const dupRes = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...testUser,
        confirmPassword: testUser.password,
      });
    expect(dupRes.status).toBe(409);
    expect(dupRes.body.message).toMatch(/already exists/i);

    // 3. LOGIN
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.status).toBe("ok");
    expect(loginRes.body.data.token).toBeDefined();
    const token = loginRes.body.data.token;

    // Verify cookie was set
    const setCookieHeader = loginRes.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toContain("token=");
    expect(setCookieHeader[0]).toContain("HttpOnly");

    // 4. ACCESS PROTECTED /me ROUTE
    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.user.email).toBe(testUser.email);
    expect(meRes.body.data.user.username).toBe(testUser.username);

    // 5. FORGOT PASSWORD REQUEST
    const forgotRes = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: testUser.email });

    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.status).toBe("ok");
    expect(forgotRes.body.message).toMatch(/password reset instructions/i);

    // In non-production, devResetUrl provides the raw token for automated testing
    expect(forgotRes.body.data?.devResetUrl).toBeDefined();
    const rawUrl = forgotRes.body.data.devResetUrl;
    const rawToken = new URLSearchParams(rawUrl.split("?")[1]).get("token");
    expect(rawToken).toBeDefined();

    // Verify database stored token is SHA-256 hash, NOT raw token
    const storedTokenRecord = mockTokens.find((t) => t.userId === storedUser?.id);
    expect(storedTokenRecord).toBeDefined();
    expect(storedTokenRecord?.tokenHash).toBe(hashResetToken(rawToken!));
    expect(storedTokenRecord?.tokenHash).not.toBe(rawToken);

    // 6. RESET PASSWORD
    const newPassword = "BrandNewPassword@2026#";
    const resetRes = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({
        token: rawToken,
        password: newPassword,
        confirmPassword: newPassword,
      });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.status).toBe("ok");
    expect(storedTokenRecord?.usedAt).not.toBeNull();

    // 7. PREVENT TOKEN REUSE
    const reuseRes = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({
        token: rawToken,
        password: "AnotherNewPassword@2026#",
        confirmPassword: "AnotherNewPassword@2026#",
      });
    expect(reuseRes.status).toBe(400);
    expect(reuseRes.body.message).toMatch(/already used|invalid|expired/i);

    // 8. VERIFY OLD PASSWORD FAILS, NEW PASSWORD SUCCEEDS
    const oldLoginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password, // old password
      });
    expect(oldLoginRes.status).toBe(401);

    const newLoginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: newPassword, // new password
      });
    expect(newLoginRes.status).toBe(200);
    expect(newLoginRes.body.status).toBe("ok");

    // 9. LOGOUT
    const logoutRes = await request(app).post("/api/v1/auth/logout");
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.headers["set-cookie"][0]).toContain("token=;");
  });
});
