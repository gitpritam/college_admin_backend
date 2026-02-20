import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import comparePassword from "../../../utils/password/comparePassword";
import hashPassword from "../../../utils/password/hashPassword";
import { activityLogger } from "../../../config/log.config";

const updatePasswordController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { currentPassword, newPassword } = req.body;

    const faculty = await FacultyModel.findById(user?._id);
    if (!faculty) {
      activityLogger.warn("Update Password Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Faculty not found",
      });
      return next(new CustomError(404, "Faculty not found"));
    }

    const isPasswordMatch = await comparePassword(
      currentPassword,
      faculty.password!,
    );

    if (!isPasswordMatch) {
      activityLogger.warn("Update Password Failed", {
        user_id: faculty._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Current password is incorrect",
      });
      return next(new CustomError(403, "Current password is incorrect"));
    }

    const newHashedPassword = await hashPassword(newPassword);

    const updatedFaculty = await FacultyModel.findByIdAndUpdate(
      user?._id,
      { $set: { password: newHashedPassword } },
      { new: true },
    );

    activityLogger.info("Update Password Successful", {
      user_id: updatedFaculty?._id ?? faculty._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: "Password updated successfully",
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  },
);

export default updatePasswordController;
