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
      if (isAlreadyFollowing.status === "accepted") {
        return res.status(200).json({
          message: `You are already following ${followingUsername}`,
          follow: isAlreadyFollowing,
        });
      } else if (isAlreadyFollowing.status === "pending") {
        return res.status(200).json({
          message: `Follow request is already pending for ${followingUsername}`,
          follow: isAlreadyFollowing,
        });
      } else if (isAlreadyFollowing.status === "rejected") {
        // Status ko fir se pending kar do taaki request resend ho jaye
        isAlreadyFollowing.status = "pending";
        await isAlreadyFollowing.save();
        return res.status(200).json({
          message: `Follow request resent to ${followingUsername}`,
          followRecord: isAlreadyFollowing,
        });
      }
    }

    const followRecord = await followModel.create({
      follower: followerUsername,
      following: followingUsername,
    });

    res.status(201).json({
      message: `Follow request sent to ${followingUsername}`,
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

async function acceptFollowController(req, res) {
  try {
    const loggedInUser = req.username; // Virat (receiving the request)
    const requestingUser = req.params.username; // Adarsh (who sent the request)

    const followRecord = await followModel.findOneAndUpdate(
      {
        follower: requestingUser,
        following: loggedInUser,
        status: "pending",
      },
      { status: "accepted" },
      { returnDocument: "after" },
    );

    if (!followRecord) {
      return res.status(404).json({
        message: "Follow request does not exist",
      });
    }

    res.status(200).json({
      message: `Follow request accepted from ${requestingUser}`,
      followRecord,
    });
  } catch (error) {
    console.log(error);
  }
}

async function rejectFollowController(req, res) {
  try {
    const loggedInUser = req.username; // Virat (receiving the request)
    const requestingUser = req.params.username; // Adarsh (who sent the request)

    const followRecord = await followModel.findOneAndUpdate(
      {
        follower: requestingUser,
        following: loggedInUser,
        status: "pending",
      },
      { status: "rejected" },
      { returnDocument: "after" },
    );

    if (!followRecord) {
      return res.status(404).json({
        message: "Follow request does not exist",
      });
    }

    res.status(200).json({
      message: `Follow request rejected from ${requestingUser}`,
      followRecord,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getFollowRequestsController(req, res) {
  try {
    const username = req.username;

    const followRequests = await followModel.find({
      following: username,
      status: "pending",
    });

    return res.status(200).json({
      message: "Follow requests fetched successfully",
      followRequests,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
  acceptFollowController,
  rejectFollowController,
  getFollowRequestsController,
  getAllUsersController,
  getFollowingController,
  getFollowersController,
};

// --- NEW CONTROLLERS ---

// Get all users (with isFollowing status)
async function getAllUsersController(req, res) {
  try {
    const myUsername = req.username;

    const allUsers = await userModel.find({ username: { $ne: myUsername } }).select("-password");

    const users = await Promise.all(
      allUsers.map(async (user) => {
        const followRecord = await followModel.findOne({
          follower: myUsername,
          following: user.username,
          status: "accepted",
        });
        return {
          ...user.toObject(),
          isFollowing: !!followRecord,
        };
      })
    );

    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get users that I follow (accepted)
async function getFollowingController(req, res) {
  try {
    const myUsername = req.username;

    const followingRecords = await followModel.find({
      follower: myUsername,
      status: "accepted",
    });

    const followingUsers = await Promise.all(
      followingRecords.map(async (record) => {
        const user = await userModel.findOne({ username: record.following }).select("-password");
        return user;
      })
    );

    res.status(200).json({ message: "Following fetched successfully", users: followingUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get users that follow me (accepted)
async function getFollowersController(req, res) {
  try {
    const myUsername = req.username;

    const followerRecords = await followModel.find({
      following: myUsername,
      status: "accepted",
    });

    const followerUsers = await Promise.all(
      followerRecords.map(async (record) => {
        const user = await userModel.findOne({ username: record.follower }).select("-password");
        return user;
      })
    );

    res.status(200).json({ message: "Followers fetched successfully", users: followerUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
