import { Router } from "express";
import multer from "multer";
import getAllStudentController from "../../controllers/v1/student/getAllStudent.controller";
import createStudentController from "../../controllers/v1/student/createStudent.controller";
import deleteStudentController from "../../controllers/v1/student/deteleStudent.controller";
import getSingleStudentController from "../../controllers/v1/student/getSingleStudent.controller";
import updateStudentController from "../../controllers/v1/student/updateStudent.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import { authorize } from "../../middleware/auth.middleware";
import { studentValidationSchema } from "../../validation/student.validation";


const StudentRouter = Router();

StudentRouter.get("/", getAllStudentController);
StudentRouter.post("/",authorize(["admin", "faculty"]),validateRequest(studentValidationSchema),createStudentController);
StudentRouter.get("/:id",authorize(["admin","faculty"]),deleteStudentController);
StudentRouter.get("/:id", getSingleStudentController);
StudentRouter.get("/", updateStudentController);

export default StudentRouter;
