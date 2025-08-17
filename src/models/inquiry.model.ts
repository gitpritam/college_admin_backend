import mongoose from "mongoose";
import IInquiry from "../@types/interface/schema/inquiry.interface";
import { InquiryCategoryTypes } from "../@types/types/inquiryTypes.type";

export const category: InquiryCategoryTypes[] = [
  "general",
  "exam",
  "placement",
  "admission",
  "others",
];

const InquirySchema = new mongoose.Schema<IInquiry>(
  {
    category: {
      type: String,
      required: true,
      enum: category,
      default: "general",
    },
    name: {
      type: String,
      required: true,
      minlength: [3, "Name should be minimum 3 characters"],
      maxlength: [50, "Name should be maximum 50 characters"],
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      minlength: [3, "Subject should be minimum 3 characters"],
      maxlength: [100, "Subject should be maximum 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [10, "Description should be minimum 10 characters"],
      maxlength: [500, "Description should be maximum 500 characters"],
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      validate: {
        validator: function (i: string) {
          return /^\+?[1-9]\d{1,14}$/.test(i);
        },
        message: function (props: any) {
          return `${props.value} is not a valid phone number!`;
        },
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    course: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const InquiryModel = mongoose.model<IInquiry>("inquiries", InquirySchema);
export default InquiryModel;
