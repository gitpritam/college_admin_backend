import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateEventID } from "./id/generateEventID";
import { IEvent } from "../../../@types/interface/schema/event.interface";
import EventModel from "../../../models/event.model";
import { start } from "repl";

const createEventController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      venue,
      posted_by,
    } = req.body;

    console.log(req.body);
    if (
      !(
        title &&
        description &&
        start_date &&
        end_date &&
        start_time &&
        end_time &&
        venue &&
        posted_by
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
      posted_by,
    };

    const newEvent = await EventModel.create(payload);

    if (!newEvent) {
      return next(new CustomError(400, "Failed to create Event"));
    }

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      result: newEvent,
    });
  }
);

export default createEventController;
