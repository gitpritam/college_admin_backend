import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import InquiryModel from "../../../models/inquiry.model";
import IInquiry from "../../../@types/interface/schema/inquiry.interface";

const updateInquiryController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Inquiry ID is required"));
    }

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

    const payload: Partial<IInquiry> = {};
    if (category) payload.category = category;
    if (name) payload.name = name;
    if (subject) payload.subject = subject;
    if (description) payload.description = description;
    if (phone_number) payload.phone_number = phone_number;
    if (email) payload.email = email;
    if (course) payload.course = course;

    const updatedInquiry = await InquiryModel.findOneAndUpdate(
      { inquiry_id: id },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (updatedInquiry) {
      return next(new CustomError(404, "Failed to update inquiry"));
    }

    return res.status(200).json({
      success: true,
      message: "inquiry updated successfully",
      result: updatedInquiry,
    });
  }
);
export default updateInquiryController;
