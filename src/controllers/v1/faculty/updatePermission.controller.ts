import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import FacultyModel from "../../../models/faculty.model";

const updatePermissionController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { notice_permission, event_permission } = req.body;
    if (!id) {
      return next(new CustomError(400, "Faculty id is required"));
    }
    if (
      typeof notice_permission !== "boolean" ||
      typeof event_permission !== "boolean"
    ) {
      return next(new CustomError(400, "Permissions must be boolean values"));
    }

    let payload: {
      notice_permission?: boolean;
      event_permission?: boolean;
    } = {};
    if (notice_permission) payload.notice_permission = notice_permission;
    if (event_permission) payload.event_permission = event_permission;

    const updatedFaculty = await FacultyModel.findOneAndUpdate(
      { faculty_id: id },
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -__v");

    if (!updatedFaculty) {
      return next(new CustomError(404, `No faculty found with this id: ${id}`));
    }

    return res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      result: updatedFaculty,
    });
  }
);

export default updatePermissionController;
