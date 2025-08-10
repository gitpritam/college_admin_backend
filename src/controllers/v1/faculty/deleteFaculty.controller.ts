import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";

//soft del r hard del
const deleteFacultyController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { type } = req.query;

    if (type === "soft") {
      const faculty = await FacultyModel.findOneAndUpdate(
        { faculty_id: id },
        { account_status: false },
        { new: true, runValidators: true }
      );
      if (!faculty) {
        return next(new CustomError(404, "Faculty not found"));
      }
      return res
        .status(200)
        .json({ message: "Faculty soft deleted successfully", faculty });
    }
    if (type === "hard") {
      const faculty = await FacultyModel.findOneAndDelete({
        faculty_id: id,
      });
      if (!faculty) {
        return next(new CustomError(404, "Faculty not found"));
      }
      return res
        .status(200)
        .json({ message: "Faculty hard deleted successfully", faculty });
    }

    return res
      .status(400)
      .json({ message: "Invalid deletion type. Use 'soft' or 'hard'." });
  }
);

export default deleteFacultyController;
