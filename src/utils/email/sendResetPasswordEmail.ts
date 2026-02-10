import { SendSmtpEmail } from "@getbrevo/brevo";
import emailAPI from "../../config/email.config";
import generateResetPasswordEmailHTML from "./generateResetPasswordEmailHTML";

/**
 * Sends a password reset email to the specified recipient.
 * @param {string} toEmail - The email address of the recipient.
 * @param {string} name - The name of the recipient.
 * @param {string} resetToken - The password reset token to include in the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 * @throws {Error} - Throws an error if the email fails to send.
 */
const sendResetPasswordEmail = async (
  toEmail: string,
  name: string,
  resetToken: string,
) => {
  const message = new SendSmtpEmail();
  message.subject = "Password Reset Request";
  message.htmlContent = generateResetPasswordEmailHTML(name, resetToken);
  message.sender = { name: "College Admin", email: "pritammajhi10@gmail.com" };
  message.to = [{ email: toEmail, name }];
  try {
    await emailAPI.sendTransacEmail(message);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }
};

export default sendResetPasswordEmail;
