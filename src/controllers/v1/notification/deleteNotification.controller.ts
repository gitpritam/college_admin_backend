import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import NotificationModel from "../../../models/notification.model";
import UserNotificationStateModel from "../../../models/userNotificationState.model";
import mongoose from "mongoose";
import { activityLogger } from "../../../config/log.config";

const deleteNotificationController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    if (!id) {
      activityLogger.warn("Notification Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Notification id is required",
      });
      return next(new CustomError(400, "Notification id is required"));
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      activityLogger.warn("Notification Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Invalid notification id ${id}`,
      });
      return next(new CustomError(400, "Invalid notification id"));
    }

    // Delete the notification
    const notification = await NotificationModel.findByIdAndDelete(id);

    if (!notification) {
      activityLogger.warn("Notification Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Notification not found for ID ${id}`,
      });
      return next(new CustomError(404, "Notification not found"));
    }

    // Delete all associated user notification states
    await UserNotificationStateModel.deleteMany({ notificationId: id });

    activityLogger.info("Notification Deleted", {
      user_id: user?._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Notification \"${notification.title}\" deleted with ID ${notification._id}`,
    });

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  },
);

export default deleteNotificationController;
