
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");



async function registerController(req, res) {
  const { username, email, password, bio, profileImage } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExist) {
    return res.status(409).json({
      message:
        "User already exists" +
        (isUserAlreadyExist.email == email
          ? " Email already exists"
          : " Username already exists"),
    });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  try {
    const user = await userModel.create({
      username,
      email,
      bio,
      profileImage,
      password: hash,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(201).json({
      message: "user registered successfully",
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}





async function loginController(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const isPasswordValid = hash == user.password;

  if (!isPasswordValid) {
    return res.status(401).json({ message: "invalid password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });


}


module.exports = {
  registerController,
  loginController,
};