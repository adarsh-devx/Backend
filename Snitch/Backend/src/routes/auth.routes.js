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
} from "../controllers/auth.controller.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// ── Standard Email/Password Authentication ────────────────────────────────────
// POST /api/auth/register - Validate inputs and create a new buyer or seller account
router.post("/register", validateRegisterUser, registerUser);

// POST /api/auth/login - Validate credentials and issue JWT cookie
router.post("/login", validateLoginUser, loginUser);

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
    failureRedirect: "http://localhost:5173/login",
  }),
  googleCallback,
);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", authenticateUser, getMe);

export default router;
