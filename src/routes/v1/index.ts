import { Router } from "express";
import StudentRouter from "./student.router";
import FacultyRouter from "./faculty.router";
import AuthRouter from "./auth.router";
import NoticeRouter from "./notice.router";
import { authenticate } from "../../middleware/auth.middleware";
import eventRouter from "./event.router";
import inquiryRouter from "./inquiry.router";

const RouterV1 = Router();

RouterV1.use("/students", authenticate, StudentRouter);
RouterV1.use("/faculty",authenticate, FacultyRouter);
RouterV1.use("/auth", AuthRouter);
RouterV1.use("/notice", authenticate, NoticeRouter);
RouterV1.use("/event", authenticate, eventRouter);
RouterV1.use("/inquiry", authenticate, inquiryRouter);
export default RouterV1;
