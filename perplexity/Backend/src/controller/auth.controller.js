import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

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

await sendEmail({
  to: email,
  subject: "Welcome to Perplexity — Your account is ready",
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Perplexity</title>
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
                    ">
                      Welcome, ${username}!
                    </h2>

                    <p style="
                      margin: 0 0 16px;
                      font-size: 16px;
                      line-height: 1.6;
                      color: #444444;
                    ">
                      Thank you for creating your account with
                      <strong>Perplexity</strong>.
                    </p>

                    <p style="
                      margin: 0 0 24px;
                      font-size: 16px;
                      line-height: 1.6;
                      color: #444444;
                    ">
                      Your account has been successfully created.
                      We're excited to have you with us and hope you
                      enjoy your experience.
                    </p>

                    <!-- CTA -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="
                          background-color: #111111;
                          border-radius: 8px;
                        ">
                          <a
                            href="https://yourapp.com"
                            style="
                              display: inline-block;
                              padding: 13px 24px;
                              color: #ffffff;
                              text-decoration: none;
                              font-size: 15px;
                              font-weight: 600;
                            "
                          >
                            Get Started
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin: 30px 0 0;
                      font-size: 14px;
                      line-height: 1.6;
                      color: #777777;
                    ">
                      If you didn't create this account, you can safely
                      ignore this email.
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
