import { Router } from "express";
import getDashboardStatsController from "../../controllers/v1/dashboard/getDashboardStats.controller";
import { authorize } from "../../middleware/auth.middleware";

const DashboardRouter = Router();

DashboardRouter.get("/stats", authorize(["admin", "faculty"]), getDashboardStatsController);

export default DashboardRouter;
