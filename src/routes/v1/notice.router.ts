import { Router } from "express";
import { createNoticeController } from "../../controllers/v1/notice";
import { validateRequest } from "../../middleware/validate.middleware";
import { noticeValidationSchema } from "../../validation/notice.validation";
import { authorize } from "../../middleware/auth.middleware";
import deleteNoticeController from "../../controllers/v1/notice/deleteNotice.controller";
import getAllNoticeController from "../../controllers/v1/notice/getAllNotice.controller";
import getSingleNoticeController from "../../controllers/v1/notice/getSingleNotice.controller";
import multer from "multer";

const NoticeRouter = Router();
const upload = multer();

NoticeRouter.post(
  "/",
  authorize(["admin", "faculty"]),
  validateRequest(noticeValidationSchema),
  createNoticeController
);

NoticeRouter.get("/", getAllNoticeController);
NoticeRouter.get("/:id", getSingleNoticeController);
NoticeRouter.delete("/:id", authorize(["admin","faculty"]), deleteNoticeController);
export default NoticeRouter;
