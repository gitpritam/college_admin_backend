import mongoose, { type Date } from "mongoose";
import type { IStudent } from "../@types/interface/schema/student.interface";
import AddressSchema from "./address.schema";

const StudentSchema = new mongoose.Schema<IStudent>(
  {
    student_id: {
      type: String,
      //STCET20242025AIML001
      unique: true,
    },
    first_name: {
      type: String,
      minlength: [3, "First name should be at least 3 characters"],
      maxlength: [20, "First name should be at most 20 characters"],
      required: true,
      trim: true,
    },
    middle_name: {
      type: String,
      minlength: [3, "Middle name should be at least 3 characters"],
      maxlength: [20, "Middle name should be at most 20 characters"],
      required: false,
      trim: true,
    },
    last_name: {
      type: String,
      minlength: [3, "Last name should be at least 3 characters"],
      maxlength: [20, "Last name should be at most 20 characters"],
      required: true,
      trim: true,
    },
    registration_number: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
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
      unique: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    current_address: {
      type: AddressSchema,
      required: true,
    },
    permanent_address: {
      type: AddressSchema,
      required: true,
    },

    guardian_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Guardian name should be at least 3 characters"],
      maxlength: [100, "Guardian name should be at most 100 characters"],
    },
    guardian_phone_number: {
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
    guardian_email: {
      type: String,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    year_of_admission: {
      type: Number,
      required: true,
      min: [1900, "Year of admission cannot be before 1900"],
      max: [
        new Date().getFullYear(),
        "Year of admission cannot be in the future",
      ],
    },
    year_of_passing: {
      type: Number,
      min: [1900, "Year of passing cannot be before 1900"],
      max: [
        new Date().getFullYear() + 10,
        "Year of passing cannot be more than 10 years in the future",
      ],
    },
  },
  { timestamps: true }
);

const StudentModel = mongoose.model<IStudent>("students", StudentSchema);

export default StudentModel;
