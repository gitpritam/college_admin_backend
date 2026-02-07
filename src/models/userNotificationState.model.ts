import mongoose from "mongoose";
import type { IUserNotificationState } from "../@types/interface/schema/userNotificationState.interface";

const UserNotificationStateSchema = new mongoose.Schema<IUserNotificationState>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },
    userType: {
      type: String,
      enum: ["student", "faculty"],
      required: true,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notifications",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Compound index to ensure one record per user per notification
UserNotificationStateSchema.index(
  { userId: 1, notificationId: 1 },
  { unique: true },
);

// Index for querying unread notifications for a user
UserNotificationStateSchema.index({ userId: 1, read: 1 });

const UserNotificationStateModel = mongoose.model<IUserNotificationState>(
  "UserNotificationStates",
  UserNotificationStateSchema,
);

export default UserNotificationStateModel;
