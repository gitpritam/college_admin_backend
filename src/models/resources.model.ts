import mongoose from "mongoose";
import type { IResource } from "../@types/interface/schema/resources.interface";
const ResourceSchema = new mongoose.Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Title should be minimun 3 characters"],
      maxlength: [100, "Title should be maximum 100 characters"],
      trim: true,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculties",
      required: true,
    },
    file_type: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
    },
    tags: {
      type: [String],
      trim: true,
    },
    visibility: {
      type: Boolean,
      trim: true,
      default: false,
    },
  },
  { timestamps: true }
);
const ResourceModel = mongoose.model<IResource>("resources", ResourceSchema);
export default ResourceModel;
