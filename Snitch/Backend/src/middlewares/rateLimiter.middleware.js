import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for Authentication endpoints (Login & Register).
 * Prevents automated password brute-forcing and credential stuffing.
 * Allows 10 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

/**
 * Rate limiter for sensitive financial/order creation endpoints.
 * Protects Razorpay order creation from spam/DDoS.
 * Allows 30 requests per 15 minutes per IP.
 */
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many order requests. Please slow down and try again shortly.",
  },
});

/**
 * General API rate limiter applied globally across all routes.
 * Protects the Express server and MongoDB from DDoS attacks.
 * Allows 300 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
});

