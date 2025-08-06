import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import StudentModel from "../../../models/students.model";
import CustomError from "../../../utils/CustomError";
import { get } from "http";

const getAllStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const students = await StudentModel.find();
    if (students.length === 0) {
      return next(new CustomError(404, "No students found"));
    }

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  }
);

export default getAllStudentController;
