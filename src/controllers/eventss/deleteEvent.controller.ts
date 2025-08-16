import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/AsyncHandler";
import EventModel from "../../models/event.model";
import CustomError from "../../utils/CustomError";

const deleteEventController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { type } = req.query;

    if (type === "soft") {
      const notice = await EventModel.findOneAndUpdate(
        { event_id: id },
        { title: false },
        { new: true, runValidators: true }
      );
      if (!Event) {
        return next(new CustomError(404, "Event not found"));
      }
      return res
        .status(200)
        .json({ message: "Event soft deleted successfully", Event });
    }
    if (type === "hard") {
      const notice = await EventModel.findOneAndDelete({
        event_id: id,
      });
      if (Event) {
        return next(new CustomError(404, "Event not found"));
      }
      return res
        .status(200)
        .json({ message: "Event hard deleted successfully", Event });
    }

    return res
      .status(400)
      .json({ message: "Invalid deletion type. Use 'soft' or 'hard'." });
  }
);

export default deleteEventController;
