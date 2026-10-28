/**
 * @author aliasgarbootwala3@gmial.com
 */

import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/token.js";
import {
  RegisterUserInput,
  LoginUserInput,
  LogoutUserInput,
  ProfileUserInput,
  PublicUser,
  PaginatedUsers,
  UpdateUserDetailsInput,
  UserListQuery,
  UserProfile,
  UserRole,
  TestingStatus,
  TournamentStatus,
} from "../types/user.types.js";
import Logger from "../utils/logger.js";
import AuthRepository from "../repositories/auth.repository.js";
import { STATUS_CODE, USER_ROLE } from "../constants/constants.js";
import { AUTH_ERRORS, USER_ERRORS } from "../constants/error.js";
import ApiError from "../utils/apiError.js";
import StorageService from "../utils/storage.js";
import { notifySystem } from "../utils/notification.js";
import { NOTIFICATION_MESSAGES } from "../constants/notification.js";
import { rankForPoints } from "../utils/rank.js";
import UserProgressService from "./userprogress.service.js";
import NotificationService from "./notification.service.js";
import path from "path";

@injectable()
export default class AuthService {
  @inject(TYPES.AuthRepository)
  authRepository!: AuthRepository;

  @inject(TYPES.StorageService)
  storageService!: StorageService;

  @inject(TYPES.UserProgressService)
  userProgressService!: UserProgressService;

  @inject(TYPES.NotificationService)
  notificationService!: NotificationService;

  @inject(TYPES.Logger)
  logger!: Logger;

  @inject(TYPES.ApiError)
  apiError!: ApiError;

  async register(userData: RegisterUserInput) {
    this.logger.info("Registering user:", { email: userData.email });

    const existingUser = await this.authRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.warn("Registration rejected: email already registered", {
        email: userData.email,
      });

      throw new ApiError(USER_ERRORS.EMAIL_ALREADY_EXISTS, STATUS_CODE.CONFLICT);
    }
    
    const extension = path.extname(userData.avatarPath);
    const avatarKey = `avatra/${Date.now()}-${userData.username.toLocaleLowerCase().replace(/\s+/g, "-")}${extension}`;

    /*
     * The avatar object is still stored in MinIO, but the DB keeps a base64
     * data URL so the frontend can render it directly without a second fetch
     * from object storage.
     */
    const { buffer } = await this.storageService.put(
      avatarKey,
      userData.avatarPath,
      userData.avatarMimeType,
    );

    const imageUrl = `data:${userData.avatarMimeType};base64,${buffer.toString("base64")}`;

    const avatarUrl = imageUrl;

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.authRepository.createUser(
      {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role ?? USER_ROLE.USER,
      },
      { imageUrl: avatarUrl },
    );

    const checknewUser = await this.authRepository.findUserById(user.id);

