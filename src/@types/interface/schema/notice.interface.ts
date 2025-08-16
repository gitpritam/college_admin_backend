import { Types } from "mongoose";

export interface INotice {
  notice_id: string;
  title: string;
  description: string;
  year: number;
  posted_by: Types.ObjectId;
}
