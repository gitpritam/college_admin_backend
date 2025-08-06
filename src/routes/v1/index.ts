import { Router } from "express";
import StudentRouter from "./student.router";

const RouterV1 = Router();

RouterV1.use("/students", StudentRouter);
// RouterV1.use('/faculty', FacultyRouter);

export default RouterV1;
