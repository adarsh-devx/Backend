import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validator/auth.validator.js";
import {
  registerUser,
  loginUser,
  googleCallback,
  getMe,
  logoutUser,
  updateProfile,
  updateAddresses,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { config } from "../config/config.js";

const router = Router();

// ── Standard Email/Password Authentication ────────────────────────────────────
// POST /api/auth/register - Rate-limited, validated, creates new account
router.post("/register", authLimiter, validateRegisterUser, registerUser);

// POST /api/auth/login - Rate-limited against brute force, validates credentials
router.post("/login", authLimiter, validateLoginUser, loginUser);

// ── Google OAuth 2.0 Authentication ───────────────────────────────────────────
// GET /api/auth/google - Initiates Google sign-in flow (requests profile & email scopes)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// GET /api/auth/google/callback - Receives auth code from Google; redirects to login on failure
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.FRONTEND_URL}/login`,
  }),
  googleCallback,
);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", authenticateUser, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user and clear JWT cookie
router.post("/logout", logoutUser);

// @route   PUT /api/auth/profile
// @desc    Update user profile details (fullName, contact, password)
router.put("/profile", authenticateUser, updateProfile);

// @route   PUT /api/auth/addresses
// @desc    Update user saved delivery addresses
router.put("/addresses", authenticateUser, updateAddresses);

export default router;
