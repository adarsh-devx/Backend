import { Router } from "express";
import { registerUser, verifyEmail, loginUser } from "../controller/auth.controller.js";
import { registerValidation, loginValidation } from "../validation/auth.validator.js";

const authRouter = Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
// @body { user: {id , username , email , password }}

authRouter.post("/register", registerValidation, registerUser);

// @route POST /api/auth/login
// @desc Login a user and return JWT Token
// @access Public
// @body { user: {email , password }}

authRouter.post("/login", loginValidation, loginUser);

// @route GET /api/auth/verify-email
// @desc Verify user email
// @access Public
// @query { token }

authRouter.get("/verify-email", verifyEmail);

export default authRouter;
