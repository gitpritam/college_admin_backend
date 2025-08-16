import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import EventModel from "../../../models/event.model";

const getSingleEventController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Event id is required"));
    }

    const event = await EventModel.findOne({ event_id: id }).populate(
      "posted_by"
    );

    if (!event) {
      return next(new CustomError(404, `No event found with this id: ${id}`));
    }

    return res
      .status(200)
      .json({ success: true, message: "Event data found.", result: event });
  }
);

export default getSingleEventController;
