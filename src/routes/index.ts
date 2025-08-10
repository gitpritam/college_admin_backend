import { Router } from "express";
import RouterV1 from "./v1";
import { authenticate } from "../middleware/auth.middleware";

const MainRouter = Router();

//v1
MainRouter.use("/v1", authenticate, RouterV1); // localhost:5000/api/v1

//v2
// MainRouter.use("/v2", v2Router);
//v2

export default MainRouter;
