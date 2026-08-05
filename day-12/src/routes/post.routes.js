const express = require("express");
const postRouter = express.Router();
const {
  createPostController,
  getPostController, getPostDetailsController ,
} = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

//POST /api/posts/
postRouter.post("/", upload.single("image"), createPostController);


//GET /api/posts/ [protected]
postRouter.get("/", getPostController);

//GET /api/posts/details/:postId
// return an detail about specific post with the id . also check wheather the post belongs to the user that is request come from .
postRouter.get('/details/:postId' , getPostDetailsController)

module.exports = postRouter;
