const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const Imagekit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

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

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
    const { id } = decoded;

    const file = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: `post_${Date.now()}`,
      folder: "insta-clone/posts",
    });

    const post = await postModel.create({
      caption: req.body.caption,
      imgURL: file.url,
      user: id,
    });

    res.status(201).json({
      message: "Post created successfully",
      data: post,
      // fileDetails: file,
    });
  } catch (err) {
    console.error("Create Post Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

async function getPostController(req, res) {
  const token = req.cookies.token;
  
  if(!token) {
    return res.status(401).json({
      message: "UnAuthorized Access"
    })
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
  const { id } = decoded;

  const posts = await postModel.find({
    user: id,
  });

  res.status(200).json({
    message: "Post fetched succesfully",
    posts,
  });
}

async function getPostDetailsController(req, res){
  
  
  const token = req.cookies.token

  if(!token) {
    return res.status(401).json({
      message: "UnAuthorized Access"
    })
  }

  let decoded
  try {
    decoded = jwt.verify(token , process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    })
  }
  const {id} = decoded

  const postId = req.params.postId
  const userId = id

  try {
    const post = await postModel.findById(postId)

    if(!post){
      return res.status(404).json({
        message: "Post not found"
      })
    }

    const isValidUser = post.user.toString() === userId

    if(!isValidUser){
      return res.status(403).json({
        message: "Forbidden Content"
      })
    }

    return res.status(200).json({
      message: "Post details fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid post ID",
    })
  }
}




module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController
};
