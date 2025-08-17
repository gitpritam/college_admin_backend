import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import InquiryModel, { category } from "../../../models/inquiry.model";
import CustomError from "../../../utils/CustomError";

const getAllInquiryController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = (page && parseInt(page as string)) || 1;
    const limitNumber = (limit && parseInt(limit as string)) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let filter = {};
    if ((query as string).trim()) {
      const regex = new RegExp(query as string, "i");
      filter = {
        $or: [{ category: regex }, { course: regex }, { email: regex }],
      };
    }

    const InquiryData = await InquiryModel.find(filter)
      .skip(skip)
      .limit(limitNumber);

    if (InquiryData.length === 0 || !InquiryData) {
      return next(new CustomError(404, "No Inquiry found."));
    }

    const totalCount = await InquiryModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Inquiry data found",
      result: {
        data: InquiryData,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        limit: limitNumber,
      },
    });
  }
);

export default getAllInquiryController;
