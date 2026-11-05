import { config } from "./config.js";

/**
 * Standard cookie configuration for authentication JWT tokens.
 * Enforces httpOnly to neutralize XSS token exfiltration,
 * and sets secure/sameSite flags dynamically based on the environment.
 */
export const getAuthCookieOptions = () => {
  const isProduction = config.NODE_ENV === "production";

  return {
    httpOnly: true, // Prevents client-side JavaScript access via document.cookie
    secure: isProduction, // Transmitted only over HTTPS in production
    sameSite: isProduction ? "none" : "lax", // Protects against CSRF while allowing cross-origin in prod
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days duration
  };
};

/**
 * Options used when clearing authentication cookie upon logout.
 */
export const getClearCookieOptions = () => {
  const isProduction = config.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

