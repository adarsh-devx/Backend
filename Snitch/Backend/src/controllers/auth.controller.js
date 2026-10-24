import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * Helper: Signs JWT token, stores it in an HTTP cookie, and sends JSON response
 * @param {Object} user - The mongoose user document
 * @param {Object} res - Express response object
 * @param {string} message - Success message to return
 */
async function sendTokenResponse(user, res, message) {
    // Generate JWT token containing the user's MongoDB _id
    const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "10d" }
    );

    // Set JWT token in an HTTP-only cookie for secure browser storage
    res.cookie("token", token);

    // Return safe user details (excluding password hash)
    return res.status(200).json({
        message,
        success: true,
        user: {
            _id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role
        }
    });
}

/**
 * Controller: Register a new user (Buyer or Seller)
 * Path: POST /api/auth/register
 */
export const registerUser = async (req, res) => {
    const { email, contact, password, fullName, isSeller } = req.body;
    try {
        // Step 1: Check if an account already exists with the given email or contact
        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User with Email or Contact already exists" });
        }

        // Step 2: Create new user document (password will be hashed in user.model pre-save hook)
        const user = await userModel.create({
            email,
            contact,
            password,
            fullName,
            role: isSeller ? "seller" : "buyer" // Determine role based on isSeller toggle
        });

        // Step 3: Issue JWT token and return user data
        return sendTokenResponse(user, res, "User registered successfully");
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Controller: Authenticate existing user with email and password
 * Path: POST /api/auth/login
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Step 1: Find user by email in database
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 2: Compare input password with stored bcrypt hash
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Step 3: Issue JWT token upon successful authentication
        return sendTokenResponse(user, res, "User logged in successfully");
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Controller: Google OAuth callback handler
 * Path: GET /api/auth/google/callback
 * Google sends back authenticated user details via Passport in req.user
 */
export const googleCallback = async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;
        const email = emails[0].value;
        const profilePic = photos?.[0]?.value;

        // Step 1: Check if user already exists in DB
        let user = await userModel.findOne({ email });

        // Step 2: If user does not exist, create a new record linked with googleId
        if (!user) {
            user = await userModel.create({
                email,
                fullName: displayName,
                googleId: id,
                role: "buyer"
            });
        }

        // Step 3: Sign JWT token for the session
        const token = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "10d" }
        );

        // Step 4: Set JWT token in cookie and redirect user to frontend homepage
        res.cookie("token", token);
        return res.redirect("http://localhost:5173/");
    } catch (error) {
        console.error("Google OAuth Error:", error);
        return res.redirect("http://localhost:5173/login?error=OAuthFailed");
    }
};