import mongoose from "mongoose";
import type { IStudent } from "../@types/interface/schema/student.interface";
import AddressSchema from "./address.schema";
import { match } from "assert";
import { required } from "zod/v4/core/util.cjs";
import { type } from "os";
import { datetime } from "zod/v4/core/regexes.cjs";
import { date, number } from "zod";
import { string } from "zod/v4/classic/coerce.cjs";

const regex = /^[A-Z]{2}\d{4}$/;
const studentSchema = new mongoose.Schema<IStudent>(
  {
    student_id: {
      type: String,
      unique: true,
    },
    first_name: {
      type: String,
      minlength: [2, "First name should be at least 2 characters"],
      maxlength: [20, "First name should be at most 20 characters"],
      required: true,
      trim: true,
    },
    middle_name: {
      type: String,
      maxlength: [20, "Middle name should be at most 20 characters"],
      required: false,
      trim: true,
    },
    last_name: {
      type: String,
      minlength: [2, "Last name should be at least 2 characters"],
      maxlength: [20, "Last name should be at most 20 characters"],
      required: true,
      trim: true,
    },
    registration_no: {
      type: String,
      match: [regex, "Invalid registration number format"],
    },
    roll_no: {
      type: Number,
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
    guardian_name: {
      type: String,
      required: true,
    },
    guardian_phone_number: {
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
    guardian_email: {
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

    department: {
      type: String,
      required: true,
      minlength: [2, "Department should be at least 2 characters"],
      maxlength: [5, "Department should be at most 5 characters"],
    },

    year_of_admission: {
      type: Number,
      required: true,
    },

    year_of_passing: {
      type: Number,
    },

    passport_photo_url: {
      type: String,
    },
    remark: {
      type: String,
      maxlength: [200, "Remark should be at most 200 characters"],
    },
  },

  { timestamps: true }
);

const StudentModel = mongoose.model<IStudent>("students", studentSchema);

export default StudentModel;
