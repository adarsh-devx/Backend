const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
    },
    following: {
      type: String,
    },
  },
  { timestamps: true },
);

// Ek user doosre ko sirf ek baar follow kar sake
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;
