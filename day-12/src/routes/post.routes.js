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

//POST /api/posts/
postRouter.post("/", authMiddleware, upload.single("image"), createPostController);

//GET /api/posts/ [protected]
postRouter.get("/", authMiddleware, getPostController);

//GET /api/posts/details/:postId
postRouter.get("/details/:postId", authMiddleware, getPostDetailsController);

module.exports = postRouter;
