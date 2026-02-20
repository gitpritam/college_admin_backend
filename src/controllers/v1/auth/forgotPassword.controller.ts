import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import getResetPasswordToken from "../../../utils/jwt/getResetPasswordToken";
import sendResetPasswordEmail from "../../../utils/email/sendResetPasswordEmail";
import getFullName from "../../../utils/getFullName";
import { activityLogger } from "../../../config/log.config";

const forgotPasswordController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const faculty = await FacultyModel.findOne({ email });

    if (!faculty) {
      activityLogger.warn("Forgot Password Failed", {
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Faculty not found for email ${email}`,
      });
      return next(new CustomError(404, "Faculty not found"));
    }

    //jwt payload
    const jwtPayload = {
      id: faculty._id,
      email: faculty.email,
    };

    const resetPasswordToken = getResetPasswordToken(
      jwtPayload,
      parseInt(process.env.JWT_RESET_EXPIRY || "15"),
    );

    const fullName = getFullName(
      faculty.first_name,
      faculty.last_name,
      faculty.middle_name,
    );

    await sendResetPasswordEmail(faculty.email, fullName, resetPasswordToken);

    await FacultyModel.findByIdAndUpdate(faculty._id, {
      $set: { reset_token: resetPasswordToken },
    });

    activityLogger.info("Forgot Password Requested", {
      user_id: faculty._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Reset password email sent to ${faculty.email}`,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  },
);

export default forgotPasswordController;
