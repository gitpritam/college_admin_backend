import { Request, Response } from "express";
import { activityLogger } from "../../../config/log.config";

const logout = (req: Request, res: Response) => {
  activityLogger.info("Logout Successful", {
    user_id: req.user?._id,
    http_method: req.method,
    endpoint: req.originalUrl,
    message: "User logged out successfully",
  });

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export default logout;
