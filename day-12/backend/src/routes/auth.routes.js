const express = require("express");
const authRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const { 
  registerController,
  loginController,
  getMeController,
} = require("../controllers/auth.controller");

// POST /api/auth/register
authRouter.post("/register", registerController);

// POST /api/auth/login
authRouter.post("/login", loginController);

//@route GET /api/auth/get-me
//@desc GET the current logged in user information
//@access private
authRouter.get("/get-me", authMiddleware, getMeController);

module.exports = authRouter;
