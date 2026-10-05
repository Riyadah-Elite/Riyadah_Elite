import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  generateResetToken,
  hashResetToken,
} from "../lib/security.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { authRateLimiter, forgotPasswordRateLimiter } from "../middleware/rateLimit.middleware.js";

export const authRouter = Router();

// POST /api/v1/auth/signup
authRouter.post("/signup", authRateLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { fullName, username, email, password } = parseResult.data;

    // Check existing email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      res.status(409).json({
        status: "error",
        message: "An account with this email address already exists",
      });
      return;
    }

    // Check existing username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      res.status(409).json({
        status: "error",
        message: "This username is already taken",
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const token = generateAuthToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "ok",
      message: "Account created successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/login
authRouter.post("/login", authRateLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    const token = generateAuthToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "ok",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me
authRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/logout
authRouter.post("/logout", (_req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({
    status: "ok",
    message: "Logged out successfully",
  });
});

// POST /api/v1/auth/forgot-password
authRouter.post("/forgot-password", forgotPasswordRateLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = forgotPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Invalid email address",
      });
      return;
    }

    const { email } = parseResult.data;

    // Safe response to avoid account enumeration
    const genericResponse = {
      status: "ok",
      message: "If an account exists with this email address, password reset instructions have been generated.",
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(200).json(genericResponse);
      return;
    }

    const { rawToken, tokenHash } = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    // In development without an external SMTP provider, return reset token for testing
    const devDetails =
      process.env.NODE_ENV !== "production"
        ? { devResetUrl: `/reset-password?token=${rawToken}` }
        : undefined;

    res.status(200).json({
      ...genericResponse,
      ...(devDetails && { data: devDetails }),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/reset-password
authRouter.post("/reset-password", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { token, password } = parseResult.data;
    const tokenHash = hashResetToken(token);

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      res.status(400).json({
        status: "error",
        message: "Invalid, expired, or already used password reset link",
      });
      return;
    }

    const newPasswordHash = await hashPassword(password);

    // Concurrency-safe atomic consumption:
    // Update token only if it hasn't been marked as used yet
    const updateResult = await prisma.$transaction(async (tx) => {
      const consumed = await tx.passwordResetToken.updateMany({
        where: {
          id: resetRecord.id,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { usedAt: new Date() },
      });

      if (consumed.count === 0) {
        throw new Error("TOKEN_ALREADY_CONSUMED");
      }

      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newPasswordHash },
      });

      return true;
    });

    if (!updateResult) {
      res.status(400).json({
        status: "error",
        message: "Password reset link has already been used or expired",
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      message: "Password changed successfully. You may now log in with your new credentials.",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "TOKEN_ALREADY_CONSUMED") {
      res.status(400).json({
        status: "error",
        message: "Password reset link has already been used",
      });
      return;
    }
    next(error);
  }
});

// POST /api/v1/auth/change-password (Authenticated password update for Settings)
authRouter.post(
  "/change-password",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          status: "error",
          message: "Current password and new password are required",
        });
        return;
      }

      if (typeof newPassword !== "string" || newPassword.length < 8) {
        res.status(400).json({
          status: "error",
          message: "New password must be at least 8 characters",
        });
        return;
      }

      const userId = req.user!.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      const isValid = await verifyPassword(currentPassword, user.passwordHash);
      if (!isValid) {
        res.status(400).json({
          status: "error",
          message: "Current password does not match our records",
        });
        return;
      }

      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      });

      res.status(200).json({
        status: "ok",
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);
