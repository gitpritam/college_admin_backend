import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import NoticeModel from "../../../models/notice.model";

const getSingleNoticeController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Notice id is required"));
    }

    const notice = await NoticeModel.findOne({ notice_id: id });

    if (!notice) {
      return next(new CustomError(404, `No notice found with this id: ${id}`));
    }

    return res
      .status(200)
      .json({ success: true, message: "Notice data found.", result: notice });
  }
);

export default getSingleNoticeController;