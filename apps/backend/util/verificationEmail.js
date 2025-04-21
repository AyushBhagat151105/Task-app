import "dotenv/config";
import apiResponse from "./apiRespons.js";
import nodemailer from "nodemailer";

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
};

const sendVerificationEmail = async (user, token, res) => {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: "App <noreply@yourapp.com>",
    to: user.email,
    subject: "Account Verification",
    html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #333;">Welcome to Our App, ${user.name}!</h2>
            <p style="color: #555;">Thank you for registering. Please verify your email address by clicking the link below:</p>
            <a href="${process.env.BASE_URL}/verify/${token}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p style="color: #555;">If you did not create an account, please ignore this email.</p>
            <p style="color: #555;">Best regards,<br/>The App Team</p>
          </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    apiResponse(res, 500, "Failed to send verification email");
  }
};

export default sendVerificationEmail;
