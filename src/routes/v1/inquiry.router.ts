 import { Router } from "express";
 import multer from "multer";
 import { authorize } from "../../middleware/auth.middleware";
 import { validateRequest } from "../../middleware/validate.middleware";
 import createInquiryController from "../../controllers/v1/inquiry/createInquiry.controller";
 import getAllInquiryController from "../../controllers/v1/inquiry/getAllInquriy.controller";
 import getSingleInquiryController from "../../controllers/v1/inquiry/getSIngleInquiry.controller";
 import updateInquiryController from "../../controllers/v1/inquiry/updateInquiry.controller";
import { inquiryValidationSchema } from "../../validation/inquiry.validation";

 const inquiryRouter = Router();
 const upload = multer();

inquiryRouter.post("/",authorize(["admin", "faculty"]),validateRequest(inquiryValidationSchema),createInquiryController);
inquiryRouter.get("/", getAllInquiryController);
inquiryRouter.get("/:id", getSingleInquiryController);
inquiryRouter.get("/", updateInquiryController);

export default inquiryRouter;