import mongoose from "mongoose";
import type { INotification } from "../@types/interface/schema/notification.interface";

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["notice", "event", "announcement", "alert"],
      required: true,
    },
    title: {
      type: String,
      minlength: [3, "Title should be minimum 3 characters"],
      maxlength: [100, "Title should be maximum 100 characters"],
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      minlength: [3, "Message should be minimum 3 characters"],
      maxlength: [500, "Message should be maximum 500 characters"],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

NotificationSchema.index({ createdAt: -1 });

const NotificationModel = mongoose.model<INotification>(
  "Notifications",
  NotificationSchema,
);

export default NotificationModel;
