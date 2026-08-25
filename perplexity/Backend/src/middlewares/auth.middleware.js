import jwt from "jsonwebtoken";

// @desc Auth middleware
// @route /api/auth/get-me
// @access Private
// @body {} 
export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        err: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}
