import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import getResetPasswordToken from "../../../utils/jwt/getResetPasswordToken";
import sendResetPasswordEmail from "../../../utils/email/sendResetPasswordEmail";
import getFullName from "../../../utils/getFullName";

const forgotPasswordController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const faculty = await FacultyModel.findOne({ email });

    if (!faculty) {
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

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  },
);

export default forgotPasswordController;
