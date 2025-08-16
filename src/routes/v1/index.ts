import { Router } from "express";
import StudentRouter from "./student.router";
import FacultyRouter from "./faculty.router";
import AuthRouter from "./auth.router";
import NoticeRouter from "./notice.router";

const RouterV1 = Router();

RouterV1.use("/students", StudentRouter);
RouterV1.use("/faculty", FacultyRouter);
RouterV1.use("/auth", AuthRouter);
RouterV1.use("/notice", NoticeRouter);
export default RouterV1;
