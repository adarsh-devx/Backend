const express = require("express");
const postRouter = express.Router();
const {
  createPostController,
  getPostController,
  getPostDetailsController,
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




module.exports = postRouter;