import mongoose, { type Date } from "mongoose";
import type { IFaculty } from "../@types/interface/schema/faculty.interface";
import AddressSchema from "./address.schema";

const FacultySchema = new mongoose.Schema<IFaculty>(
  {
    fauclty_id: {
      type: String,
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
      minlength: [3, "Guardian name should be at least 3 characters"],
      maxlength: [200, "Guardian name should be at most 200 characters"],
    },
    qualification: {
       type: String,
      required: true,
      trim: true,
      minlength: [3, "Guardian name should be at least 3 characters"],
      maxlength: [200, "Guardian name should be at most 200 characters"],
    },
    experience: {
       type: String,
      required: true,
      trim: true,
      minlength: [3, "Guardian name should be at least 3 characters"],
      maxlength: [200, "Guardian name should be at most 200 characters"],
    },
    password:{
      type: String,
      trim: true,
      required: false,
    }, 
    roles: {
       type: String,
       enum: ['admin', 'faculty', 'stuff'],
       default: "staff",
       required: true,
      },
    notice_permisson: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const FacultyModel = mongoose.model<IFaculty>("teachers",  FacultySchema);

export default FacultyModel;