import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import verifyResetPasswordToken from "../../../utils/jwt/verifyResetPasswordToken";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import hashPassword from "../../../utils/password/hashPassword";
import { activityLogger } from "../../../config/log.config";

const resetPasswordController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, token } = req.body;

    const decodedToken = await verifyResetPasswordToken(token);

    if (!decodedToken || !decodedToken.id) {
      activityLogger.warn("Reset Password Failed", {
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Invalid or expired reset password link",
      });
      return next(
        new CustomError(400, "Invalid or expired reset password link"),
      );
    }

    const faculty = await FacultyModel.findById(decodedToken.id);

    if (!faculty) {
      activityLogger.warn("Reset Password Failed", {
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Faculty not found for id ${decodedToken.id}`,
      });
      return next(new CustomError(404, "Faculty not found"));
    }
    console.log("Faculty found:", faculty);
    if (!faculty.reset_token || faculty.reset_token !== token) {
      activityLogger.warn("Reset Password Failed", {
        user_id: faculty._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Invalid reset password token",
      });
      return next(new CustomError(400, "Invalid reset password token"));
    }

    const hashedPassword = await hashPassword(newPassword);

    await FacultyModel.findByIdAndUpdate(
      decodedToken.id,
      { $set: { password: hashedPassword, reset_token: null } },
      { new: true },
    );

    activityLogger.info("Reset Password Successful", {
      user_id: faculty._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: "Password reset successfully",
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  },
);

export default resetPasswordController;
