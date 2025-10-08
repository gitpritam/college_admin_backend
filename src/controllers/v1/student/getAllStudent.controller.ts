import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import StudentModel from "../../../models/student.model";
import CustomError from "../../../utils/CustomError";

const getAllStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = (page && parseInt(page as string)) || 1;
    const limitNumber = (limit && parseInt(limit as string)) || 10;
    const skip = (pageNumber - 1) * limitNumber;
     let filter = {};
    if ((query as string).trim()) {
      const regex = new RegExp(query as string, "i"); 
      filter = {
        $or: [
          { name: regex },
          { student_id: regex },
          { phone_number: regex },
          { email: regex },
          { department: regex },
          {dob: regex},
        ],
      };
    }

    //searching, pagination
    const students = await StudentModel.find();
    if (students.length === 0) {
      return next(new CustomError(404, "No students found"));
    }

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      result: students,
    });
  }
);

export default getAllStudentController;
