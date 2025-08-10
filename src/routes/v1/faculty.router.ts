import { Router } from "express";
import multer from "multer";
import {
  createFacultyController,
  getAllFacultyController,
  getSingleFacultyController,
  updateFacultyController,
  updatePermissionController,
} from "../../controllers/v1/faculty";
import { validateRequest } from "../../middleware/validate.middleware";
import { facultyValidationSchema } from "../../validation/faculty.validation";
import { authorize } from "../../middleware/auth.middleware";
import deleteFacultyController from "../../controllers/v1/faculty/deleteFaculty.controller";

const FacultyRouter = Router();
const upload = multer();

FacultyRouter.get("/", getAllFacultyController);
FacultyRouter.get("/:id", getSingleFacultyController);

FacultyRouter.post(
  "/",
  upload.none(),
  authorize(["admin", "staff"]),
  validateRequest(facultyValidationSchema),
  createFacultyController
);

FacultyRouter.patch("/:id", authorize(["admin"]), updateFacultyController);

//faculty/permission/:id
FacultyRouter.patch(
  "/permission/:id",
  authorize(["admin"]),
  updatePermissionController
);

FacultyRouter.delete("/:id", authorize(["admin"]), deleteFacultyController);

export default FacultyRouter;
