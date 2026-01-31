import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateNoticeID } from "./id/generateNoticeID";
import { INotice } from "../../../@types/interface/schema/notice.interface";
import NoticeModel from "../../../models/notice.model";
import FacultyModel from "../../../models/faculty.model";
import { Types } from "mongoose";
import { getIO } from "../../../config/socket.config";
import { INotification } from "../../../@types/interface/schema/notification.interface";

const createNoticeController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const io = getIO();
    const { title, description, year } = req.body;
    const { user } = req;

    const faculty = await FacultyModel.findById(user?._id);
    if (!faculty?.notice_permission) {
      return next(
        new CustomError(403, "You do not have permission to create a notice"),
      );
    }

    if (!(title && description && year)) {
      return next(new CustomError(400, "Required fields are missing"));
    }

    const ID = await generateNoticeID(year);

    const payload: INotice = {
      notice_id: ID,
      title,
      description,
      year,
      posted_by: user?._id as Types.ObjectId,
    };

    const newNotice = await NoticeModel.create(payload);

    if (!newNotice) {
      return next(new CustomError(400, "Failed to create Notice"));
    }

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      result: newNotice,
    });

    const notificationPayload: INotification = {
      id: newNotice.notice_id,
      type: "notice",
      title: `New Notice: ${newNotice.title}`,
      message: newNotice.description,
      timestamp: new Date(),
      read: false,
      metadata: {
        noticeId: newNotice.notice_id,
      },
    };

    io.emit("notice:new", notificationPayload);
  },
);

export default createNoticeController;
