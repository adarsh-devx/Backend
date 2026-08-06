const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  try {
    const followerUsername = req.username; // user that want to follow
    const followingUsername = req.params.username; // user that want to be followed

    if (followingUsername === followerUsername) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const isFollowingExist = await userModel.findOne({
      username: followingUsername,
    });

    if (!isFollowingExist) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const isAlreadyFollowing = await followModel.findOne({
      follower: followerUsername,
      following: followingUsername,
    });

    if (isAlreadyFollowing) {
      return res.status(200).json({
        message: `You are already following ${followingUsername}`,
        follow: isAlreadyFollowing,
      });
    }

    const followRecord = await followModel.create({
      follower: followerUsername,
      following: followingUsername,
    });

    res.status(201).json({
      message: `You are now following ${followingUsername}`,
      followRecord,
    });
  } catch (error) {
    console.log(error);
  }
}

async function unfollowUserController(req, res) {
  try {
    const followerUsername = req.username;
    const followingUsername = req.params.username;

    const isFollowingExist = await userModel.findOne({
      username: followingUsername,
    });

    if (!isFollowingExist) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const isUserFollowing = await followModel.findOne({
      follower: followerUsername,
      following: followingUsername,
    });

    if (!isUserFollowing) {
      return res.status(200).json({
        message: `You are not following ${followingUsername}`,
      });
    }

    await followModel.findOneAndDelete({
      follower: followerUsername,
      following: followingUsername,
    });

    res.status(200).json({
      message: `You have unfollowed ${followingUsername}`,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { followUserController, unfollowUserController };
