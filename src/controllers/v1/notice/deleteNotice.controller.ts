import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import NoticeModel from "../../../models/notice.model";
import CustomError from "../../../utils/CustomError";

const deleteNoticeController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { type } = req.query;

    if (type === "soft") {
      const notice = await NoticeModel.findOneAndUpdate(
        { notice_id: id },
        { year: false },
        { new: true, runValidators: true }
      );
      if (!notice) {
        return next(new CustomError(404, "Notice not found"));
      }
      return res
        .status(200)
        .json({ message: "Notice soft deleted successfully", notice });
    }
    if (type === "hard") {
      const notice = await NoticeModel.findOneAndDelete({
        notice_id: id,
      });
      if (!notice) {
        return next(new CustomError(404, "Notice not found"));
      }
      return res
        .status(200)
        .json({ message: "Notice hard deleted successfully", notice });
    }

    return res
      .status(400)
      .json({ message: "Invalid deletion type. Use 'soft' or 'hard'." });
  }
);

export default deleteNoticeController;
