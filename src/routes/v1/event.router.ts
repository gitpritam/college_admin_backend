import { Router } from "express";
import createEventController from "../../controllers/v1/events/createEvents.controller";
import deleteEventController from "../../controllers/v1/events/deleteEvent.controller";
import getAllEventController from "../../controllers/v1/events/getAllEvents.controller";
import getSingleEventController from "../../controllers/v1/events/getSingleEvent.controller";
import { eventValidationSchema } from "../../validation/event.validation";
import { validateRequest } from "../../middleware/validate.middleware";
import { authorize } from "../../middleware/auth.middleware";
import multer from "multer";

const eventRouter = Router();
const upload = multer();

eventRouter.post("/",authorize(["admin", "faculty"]),validateRequest(eventValidationSchema),createEventController);
eventRouter.get("/", getAllEventController);
eventRouter.get("/:id", getSingleEventController);
eventRouter.delete("/:id", authorize(["admin","faculty"]), deleteEventController);

export default eventRouter;
