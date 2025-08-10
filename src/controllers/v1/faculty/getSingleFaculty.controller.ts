import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import FacultyModel from "../../../models/faculty.model";

const getSingleFacultyController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Faculty id is required"));
    }

    const faculty = await FacultyModel.findOne({ faculty_id: id }).select(
      "-password -__v"
    );

    if (!faculty) {
      return next(new CustomError(404, `No faculty found with this id: ${id}`));
    }

    return res
      .status(200)
      .json({ success: true, message: "Faculty data found.", result: faculty });
  }
);

export default getSingleFacultyController;
