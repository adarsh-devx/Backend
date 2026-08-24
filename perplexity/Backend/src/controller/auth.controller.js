import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isUserAlreadyExist) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
        err: "User already exist",
      });
    }

    const user = await userModel.create({ username, email, password });
    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error in user registration:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}
