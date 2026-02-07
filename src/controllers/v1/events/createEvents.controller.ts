import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateEventID } from "./id/generateEventID";
import { IEvent } from "../../../@types/interface/schema/event.interface";
import EventModel from "../../../models/event.model";
import NotificationModel from "../../../models/notification.model";
import { Types } from "mongoose";
import FacultyModel from "../../../models/faculty.model";
import { getIO } from "../../../config/socket.config";
import { INotification } from "../../../@types/interface/schema/notification.interface";

const createEventController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const io = getIO();
    const {
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      venue,
    } = req.body;
    const { user } = req;
    console.log(req.body);

    const faculty = await FacultyModel.findById(user?._id);
    if (!faculty?.event_permission) {
      return next(
        new CustomError(403, "You do not have permission to create a event"),
      );
    }
    if (
      !(
        title &&
        description &&
        start_date &&
        end_date &&
        start_time &&
        end_time &&
        venue
      )
    ) {
      return next(new CustomError(400, "Required fields are missing"));
    }

    const ID = await generateEventID();

    const payload: IEvent = {
      event_id: ID,
      title,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      start_time,
      end_time,
      venue,
      posted_by: user?._id as Types.ObjectId,
    };

    const newEvent = await EventModel.create(payload);

    if (!newEvent) {
      return next(new CustomError(400, "Failed to create Event"));
    }

    // Create notification in database
    const notificationPayload: Partial<INotification> = {
      type: "event",
      title: `New Event: ${newEvent.title}`,
      message: newEvent.description,
      timestamp: new Date(),
      read: false,
      priority: "high",
      metadata: {
        eventId: newEvent._id?.toString(),
        link: `/events/${newEvent.event_id}`,
      },
    };

    const newNotification = await NotificationModel.create(notificationPayload);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      result: newEvent,
    });

    // Emit real-time notification via WebSocket
    if (newNotification) {
      io.emit("event:new", {
        _id: newNotification._id,
        ...notificationPayload,
      });
    }
  },
);

export default createEventController;
