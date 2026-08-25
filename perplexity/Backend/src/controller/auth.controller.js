import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
// @body { user: {username , email , password }}

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

    const emailVerificationToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    const verificationUrl = `${process.env.CORS_ORIGIN}/verify-email?token=${emailVerificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your Perplexity account",
      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your Perplexity account</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #171717;
      ">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding: 40px 20px;"
        >
          <tr>
            <td align="center">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  border: 1px solid #e5e5e5;
                "
              >

                <!-- Header -->
                <tr>
                  <td style="
                    padding: 28px 40px;
                    border-bottom: 1px solid #eeeeee;
                  ">
                    <h1 style="
                      margin: 0;
                      font-size: 24px;
                      color: #111111;
                    ">
                      Perplexity
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">

                    <h2 style="
                      margin: 0 0 20px;
                      font-size: 26px;
                      line-height: 1.3;
                      color: #111111;
                    ">
                      Verify your email address
                    </h2>

                    <p style="
                      margin: 0 0 16px;
                      font-size: 16px;
                      line-height: 1.6;
                      color: #444444;
                    ">
                      Hi ${username},
                    </p>

                    <p style="
                      margin: 0 0 24px;
                      font-size: 16px;
                      line-height: 1.6;
                      color: #444444;
                    ">
                      Thanks for signing up for
                      <strong>Perplexity</strong>.
                      Please verify your email address to complete
                      your account setup.
                    </p>

                    <!-- CTA -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="
                          background-color: #111111;
                          border-radius: 8px;
                        ">
                          <a
                            href="${verificationUrl}"
                            style="
                              display: inline-block;
                              padding: 13px 24px;
                              color: #ffffff;
                              text-decoration: none;
                              font-size: 15px;
                              font-weight: 600;
                            "
                          >
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin: 28px 0 8px;
                      font-size: 14px;
                      line-height: 1.6;
                      color: #777777;
                    ">
                      This verification link will expire in
                      <strong>15 minutes</strong>.
                    </p>

                    <p style="
                      margin: 0;
                      font-size: 14px;
                      line-height: 1.6;
                      color: #777777;
                    ">
                      If the button above doesn't work, copy and paste
                      the following link into your browser:
                    </p>

                    <p style="
                      margin: 10px 0 0;
                      font-size: 13px;
                      line-height: 1.5;
                      word-break: break-all;
                    ">
                      <a
                        href="${verificationUrl}"
                        style="
                          color: #555555;
                          text-decoration: underline;
                        "
                      >
                        ${verificationUrl}
                      </a>
                    </p>

                    <p style="
                      margin: 30px 0 0;
                      padding-top: 20px;
                      border-top: 1px solid #eeeeee;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #888888;
                    ">
                      If you didn't create a Perplexity account,
                      you can safely ignore this email.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="
                    padding: 24px 40px;
                    background-color: #fafafa;
                    border-top: 1px solid #eeeeee;
                  ">

                    <p style="
                      margin: 0 0 8px;
                      font-size: 13px;
                      color: #777777;
                    ">
                      Best regards,<br />
                      <strong>Team Perplexity</strong>
                    </p>

                    <p style="
                      margin: 0;
                      font-size: 12px;
                      color: #999999;
                    ">
                      © 2026 Perplexity. All rights reserved.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `,
    });

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in user registration:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}

// @desc Login a user
// @route POST /api/auth/login
// @access Public
// @body { user: {email , password }}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        err: "User not found",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
        err: "Invalid password",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
        success: false,
        err: "Email not verified",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in user login:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}

// @desc Verify user email
// @route GET /api/auth/verify-email
// @access Public
// @query { token }

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        success: false,
        err: "Token is required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        message: "Invalid or expired token",
        success: false,
        err: err.message,
      });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        err: "User not found",
      });
    }

    user.verified = true;
    await user.save();

    res.send(`
        <h1>Email verified successfully</h1>
        <p>Your email has been verified successfully. You can now login to your account.</p>
    `);
  } catch (error) {
    console.error("Error in email verification:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}
