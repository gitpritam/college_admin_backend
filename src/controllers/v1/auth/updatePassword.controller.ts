import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import comparePassword from "../../../utils/password/comparePassword";
import hashPassword from "../../../utils/password/hashPassword";

const updatePasswordController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { currentPassword, newPassword } = req.body;

    const faculty = await FacultyModel.findById(user?._id);
    if (!faculty) {
      return next(new CustomError(404, "Faculty not found"));
    }

    const isPasswordMatch = await comparePassword(
      currentPassword,
      faculty.password!,
    );

    if (!isPasswordMatch) {
      return next(new CustomError(403, "Current password is incorrect"));
    }

    const newHashedPassword = await hashPassword(newPassword);

    const updatedFaculty = await FacultyModel.findByIdAndUpdate(
      user?._id,
      { $set: { password: newHashedPassword } },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  },
);

export default updatePasswordController;
