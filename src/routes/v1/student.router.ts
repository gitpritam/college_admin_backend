import { Router } from "express";
import getAllStudentController from "../../controllers/v1/student/getAllStudent.controller";

const StudentRouter = Router();

StudentRouter.get("/", getAllStudentController);

export default StudentRouter;
