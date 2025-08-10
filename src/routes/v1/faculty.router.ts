import { Router } from "express";
import multer from "multer";
import { createFacultyController } from "../../controllers/v1/faculty";
import { validateRequest } from "../../middleware/validate.middleware";
import { facultyValidationSchema } from "../../validation/faculty.validation";
import { authenticate, authorize } from "../../middleware/auth.middleware";

const FacultyRouter = Router();
const upload = multer();
FacultyRouter.post(
  "/",
  upload.none(),
  authenticate,
  authorize(["admin", "staff"]),
  validateRequest(facultyValidationSchema),
  createFacultyController
);

export default FacultyRouter;
