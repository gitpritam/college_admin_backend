import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import NotificationModel from "../../../models/notification.model";
import UserNotificationStateModel from "../../../models/userNotificationState.model";

const markAllAsReadController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    // Determine userType based on faculty_id presence in JWT payload
    const userType = user?.faculty_id ? "faculty" : "student";

    // Get all notifications
    const allNotifications = await NotificationModel.find({}).select("_id");

    if (!allNotifications || allNotifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No notifications to mark as read",
      });
    }

    const notificationIds = allNotifications.map((n) => n._id);

    // Get existing states for this user
    const existingStates = await UserNotificationStateModel.find({
      userId: user?._id,
      notificationId: { $in: notificationIds },
    });

    const existingStateMap = new Map(
      existingStates.map((state) => [state.notificationId.toString(), state]),
    );

    // Prepare bulk operations
    const bulkOps = [];
    const currentDate = new Date();

    for (const notificationId of notificationIds) {
      const existingState = existingStateMap.get(notificationId.toString());

      if (existingState) {
        // Update if not already read
        if (!existingState.read) {
          bulkOps.push({
            updateOne: {
              filter: { _id: existingState._id },
              update: { $set: { read: true, readAt: currentDate } },
            },
          });
        }
      } else {
        // Create new state
        bulkOps.push({
          insertOne: {
            document: {
              userId: user?._id,
              userType,
              notificationId,
              read: true,
              readAt: currentDate,
            },
          },
        });
      }
    }

    // Execute bulk operations if any
    if (bulkOps.length > 0) {
      await UserNotificationStateModel.bulkWrite(bulkOps);
    }

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      result: {
        markedCount: bulkOps.length,
      },
    });
  },
);

export default markAllAsReadController;
