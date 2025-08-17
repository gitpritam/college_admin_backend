import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import NoticeModel from "../../../models/notice.model";
import CustomError from "../../../utils/CustomError";

const getAllNoticeController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = (page && parseInt(page as string)) || 1;
    const limitNumber = (limit && parseInt(limit as string)) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let filter = {};
    if ((query as string).trim()) {
      const regex = new RegExp(query as string, "i");
      filter = {
        $or: [{ title: regex }, { notice_id: regex }, { year: regex }],
      };
    }

    const noticeData = await NoticeModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    if (noticeData.length === 0 || !noticeData) {
      return next(new CustomError(404, "No notice found."));
    }

    const totalCount = await NoticeModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Notice data found",
      result: {
        data: noticeData,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        limit: limitNumber,
      },
    });
  }
);

export default getAllNoticeController;
