import { Router } from "express";
import { registerUser } from "../controller/auth.controller.js";
import { registerValidation } from "../validation/auth.validator.js";

const authRouter = Router();





// @route POST /api/auth/register
// @desc Register a new user
// @access Public
// @body { user: {id , username , email , password }}

authRouter.post("/register", registerValidation, registerUser);

export default authRouter;
