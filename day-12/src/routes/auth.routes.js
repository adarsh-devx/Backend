const express = require("express");
const authRouter = express.Router();
const { registerController, loginController } = require("../controllers/auth.controller");



// POST /api/auth/register
authRouter.post("/register", registerController);


// POST /api/auth/login
authRouter.post("/login", loginController);

module.exports = authRouter;
