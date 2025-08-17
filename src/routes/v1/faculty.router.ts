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
import storage from "../../config/multer.config";

const FacultyRouter = Router();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 0.5 * 1024 * 1024 }, // 500 kb
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpg", "image/jpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg .jpeg files are allowed"));
    }
  },
});

FacultyRouter.get("/", getAllFacultyController);
FacultyRouter.get("/:id", getSingleFacultyController);

FacultyRouter.post(
  "/",
  upload.single("profile_picture"),
  // authorize(["admin","faculty", "staff"]),
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
