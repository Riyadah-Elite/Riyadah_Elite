import rateLimit from "express-rate-limit";

// Rate limiter for authentication endpoints: max 15 requests per 15 minutes per IP
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many authentication requests from this IP. Please try again after 15 minutes.",
  },
});

// Strict rate limiter for password recovery: max 5 requests per hour per IP
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many password recovery requests. Please try again after one hour.",
  },
});
