import { Router } from "express";
import multer from "multer";
import { createFacultyController } from "../../controllers/v1/faculty";

const FacultyRouter = Router();
const upload = multer();
FacultyRouter.post("/", upload.none(), createFacultyController);

export default FacultyRouter;
