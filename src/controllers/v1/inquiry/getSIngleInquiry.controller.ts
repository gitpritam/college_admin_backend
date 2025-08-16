import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import InquiryModel from "../../../models/inquiry.model";

const getSingleInquiryController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; 

    if (!id) {
      return next(new CustomError(400, "Inquiry ID is required"));
    }

    const inquiry = await InquiryModel.findById(id).populate(
        "posted_by"
    );

    if (!inquiry) {
      return next(new CustomError(404, `No inquiry found with this id: ${id}`));
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry data found.",
      result: inquiry,
    });
  }
);

export default getSingleInquiryController;