import { Router } from "express";
import {
  getAllNotificationsController,
  getSingleNotificationController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
} from "../../controllers/v1/notification";
import { authenticate, authorize } from "../../middleware/auth.middleware";

const notificationRouter = Router();

// Public routes (authenticated users)
notificationRouter.get("/", authenticate, getAllNotificationsController);

notificationRouter.patch("/read-all", authenticate, markAllAsReadController);

notificationRouter.get("/:id", authenticate, getSingleNotificationController);

notificationRouter.patch("/:id/read", authenticate, markAsReadController);

// Admin only routes (delete)
notificationRouter.delete("/:id", authenticate, deleteNotificationController);

export default notificationRouter;
