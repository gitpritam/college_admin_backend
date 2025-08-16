import { Router } from "express";
import { createNoticeController } from "../../controllers/v1/notice";
import { validateRequest } from "../../middleware/validate.middleware";
import { noticeValidationSchema } from "../../validation/notice.validation";
import { authorize } from "../../middleware/auth.middleware";

const NoticeRouter = Router();

NoticeRouter.post(
  "/",
  authorize(["admin", "faculty"]),
  validateRequest(noticeValidationSchema),
  createNoticeController
);
