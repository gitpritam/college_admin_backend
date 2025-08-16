import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import StudentModel from "../../../models/student.model";

const getSingleStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Student id is required"));
    }

    const student = await StudentModel.findOne({ student_id: id }).populate(
      "posted_by"
    );

    if (!student) {
      return next(new CustomError(404, `No student found with this id: ${id}`));
    }

    return res
      .status(200)
      .json({ success: true, message: "STudent data found.", result: student});
  }
);

export default getSingleStudentController;