const express = require("express");
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserExists = await userModel.findOne({ email });

  if (isUserExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const user = await userModel.create({
    name,
    email,
    password: crypto.createHash("md5").update(password).digest("hex"),
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      name: user.name,
      email: user.email,
      password: user.password,
    },
  });
});


authRouter.get('/get-me', async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    // Expired ya Invalid token aane par server crash hone se bachega
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});


authRouter.post('/login' , async (req , res) => {
  const {email , password} = req.body
  const user = await userModel.findOne({email})

  if(!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  const isPasswordValid = crypto.createHash("md5").update(password).digest("hex") === user.password

  if(!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials"
    })
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = authRouter;
