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

    const file = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: "file",
    });

    // Sir's exact response: send uploaded file details directly
    res.send(file);
  } catch (err) {
    console.error("Create Post Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

module.exports = createPostController;
