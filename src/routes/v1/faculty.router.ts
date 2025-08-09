import { Router } from "express";
import multer from "multer";
import { createFacultyController } from "../../controllers/v1/faculty";
import { validateRequest } from "../../middleware/validate.middleware";
import { facultyValidationSchema } from "../../validation/faculty.validation";

const FacultyRouter = Router();
const upload = multer();
FacultyRouter.post(
  "/",
  upload.none(),
  // authenticate(),
  // authorize(["admin"]),
  validateRequest(facultyValidationSchema),
  createFacultyController
);

export default FacultyRouter;
