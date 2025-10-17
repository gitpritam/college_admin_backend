import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import FacultyModel from "../../../models/faculty.model";

const getUserAfterLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Assuming req.user._id is set by auth middleware
    const userId = req.user?._id;
    if (!userId) {
      return next(new CustomError(401, "User not authenticated"));
    }

    const user = await FacultyModel.findById(userId);
    if (!user) {
      return next(new CustomError(404, "User not found"));
    }

    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      result: userObject,
    });
  }
);

export default getUserAfterLogin;
