const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const Imagekit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required (form-data field key must be 'image')",
      });
    }

    const userId = req.userId;

    const file = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: `post_${Date.now()}`,
      folder: "insta-clone/posts",
    });

    const post = await postModel.create({
      caption: req.body.caption,
      imgURL: file.url,
      user: userId,
    });

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    console.error("Create Post Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

async function getPostController(req, res) {
  const userId = req.userId;

  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Post fetched succesfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const postId = req.params.postId;
  const userId = req.userId;

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isValidUser = post.user.toString() === userId;

    if (!isValidUser) {
      return res.status(403).json({
        message: "Forbidden Content",
      });
    }

    return res.status(200).json({
      message: "Post details fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid post ID",
    });
  }
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
};