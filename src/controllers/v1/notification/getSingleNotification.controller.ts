import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import NotificationModel from "../../../models/notification.model";
import UserNotificationStateModel from "../../../models/userNotificationState.model";
import mongoose from "mongoose";

const getSingleNotificationController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { user } = req;

    if (!id) {
      return next(new CustomError(400, "Notification id is required"));
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new CustomError(400, "Invalid notification id"));
    }

    const notification = await NotificationModel.findById(id).lean();

    if (!notification) {
      return next(
        new CustomError(404, `No notification found with this id: ${id}`),
      );
    }

    // Determine userType based on faculty_id presence in JWT payload
    const userType = user?.faculty_id ? "faculty" : "student";

    // Create or update userNotificationState when user opens notification
    const existingState = await UserNotificationStateModel.findOne({
      userId: user?._id,
      notificationId: id,
    });

    if (existingState) {
      // Update existing state to mark as read
      if (!existingState.read) {
        existingState.read = true;
        existingState.readAt = new Date();
        await existingState.save();
      }
    } else {
      // Create new state marking as read
      await UserNotificationStateModel.create({
        userId: user?._id,
        userType,
        notificationId: id,
        read: true,
        readAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      result: {
        ...notification,
        read: true,
        readAt: new Date(),
      },
    });
  },
);

export default getSingleNotificationController;
