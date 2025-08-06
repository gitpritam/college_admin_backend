import { ObjectId } from "mongoose";

export interface IResource {
  title: string;
  uploaded_by: ObjectId;
  file_type: string;
  department: string;
  course: string;
  semester?: string;
  tags?: string[];
  visibility?: boolean;
}
