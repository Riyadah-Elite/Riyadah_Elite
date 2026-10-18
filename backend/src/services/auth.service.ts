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
} from "../types/auth.types.js";
import Logger from "../utils/logger.js";
import AuthRepository from "../repositories/auth.repository.js";
import { STATUS_CODE } from "../constants/constants.js";
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
    this.logger.info("Registering user", { email: userData.email });

    const existingUser = await this.authRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.warn("Registration rejected: email already registered", {
        email: userData.email,
      });

      throw new ApiError("User already exists", STATUS_CODE.CONFLICT);
    }
    
    const extension = path.extname(userData.avatarPath);
    const avatarKey = `avatra/${Date.now()}-${userData.username.toLocaleLowerCase().replace(/\s+/g, "-")}${extension}`;

    let avatarUrl = await this.storageService.put(
      avatarKey,
      userData.avatarPath,
      userData.avatarMimeType,
    );

    // avatar url to key

    const avatarKeyView = avatarKey.replace(`${process.env.S3_ENDPOINT!}/${process.env.S3_BUCKET!}/`, "");
    
    const { buffer, mimeType } = await this.storageService.get(avatarKeyView);

    const avatar = `data:${mimeType};base64,${buffer.toString("base64")}`;

    avatarUrl = avatar;

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.authRepository.createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

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

    return { user };
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
  
}

