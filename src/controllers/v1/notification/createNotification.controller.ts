import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import NotificationModel from "../../../models/notification.model";
import { INotification } from "../../../@types/interface/schema/notification.interface";
import FacultyModel from "../../../models/faculty.model";
import { activityLogger } from "../../../config/log.config";

const createNotificationController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, title, message, priority, metadata } = req.body;
    const { user } = req;

    // Check if faculty has permission (optional check based on your permission system)
    const faculty = await FacultyModel.findById(user?._id);
    if (!faculty?.notice_permission && !faculty?.event_permission) {
      activityLogger.warn("Notification Create Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Permission denied for creating notification",
      });
      return next(
        new CustomError(
          403,
          "You do not have permission to create a notification",
        ),
      );
    }

    if (!(type && title && message)) {
      activityLogger.warn("Notification Create Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Required fields are missing",
      });
      return next(new CustomError(400, "Required fields are missing"));
    }

    const payload: Partial<INotification> = {
      type,
      title,
      message,
      priority: priority || "medium",
      metadata: metadata || {},
      timestamp: new Date(),
      read: false,
    };

    const newNotification = await NotificationModel.create(payload);

    if (!newNotification) {
      activityLogger.warn("Notification Create Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Failed to create notification",
      });
      return next(new CustomError(400, "Failed to create notification"));
    }

    activityLogger.info("Notification Created", {
      user_id: user?._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Notification \"${newNotification.title}\" created with ID ${newNotification._id}`,
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      result: newNotification,
    });
  },
);

export default createNotificationController;
