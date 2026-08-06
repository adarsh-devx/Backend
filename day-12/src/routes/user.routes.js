const express = require("express");
const userRouter = express.Router();
const {
  followUserController,
  unfollowUserController,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// @route POST /api/users/follow/:userid
// @desc Follow a user
// @access Private
userRouter.post("/follow/:username", authMiddleware, followUserController);

// @route POST /api/users/unfollow/:userid
// @desc Unfollow a user
// @access Private
userRouter.post("/unfollow/:username", authMiddleware, unfollowUserController);

module.exports = userRouter;
