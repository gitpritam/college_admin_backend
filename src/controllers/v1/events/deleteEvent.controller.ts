import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import EventModel from "../../../models/event.model";

const deleteEventController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const event = await EventModel.findOneAndDelete({
      event_id: id,
    });
    if (!event) {
      return next(new CustomError(404, "Event not found"));
    }
    return res.status(200).json({ message: "Event deleted successfully" });
  }
);

export default deleteEventController;
