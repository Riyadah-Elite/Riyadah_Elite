/**
 * @author aliasgarbootwala3@gmial.com
 */

import type { NextFunction, Request, Response } from "express";
import { ALL_USER_ROLES, STATUS_CODE } from "../constants/constants.js";
import type { UserRole } from "../constants/constants.js";
import container from "../config/container.js";
import { TYPES } from "../config/types.js";
import type AuthRepository from "../repositories/auth.repository.js";
import { setRequestUserId } from "../utils/requestContext.js";
import { verifyToken } from "../utils/token.js";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    role: UserRole;
  };
};

export const authMiddleware = (
  roles: UserRole | readonly UserRole[] = ALL_USER_ROLES,
) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : req.cookies?.token;

    if (!token) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ message: "Authentication required" });
    }

    let decoded;

    try {
      decoded = verifyToken(token);
    } catch {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    try {
      const authRepository = container.get<AuthRepository>(TYPES.AuthRepository);
      const [user, blacklistedToken] = await Promise.all([
        authRepository.findUserForAuthorization(decoded.userId),
        authRepository.isTokenBlacklisted(token),
      ]);

      if (!user) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "Invalid token" });
      }

      if (user.isDeleted) {
        return res
          .status(STATUS_CODE.FORBIDDEN)
          .json({ message: "This account has been deleted" });
      }

      if (
        blacklistedToken ||
        user.tokenVersion !== decoded.tokenVersion ||
        user.role !== decoded.userRole
      ) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "Invalid token" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res
          .status(STATUS_CODE.FORBIDDEN)
          .json({ message: "You are not allowed to access this resource" });
      }

      req.user = { userId: user.id, role: user.role };
      setRequestUserId(user.id);
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
