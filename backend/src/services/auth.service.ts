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
import ApiError from "../utils/apiError.js";
import StorageService from "../utils/storage.js";
import path from "path";

@injectable()
export default class AuthService {
  @inject(TYPES.AuthRepository)
  authRepository!: AuthRepository;

  @inject(TYPES.StorageService)
  storageService!: StorageService;

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

      throw new ApiError("User already exists", STATUS_CODE.CONFLICT);
    }
    
    const extension = path.extname(userData.avatarPath);
    const avatarKey = `avatra/${Date.now()}-${userData.username.toLocaleLowerCase().replace(/\s+/g, "-")}${extension}`;

    /*
     * The URL is what the File row stores. The old code read the object back
     * out of MinIO and kept a base64 data URI instead, but `imageUrl` is a URL
     * column - clients can fetch it directly from object storage.
     */
    const avatarUrl = await this.storageService.put(
      avatarKey,
      userData.avatarPath,
      userData.avatarMimeType,
    );

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
        "Something went wrong while registering",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.info("User registered", { userId: user.id });

    const token = generateToken({
      userId: user.id,
      userRole: user.role
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

      throw new ApiError("User not found", STATUS_CODE.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn("Login rejected: wrong password", {
        userId: user.id,
      });

      throw new ApiError("Invalid password", STATUS_CODE.UNAUTHORIZED);
    }

    const token = generateToken({
      userId: user.id,
      userRole: user.role
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

      throw new ApiError("token is not valid", STATUS_CODE.UNAUTHORIZED);
    }

    const user = await this.authRepository.findUserById(UserData.userId);

    if (!user) {
      this.logger.warn("Profile rejected: user no longer exists", {
        userId: UserData.userId,
      });

      throw new ApiError("User not found", STATUS_CODE.NOT_FOUND);
    }

    /*
     * Same shaping as GET /me, so profile cannot drift into returning a wider
     * row than the dedicated endpoint does.
     */
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
        "token is already blacklisted",
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
        "You are not allowed to update another user",
        STATUS_CODE.FORBIDDEN,
      );
    }

    if (input.role && !isAdmin) {
      throw new ApiError(
        "Only an admin can change a role",
        STATUS_CODE.FORBIDDEN,
      );
    }

    /* A user may not hand themselves a role through their own profile. */
    const { userId, ...changes } = input;

    if (input.username) {
      const taken = await this.authRepository.findByUsername(input.username);

      if (taken && taken.id !== input.userId) {
        throw new ApiError("Username is already taken", STATUS_CODE.CONFLICT);
      }
    }

    const updated = await this.authRepository.updateUser(input.userId, changes);

    this.logger.info("user details updated", { userId: input.userId });

    return this.toProfile(updated);
  }

  /**
   * Delete a user.
   *
   * Game listings, tournament listings and bug reports are *required*
   * relations, so Postgres refuses the delete while any exist. Rather than
   * silently cascading away other people's content, the conflict is reported
   * and the caller decides what to do with those records first.
   */
  async deleteUser(requesterId: string, userId: string): Promise<void> {
    this.logger.info("deleting user", { userId });

    const target = await this.assertExists(userId);

    /* Deleting yourself: the row already in hand is also the requester. */
    const requester =
      requesterId === userId ? target : await this.assertExists(requesterId);

    const isAdmin = requester.role === USER_ROLE.ADMIN;

    if (requesterId !== userId && !isAdmin) {
      throw new ApiError(
        "You are not allowed to delete another user",
        STATUS_CODE.FORBIDDEN,
      );
    }

    const blocking = await this.authRepository.countBlockingRecords(userId);

    if (
      blocking &&
      (blocking.gameListings > 0 ||
        blocking.tournamentListings > 0 ||
        blocking.bugReports > 0)
    ) {
      throw new ApiError(
        `User owns ${blocking.gameListings} game listing(s), ${blocking.tournamentListings} tournament listing(s) and ${blocking.bugReports} bug report(s). Remove or reassign them first.`,
        STATUS_CODE.CONFLICT,
      );
    }

    /* Any session still open on that account must stop working immediately. */
    await this.authRepository.deleteBlacklistedTokens(userId);

    await this.authRepository.deleteUser(userId);

    this.logger.info("user deleted", { userId });
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private async assertExists(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError("User not found", STATUS_CODE.NOT_FOUND);
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

  /**
   * The signed-in user's own shape. One method for /me, /profile and PATCH so
   * the three can never disagree about which fields are returned.
   */
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
      testingRank: user.testingRank,
      tournamentStatus: user.tournamentStatus,
      exitReason: user.exitReason,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
}

