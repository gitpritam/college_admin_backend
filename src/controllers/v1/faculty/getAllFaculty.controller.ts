import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";

const getAllFacultyController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // pagination
    // search
    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = (page && parseInt(page as string)) || 1;
    const limitNumber = (limit && parseInt(limit as string)) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let filter = {};
    if ((query as string).trim()) {
      const regex = new RegExp(query as string, "i"); //case-insensitive search
      filter = {
        $or: [
          { first_name: regex },
          { faculty_id: regex },
          { phone_number: regex },
          { email: regex },
          { department: regex },
        ],
      };
    }

    const facultyData = await FacultyModel.find( filter)
      .skip(skip)
      .limit(limitNumber)
      .select("-password -__v");

    if (facultyData.length === 0 || !facultyData) {
      return next(new CustomError(404, "No faculty found."));
    }

    const totalCount = await FacultyModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Faculty data found",
      result: {
        data: facultyData,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        limit: limitNumber,
      },
    });
  }
);

export default getAllFacultyController;
