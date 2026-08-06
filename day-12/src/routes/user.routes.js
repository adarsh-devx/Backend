const express = require("express");
const userRouter = express.Router();
const {
  followUserController,
  unfollowUserController,
  acceptFollowController,
  rejectFollowController,
  getFollowRequestsController,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// @route POST /api/users/follow/:userid
// @desc Follow a user
userRouter.post("/follow/:username", authMiddleware, followUserController);

// @route POST /api/users/unfollow/:userid
// @desc Unfollow a user
userRouter.post("/unfollow/:username", authMiddleware, unfollowUserController);

// @route POST /api/users/accept/:userid
// @desc Accept a follow request
userRouter.post("/accept/:username", authMiddleware, acceptFollowController);

// @route POST /api/users/reject/:userid
// @desc Reject a follow request
userRouter.post("/reject/:username", authMiddleware, rejectFollowController);

// @route GET /api/users/requests
// @desc Get all follow requests
userRouter.get("/requests", authMiddleware, getFollowRequestsController);

module.exports = userRouter;
