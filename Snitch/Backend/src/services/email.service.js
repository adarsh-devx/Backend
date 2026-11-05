import nodemailer from "nodemailer";
import { config } from "../config/config.js";
import { generateOrderConfirmationEmail } from "../templates/orderConfirmation.template.js";

let cachedTransporter = null;

/**
 * Initializes or reuses the Nodemailer transport instance.
 * If credentials are provided in .env, connects to real SMTP (Gmail, Brevo, Resend, SES).
 * If no credentials exist, gracefully generates a local Ethereal test mailbox so
 * development continues seamlessly with real clickable preview URLs.
 */
async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // 1. Production / Live SMTP configuration
  if (config.EMAIL_USER && config.EMAIL_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_SECURE, // true for 465, false for 587
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });

    return cachedTransporter;
  }

  // 2. Local development fallback: Automatic Ethereal test inbox
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log(
      "[EMAIL SERVICE] Notice: EMAIL_USER/EMAIL_PASS not found in .env. Using ephemeral Ethereal test mailer."
    );
    return cachedTransporter;
  } catch (err) {
    console.warn(
      "[EMAIL SERVICE] Failed to create test account, falling back to mock transport:",
      err.message
    );
    cachedTransporter = {
      sendMail: async (opts) => {
        console.log(`[EMAIL MOCK DISPATCH] To: ${opts.to} | Subject: ${opts.subject}`);
        return { messageId: `mock-${Date.now()}` };
      },
    };
    return cachedTransporter;
  }
}

/**
 * Sends a high-end luxury order confirmation email to the customer.
 * Asynchronously dispatched so payment responses are never blocked.
 *
 * @param {Object} params
 * @param {Object} params.user - User document containing email, fullName, addresses
 * @param {Object} params.payment - Payment document containing price, orderItems, Razorpay info
 * @returns {Promise<Object>} Delivery report
 */
export async function sendOrderConfirmationEmail({ user, payment }) {
  try {
    const recipientEmail = user?.email;
    if (!recipientEmail) {
      console.warn("[EMAIL SERVICE] Cannot dispatch order confirmation: user email missing");
      return { success: false, reason: "MISSING_EMAIL" };
    }

    const orderId = payment?.Razorpay?.orderId || payment?._id || "ARCHIVE";
    const { html, text } = generateOrderConfirmationEmail({
      user,
      payment,
      frontendUrl: config.FRONTEND_URL,
    });

    const transporter = await getTransporter();

    const sender = config.EMAIL_USER
      ? `"Noirvayn Atelier" <${config.EMAIL_USER}>`
      : (config.EMAIL_FROM || '"Noirvayn Atelier" <concierge@noirvayn.com>');

    const mailOptions = {
      from: sender,
      to: recipientEmail,
      subject: `NOIRVAYN // Order Confirmed #${orderId}`,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `[EMAIL SERVICE] Order confirmation dispatched to ${recipientEmail} (MessageId: ${info.messageId})`
    );

    // If using Ethereal test account, print live preview URL for developer inspection
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[EMAIL SERVICE] Preview live order confirmation email: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
    };
  } catch (error) {
    console.error("[EMAIL SERVICE] Error dispatching order confirmation email:", error.message);
    // Non-blocking: We do not rethrow so caller's order completion is never halted
    return { success: false, error: error.message };
  }
}

