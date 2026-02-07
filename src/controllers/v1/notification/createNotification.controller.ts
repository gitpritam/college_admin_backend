import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import NotificationModel from "../../../models/notification.model";
import { INotification } from "../../../@types/interface/schema/notification.interface";
import FacultyModel from "../../../models/faculty.model";

const createNotificationController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, title, message, priority, metadata } = req.body;
    const { user } = req;

    // Check if faculty has permission (optional check based on your permission system)
    const faculty = await FacultyModel.findById(user?._id);
    if (!faculty?.notice_permission && !faculty?.event_permission) {
      return next(
        new CustomError(
          403,
          "You do not have permission to create a notification",
        ),
      );
    }

    if (!(type && title && message)) {
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
      return next(new CustomError(400, "Failed to create notification"));
    }

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      result: newNotification,
    });
  },
);

export default createNotificationController;
