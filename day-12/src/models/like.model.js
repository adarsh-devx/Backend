const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
            required: [true, "Post id is required for creating a like"],
        },
        user: {
            type: String,
            required: [true, "User is required for creating a like"],
        },
    },
    { timestamps: true },
);

// Ek user ek post ko sirf ek baar like kar sake
likeSchema.index({ user: 1, post: 1 }, { unique: true });

const likeModel = mongoose.model("likes", likeSchema);
module.exports = likeModel;