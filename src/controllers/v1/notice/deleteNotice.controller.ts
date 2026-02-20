import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import NoticeModel from "../../../models/notice.model";
import CustomError from "../../../utils/CustomError";
import { activityLogger } from "../../../config/log.config";

const deleteNoticeController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;
    if (!id) {
      activityLogger.warn("Notice Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Notice id is required",
      });
      return next(new CustomError(400, "Notice id is required"));
    }

    const deletedNotice = await NoticeModel.findOneAndDelete({ notice_id: id });

    if (!deletedNotice) {
      activityLogger.warn("Notice Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Notice not found for ID ${id}`,
      });
      return next(new CustomError(404, "Notice not found"));
    }

    activityLogger.info("Notice Deleted", {
      user_id: user?._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Notice \"${deletedNotice.title}\" deleted with ID ${deletedNotice.notice_id}`,
    });
    return res.status(200).json({ message: "Notice deleted successfully" });
  },
);

export default deleteNoticeController;
