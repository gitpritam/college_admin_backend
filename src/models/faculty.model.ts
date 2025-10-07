import mongoose from "mongoose";
import type { IFaculty } from "../@types/interface/schema/faculty.interface";
import AddressSchema from "./address.schema";
import { rolesType } from "../@types/types/roles.type";

const roles: rolesType[] = ["admin", "faculty", "staff", "guest"];

const FacultySchema = new mongoose.Schema<IFaculty>(
  {
    faculty_id: {
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

    designation: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Designation should be at least 3 characters"],
      maxlength: [200, "Designation should be at most 200 characters"],
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Qualification should be at least 3 characters"],
      maxlength: [200, "Qualification should be at most 200 characters"],
    },
    experience: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Experience  should be at least 1 characters"],
      maxlength: [50, "Experience should be at most 50 characters"],
    },
    password: {
      type: String,
      trim: true,
      required: false,
    },
    role: {
      type: String,
      enum: roles,
      default: "staff",
    },
    joining_date: {
      type: Date,
      required: true,
    },
    notice_permission: {
      type: Boolean,
      default: false,
    },
    event_permission: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Department should be at least 2 characters"],
      maxlength: [50, "Department should be at most 50 characters"],
    },
    profile_picture_url: {
      type: String,
    },
    account_status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FacultyModel = mongoose.model<IFaculty>("faculties", FacultySchema);

export default FacultyModel;
