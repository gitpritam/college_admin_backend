import { Router } from "express";
import StudentRouter from "./student.router";
import FacultyRouter from "./faculty.router";
import AuthRouter from "./auth.router";

const RouterV1 = Router();

RouterV1.use("/students", StudentRouter);
RouterV1.use("/faculty", FacultyRouter);
RouterV1.use("/auth", AuthRouter);
export default RouterV1;
