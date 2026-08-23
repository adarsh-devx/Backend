export async function registerUser(req, res, next) {
 res.status(200).json({
    success: true,
    message: "User registered successfully",
    user: req.body
 })
}
