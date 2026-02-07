import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import NotificationModel from "../../../models/notification.model";
import UserNotificationStateModel from "../../../models/userNotificationState.model";

const getAllNotificationsController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      query = "",
      page = 1,
      limit = 10,
      type,
      priority,
      unreadOnly,
    } = req.query;
    const { user } = req;

    const pageNumber = (page && parseInt(page as string)) || 1;
    const limitNumber = (limit && parseInt(limit as string)) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let filter: any = {};

    // Search filter
    if ((query as string).trim()) {
      const regex = new RegExp(query as string, "i");
      filter = {
        $or: [{ title: regex }, { message: regex }],
      };
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Get all notifications
    const notifications = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    if (!notifications || notifications.length === 0) {
      return next(new CustomError(404, "No notifications found."));
    }

    // Get user's read states for these notifications
    const notificationIds = notifications.map((n) => n._id);
    const userStates = await UserNotificationStateModel.find({
      userId: user?._id,
      notificationId: { $in: notificationIds },
    }).lean();

    // Create a map for quick lookup
    const stateMap = new Map(
      userStates.map((state) => [state.notificationId.toString(), state]),
    );

    // Merge notification data with user's read state
    let notificationsWithState = notifications.map((notification) => {
      const state = stateMap.get(notification._id.toString());
      return {
        ...notification,
        read: state?.read || false,
        readAt: state?.readAt || null,
      };
    });

    // Filter unread only if requested
    if (unreadOnly === "true") {
      notificationsWithState = notificationsWithState.filter((n) => !n.read);
    }

    const totalCount = await NotificationModel.countDocuments(filter);
    const unreadCount = await NotificationModel.countDocuments({
      ...filter,
      _id: {
        $nin: userStates
          .filter((state) => state.read)
          .map((state) => state.notificationId),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      result: {
        data:
          unreadOnly === "true"
            ? notificationsWithState
            : notificationsWithState,
        totalCount:
          unreadOnly === "true" ? notificationsWithState.length : totalCount,
        unreadCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(
          (unreadOnly === "true" ? notificationsWithState.length : totalCount) /
            limitNumber,
        ),
        limit: limitNumber,
      },
    });
  },
);

export default getAllNotificationsController;