    if (!checknewUser) {
      this.logger.error("User was written but could not be read back", {
        userId: user.id,
      });

      throw new ApiError(
        USER_ERRORS.REGISTRATION_FAILED,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.info("User registered", { userId: user.id });

    await notifySystem(user.id, NOTIFICATION_MESSAGES.WELCOME);

    const token = generateToken({
      userId: user.id,
      userRole: user.role,
      tokenVersion: user.tokenVersion,
    });

    return { user: checknewUser, token };
  }

  async login(userData: LoginUserInput) {
    
    this.logger.info("login try ", { email: userData.email });
    
    const user = await this.authRepository.findByEmail(userData.email);

    if (!user) {
      this.logger.warn("Login rejected: no account for that email", {
        userEmail: userData.email,
      });

      throw new ApiError(USER_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (user.isDeleted) {
      this.logger.warn("Login rejected: account has been deleted", {
        userId: user.id,
      });

      throw new ApiError(
        USER_ERRORS.ACCOUNT_DELETED,
        STATUS_CODE.FORBIDDEN,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn("Login rejected: wrong password", {
        userId: user.id,
      });

      throw new ApiError(AUTH_ERRORS.INVALID_PASSWORD, STATUS_CODE.UNAUTHORIZED);
    }

    const token = generateToken({
      userId: user.id,
      userRole: user.role,
      tokenVersion: user.tokenVersion,
    });

    /* findByEmail opts back into `password`; the response must not. */
    const { password, ...safeUser } = user;

    return { user: safeUser, token };
  }

  async profile(UserData: ProfileUserInput) {
    this.logger.info("requesting profile", { userId: UserData.userId });

    const isValid = await this.authRepository.isTokenBlacklisted(
      UserData.token,
    );

    if (isValid) {
      this.logger.warn("Profile rejected: token is blacklisted", {
        userId: UserData.userId,
      });

      throw new ApiError(AUTH_ERRORS.TOKEN_INVALID, STATUS_CODE.UNAUTHORIZED);
    }

    await this.userProgressService.syncStatuses(UserData.userId);
    await this.userProgressService.ensureRank(UserData.userId);

    const user = await this.authRepository.findUserById(UserData.userId);

    if (!user) {
      this.logger.warn("Profile rejected: user no longer exists", {
        userId: UserData.userId,
      });

      throw new ApiError(USER_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return { user: this.toProfile(user) };
  }

  async logout(token: LogoutUserInput) {
    this.logger.info("logout try for");

    const isBlacklisted = await this.authRepository.isTokenBlacklisted(
      token.token,
    );

    if (isBlacklisted) {
      this.logger.warn("Logout rejected: token is already blacklisted");

      throw new ApiError(
        AUTH_ERRORS.TOKEN_ALREADY_BLACKLISTED,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    /*
     * Re-verify rather than trusting the caller, and read `exp` off the token
     * so blacklisted rows can be swept once they expire.
     */
    const { exp, userId } = verifyToken(token.token);

    const result = await this.authRepository.createToken(
      token.token,
      userId,
      new Date(exp * 1000),
    );

    return result;
  }

  /**
   * Paginated users.
   *
   * `skip`/`take` arrive already computed from the validated page and limit,
   * so the service never does arithmetic on a raw query string.
   */
  async listUsers(query: UserListQuery): Promise<PaginatedUsers> {
    this.logger.info("listing users", {
      page: query.page,
      limit: query.limit,
    });

    const { users, total } = await this.authRepository.listUsers(query);

    const totalPages = Math.ceil(total / query.limit);

    return {
      users: users.map((user) => this.toPublicUser(user)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  // ===========================================================================
  // USER MUTATION
  // ===========================================================================

  /**
   * Update another user's details.
   *
   * Two rules live here rather than in the controller or the repository:
   * a caller may only touch their own account unless they are an ADMIN, and
   * only an ADMIN may change a role. The repository has no idea who is calling.
   */
  async updateUserDetails(
    requesterId: string,
    input: UpdateUserDetailsInput,
  ): Promise<UserProfile> {
    this.logger.info("updating user details", { userId: input.userId });

    await this.assertExists(input.userId);

    const requester = await this.assertExists(requesterId);

    const isAdmin = requester.role === USER_ROLE.ADMIN;

    if (requesterId !== input.userId && !isAdmin) {
      throw new ApiError(
        USER_ERRORS.UPDATE_FORBIDDEN,
        STATUS_CODE.FORBIDDEN,
      );
    }

    if (input.role && !isAdmin) {
      throw new ApiError(
        USER_ERRORS.ROLE_CHANGE_FORBIDDEN,
        STATUS_CODE.FORBIDDEN,
      );
    }

    /* A user may not hand themselves a role through their own profile. */
    const { userId, isNotificationAllowed, ...changes } = input;

    if (input.username) {
      const taken = await this.authRepository.findByUsername(input.username);

      if (taken && taken.id !== input.userId) {
        throw new ApiError(USER_ERRORS.USERNAME_ALREADY_EXISTS, STATUS_CODE.CONFLICT);
      }
    }

    if (isNotificationAllowed !== undefined) {
      await this.notificationService.setNotificationAllowed(
        input.userId,
        isNotificationAllowed,
      );
    }

    const updated =
      Object.keys(changes).length > 0
        ? await this.authRepository.updateUser(input.userId, changes)
        : await this.assertExists(input.userId);

    this.logger.info("user details updated", { userId: input.userId });

    return this.toProfile(updated);
  }

  /** Soft-deletes the account and invalidates all access tokens. */
  async deleteUser(requesterId: string, userId: string): Promise<void> {
    this.logger.info("deleting user", { userId });

    const target = await this.authRepository.findUserByIdIncludingDeleted(userId);

    if (!target) {
      throw new ApiError(USER_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (target.isDeleted && requesterId === userId) {
      return;
    }

    /* Deleting yourself: the row already in hand is also the requester. */
    const requester =
      requesterId === userId ? target : await this.assertExists(requesterId);

    const isAdmin = requester.role === USER_ROLE.ADMIN;

    if (requesterId !== userId && !isAdmin) {
      throw new ApiError(
        USER_ERRORS.DELETE_FORBIDDEN,
        STATUS_CODE.FORBIDDEN,
      );
    }

    if (target.isDeleted) {
      return;
    }

    await this.authRepository.softDeleteUser(userId);

    await notifySystem(userId, NOTIFICATION_MESSAGES.ACCOUNT_DELETED);

    this.logger.info("user deleted", { userId });
  }

  async restoreUser(requesterId: string, userId: string): Promise<UserProfile> {
    const requester = await this.assertExists(requesterId);

    if (requester.role !== USER_ROLE.ADMIN) {
      throw new ApiError(
        USER_ERRORS.RESTORE_FORBIDDEN,
        STATUS_CODE.FORBIDDEN,
      );
    }

    const target = await this.authRepository.findUserByIdIncludingDeleted(userId);

    if (!target) {
      throw new ApiError(USER_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (target.isDeleted) {
      await this.authRepository.restoreUser(userId);
      await notifySystem(userId, NOTIFICATION_MESSAGES.ACCOUNT_RESTORED);
    }

    const restored = await this.assertExists(userId);
    this.logger.info("user restored", { userId, requesterId });

    return this.toProfile(restored);
  }

  private async assertExists(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(USER_ERRORS.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return user;
  }

  /** Flattens the avatar relation into a single URL the API can return. */
  private toPublicUser(user: {
    id: string;
    username: string;
    role: UserRole;
    createdAt: Date;
    avatar: { imageUrl: string | null } | null;
  }): PublicUser {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      avatarUrl: user.avatar?.imageUrl ?? null,
      createdAt: user.createdAt,
    };
  }

  /** The signed-in user's profile shape, shared by profile reads and updates. */
  private toProfile(user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    isNotificationAllowed: boolean;
    testingStatus: TestingStatus | null;
    testingPoints: number | null;
    testingRank: string | null;
    tournamentStatus: TournamentStatus | null;
    exitReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    avatar: { imageUrl: string | null } | null;
  }): UserProfile {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar?.imageUrl ?? null,
      isNotificationAllowed: user.isNotificationAllowed,
      testingStatus: user.testingStatus,
      testingPoints: user.testingPoints,
      testingRank: user.testingRank ?? rankForPoints(user.testingPoints),
      tournamentStatus: user.tournamentStatus,
      exitReason: user.exitReason,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
}
