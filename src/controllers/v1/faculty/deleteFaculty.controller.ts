import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import { activityLogger } from "../../../config/log.config";

//soft del r hard del
const deleteFacultyController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;
    const { type } = req.query;

    if (type === "soft") {
      const faculty = await FacultyModel.findOneAndUpdate(
        { faculty_id: id },
        { account_status: false },
        { new: true, runValidators: true }
      );
      if (!faculty) {
        activityLogger.warn("Faculty Delete Failed", {
          user_id: user?._id,
          http_method: req.method,
          endpoint: req.originalUrl,
          message: `Faculty not found for ID ${id}`,
        });
        return next(new CustomError(404, "Faculty not found"));
      }
      activityLogger.info("Faculty Soft Deleted", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Faculty \"${faculty.first_name} ${faculty.last_name}\" soft deleted with ID ${faculty.faculty_id}`,
      });
      return res
        .status(200)
        .json({ message: "Faculty soft deleted successfully", faculty });
    }
    if (type === "hard") {
      const faculty = await FacultyModel.findOneAndDelete({
        faculty_id: id,
      });
      if (!faculty) {
        activityLogger.warn("Faculty Delete Failed", {
          user_id: user?._id,
          http_method: req.method,
          endpoint: req.originalUrl,
          message: `Faculty not found for ID ${id}`,
        });
        return next(new CustomError(404, "Faculty not found"));
      }
      activityLogger.info("Faculty Hard Deleted", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Faculty \"${faculty.first_name} ${faculty.last_name}\" hard deleted with ID ${faculty.faculty_id}`,
      });
      return res
        .status(200)
        .json({ message: "Faculty hard deleted successfully", faculty });
    }

    activityLogger.warn("Faculty Delete Failed", {
      user_id: user?._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Invalid deletion type \"${String(type)}\" for ID ${id}`,
    });

    return res
      .status(400)
      .json({ message: "Invalid deletion type. Use 'soft' or 'hard'." });
  }
);

export default deleteFacultyController;
