import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import InquiryModel from "../../../models/inquiry.model";
import IInquiry from "../../../@types/interface/schema/inquiry.interface";


const createInquiryController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new CustomError(400, "Failed to create Inquiry"));
    }

    return res.status(201).json({
      success: true,
      message: "Inquiry created successfully",
      result: newInquiry,
    });
  }
);

export default createInquiryController;
