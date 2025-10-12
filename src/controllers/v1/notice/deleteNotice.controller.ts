import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import NoticeModel from "../../../models/notice.model";
import CustomError from "../../../utils/CustomError";

const deleteNoticeController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
     if (!id) {
      return next(new CustomError(400, "Notice id is required"));
    }

    await NoticeModel.findOneAndDelete({notice_id:id});
    return res.status(200).json({message: "Notice deleted successfully"});
  }
);

export default deleteNoticeController;
