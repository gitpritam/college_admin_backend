import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import StudentModel from "../../../models/student.model";
import CustomError from "../../../utils/CustomError";

const deleteStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const student = await StudentModel.findOneAndDelete({
      student_id: id,
    });
    if (!student) {
      return next(new CustomError(404, "Student not found"));
    }
    return res
      .status(200)
      .json({ message: "Student hard deleted successfully", student });
  }
);

export default deleteStudentController;
