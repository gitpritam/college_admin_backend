import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import StudentModel from "../../../models/student.model";
import CustomError from "../../../utils/CustomError";
import { activityLogger } from "../../../config/log.config";

const deleteStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    if (!id) {
      activityLogger.warn("Student Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Student id is required",
      });
      return next(new CustomError(400, "Student id is required"));
    }

    const student = await StudentModel.findOneAndDelete({
      student_id: id,
    });
    if (!student) {
      activityLogger.warn("Student Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Student not found for ID ${id}`,
      });
      return next(new CustomError(404, "Student not found"));
    }

    activityLogger.info("Student Deleted", {
      user_id: user?._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Student \"${student.first_name} ${student.last_name}\" hard deleted with ID ${student.student_id}`,
    });

    return res
      .status(200)
      .json({ message: "Student hard deleted successfully", student });
  }
);

export default deleteStudentController;
