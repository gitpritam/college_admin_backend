import { Router } from "express";
import createFacultyController from "../../controllers/v1/faculty/createFaculty.controller";
import multer from "multer";

const FacultyRouter = Router();
const upload = multer();
FacultyRouter.post("/", upload.none(), createFacultyController);

export default FacultyRouter;
