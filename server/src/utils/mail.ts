import nodemailer from "nodemailer";
import {
  APP_ORIGIN,
  NODE_MAILER_EMAIL,
  NODE_MAILER_PASSWORD,
} from "../constants/env";

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: NODE_MAILER_EMAIL,
      pass: NODE_MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: NODE_MAILER_EMAIL,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Please use the following token to reset your password: ${APP_ORIGIN}/reset/${token}`,
  };

  await transporter.sendMail(mailOptions);
};
