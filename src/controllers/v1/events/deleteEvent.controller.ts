import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import EventModel from "../../../models/event.model";
import { activityLogger } from "../../../config/log.config";

const deleteEventController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    if (!id) {
      activityLogger.warn("Event Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Event id is required",
      });
      return next(new CustomError(400, "Event id is required"));
    }

    const event = await EventModel.findOneAndDelete({
      event_id: id,
    });
    if (!event) {
      activityLogger.warn("Event Delete Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Event not found for ID ${id}`,
      });
      return next(new CustomError(404, "Event not found"));
    }

    activityLogger.info("Event Deleted", {
      user_id: user?._id,
      http_method: req.method,
      endpoint: req.originalUrl,
      message: `Event \"${event.title}\" deleted with ID ${event.event_id}`,
    });

    return res.status(200).json({ message: "Event deleted successfully" });
  }
);

export default deleteEventController;
