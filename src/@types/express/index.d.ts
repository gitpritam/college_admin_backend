import mongoose from "mongoose";
import { rolesType } from "../types/roles.type";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: mongoose.Types.ObjectId;
        faculty_id: string;
        role: rolesType;
      };
    }
  }
}
