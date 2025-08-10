import mongoose from "mongoose";
import { rolesType } from "../../types/roles.type";

export interface IJWTPayload {
  _id: mongoose.Types.ObjectId;
  faculty_id: string;
  role: rolesType;
}
