import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import StudentModel from "../../../models/student.model";
import CustomError from "../../../utils/CustomError";
import { regexes } from "zod";

const getAllStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = (page && parseInt(page as string)) || 1;
    const limitNumber = (limit && parseInt(limit as string)) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    let filter = {};
    if ((query as string).trim()) {
      const regex = new RegExp(query as string, "i"); 
      let filterQuery: Array< {name?: RegExp,student_id?: RegExp,phone_number?: RegExp,email?: RegExp, department?: RegExp,dob?: RegExp}>=[
        {name: regex},
        {student_id: regex},
        {phone_number: regex},
        {email: regex},
        {department: regex},
        {dob: regex},
      ];
      if (!isNaN(Number(query))){
        filterQuery.push({name: regex});
    }
    filter={
      $or: filterQuery
    };
  }
    const studentData = await StudentModel.find( filter )

      .skip(skip)
      .limit(limitNumber);

    if (studentData.length === 0 || !studentData) {
      return next(new CustomError(404, "No student found."));
    }

      const totalCount = await StudentModel.countDocuments(filter);

      return res.status(200).json({
      success: true,
      message: "Student data found",
      result: {
        data: studentData,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        limit: limitNumber,
      },
    });
  }
);

export default getAllStudentController;
