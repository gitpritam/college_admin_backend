import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import EventModel from "../../../models/event.model";
import CustomError from "../../../utils/CustomError";

const getAllEventController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query = "", page = 1, limit = 10 } = req.query;

    const pageNumber = (page && parseInt(page as string)) || 1;
    const limitNumber = (limit && parseInt(limit as string)) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let filter = {};
    if ((query as string).trim()) {
      const regex = new RegExp(query as string, "i");
      filter = {
        $or: [{ title: regex }, { event_id: regex }, { start_date: regex }],
      };
    }

    const eventData = await EventModel.find( filter )
      .skip(skip)
      .limit(limitNumber);

    if (eventData.length === 0 || !eventData) {
      return next(new CustomError(404, "No event found."));
    }

    const totalCount = await EventModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Event data found",
      result: {
        data: eventData,
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        limit: limitNumber,
      },
    });
  }
);

export default getAllEventController;
