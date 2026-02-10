import jwt, { Secret } from "jsonwebtoken";

const verifyResetPasswordToken = (token: string): any => {
  const secret = process.env.JWT_RESET_SECRET as Secret;
  if (!secret) {
    throw new Error("JWT_RESET_SECRET is not defined in environment variables");
  }
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("Error verifying reset password token:", error);
    throw new Error("Invalid or expired reset password token");
  }
};

export default verifyResetPasswordToken;
