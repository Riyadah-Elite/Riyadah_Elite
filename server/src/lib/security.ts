import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "riyadah_elite_dev_insecure_secret_key_change_in_prod";
const SALT_ROUNDS = 10;

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  adminRole?: "FOUNDER" | "VICE_ADMIN" | "ADMIN";
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAuthToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAuthToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const generateResetToken = (): { rawToken: string; tokenHash: string } => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
};

export const hashResetToken = (rawToken: string): string => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};
