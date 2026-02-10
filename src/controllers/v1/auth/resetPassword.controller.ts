import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import verifyResetPasswordToken from "../../../utils/jwt/verifyResetPasswordToken";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import hashPassword from "../../../utils/password/hashPassword";

const resetPasswordController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, token } = req.body;

    const decodedToken = await verifyResetPasswordToken(token);

    if (!decodedToken || !decodedToken.id) {
      return next(
        new CustomError(400, "Invalid or expired reset password link"),
      );
    }

    const faculty = await FacultyModel.findById(decodedToken.id);

    if (!faculty) {
      return next(new CustomError(404, "Faculty not found"));
    }
    console.log("Faculty found:", faculty);
    if (!faculty.reset_token || faculty.reset_token !== token) {
      return next(new CustomError(400, "Invalid reset password token"));
    }

    const hashedPassword = await hashPassword(newPassword);

    await FacultyModel.findByIdAndUpdate(
      decodedToken.id,
      { $set: { password: hashedPassword, reset_token: null } },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  },
);

export default resetPasswordController;
