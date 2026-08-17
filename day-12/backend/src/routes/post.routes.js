const express = require("express");
const postRouter = express.Router();
const {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  unlikePostController,
  getFeedController,
} = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// @route POST /api/posts/
// @desc Create a new post with the contend and image (optional)
postRouter.post("/", authMiddleware, upload.single("image"), createPostController);

// @route GET /api/posts/
// @desc Get all posts
postRouter.get("/", authMiddleware, getPostController);

// @route GET /api/posts/details/:postId
// @desc Get post details
postRouter.get("/details/:postId", authMiddleware, getPostDetailsController);


// @route POST /api/posts/like/:id
// @desc Like a post with the id provided in the request parameters
postRouter.post("/like/:postId", authMiddleware, likePostController);
postRouter.post("/unlike/:postId", authMiddleware, unlikePostController);



// @route GET /api/posts/feed
// @desc Get all the posts created in DB
// @access Private
postRouter.get("/feed", authMiddleware, getFeedController);

module.exports = postRouter;