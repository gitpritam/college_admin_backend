import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import InquiryModel from "../../../models/inquiry.model";
import IInquiry from "../../../@types/interface/schema/inquiry.interface";
import { activityLogger } from "../../../config/log.config";


const createInquiryController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const {
      category,
      name,
      subject,
      description,
      phone_number,
      email,
      course,
    } = req.body;

    console.log(req.body);
    if (
      !(
        category &&
        name &&
        subject &&
        description &&
        phone_number &&
        email 
        //course 
      )
    ) {
      activityLogger.warn("Inquiry Create Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Required fields are missing",
      });
      return next(new CustomError(400, "Required fields are missing"));
    }


    const payload: IInquiry = {
     category,
     name,
     subject,
     description,
     phone_number,
     email,
     course,
    };

    const newInquiry = await InquiryModel.create(payload);

    if (!newInquiry) {
      activityLogger.warn("Inquiry Create Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Failed to create inquiry",
      });
      return next(new CustomError(400, "Failed to create Inquiry"));
    }

    activityLogger.info("Inquiry Created", {
      user_id: user?._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Inquiry created with ID ${newInquiry._id}`,
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry created successfully",
      result: newInquiry,
    });
  }
);

export default createInquiryController;
