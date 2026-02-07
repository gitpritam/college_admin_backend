import type { Types } from "mongoose";

export interface IUserNotificationState {
  userId: Types.ObjectId;
  userType: "student" | "faculty";
  notificationId: Types.ObjectId;
  read: boolean;
  readAt?: Date;
}
