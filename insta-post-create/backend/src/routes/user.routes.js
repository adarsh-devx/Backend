const express = require("express");
const userRouter = express.Router();
const {
  followUserController,
  unfollowUserController,
  acceptFollowController,
  rejectFollowController,
  getFollowRequestsController,
  getAllUsersController,
  getFollowingController,
  getFollowersController,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// @route GET /api/users
// @desc Get all users (with isFollowing status)
userRouter.get("/", authMiddleware, getAllUsersController);

// @route GET /api/users/following
// @desc Get users that I follow
userRouter.get("/following", authMiddleware, getFollowingController);

// @route GET /api/users/followers
// @desc Get users that follow me
userRouter.get("/followers", authMiddleware, getFollowersController);

// @route POST /api/users/follow/:username
// @desc Follow a user
userRouter.post("/follow/:username", authMiddleware, followUserController);

// @route POST /api/users/unfollow/:username
// @desc Unfollow a user
userRouter.post("/unfollow/:username", authMiddleware, unfollowUserController);

// @route POST /api/users/accept/:username
// @desc Accept a follow request
userRouter.post("/accept/:username", authMiddleware, acceptFollowController);

// @route POST /api/users/reject/:username
// @desc Reject a follow request
userRouter.post("/reject/:username", authMiddleware, rejectFollowController);

// @route GET /api/users/requests
// @desc Get all follow requests
userRouter.get("/requests", authMiddleware, getFollowRequestsController);

module.exports = userRouter;
