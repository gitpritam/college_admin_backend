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
import updateStudentProfilePhotoController from "../../controllers/v1/student/updateprofilePhoto.controller";

const StudentRouter = Router();
const upload = multer();

StudentRouter.get("/", getAllStudentController);
StudentRouter.post(
  "/",
  upload.single("passport"),
  authorize(["admin", "faculty"]),
  validateRequest(studentValidationSchema),
  createStudentController
);
StudentRouter.get("/:id", getSingleStudentController);
StudentRouter.patch("/:id", updateStudentController);
StudentRouter.patch(
  "/passport/:id",
  upload.single("passport"),
  updateStudentProfilePhotoController
);
StudentRouter.delete(
  "/:id",
  authorize(["admin", "faculty"]),
  deleteStudentController
);

export default StudentRouter;
