import { NextFunction, request, response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { id } from "zod/v4/locales/index.cjs";


const updateStudentController = AsyncHandler(
     async (req: Request, res: Response, next: NextFunction) => {
        const{id} req.params ;
        if (!id) {
            return next(new CustomError(400, "Student ID is required"));
        }
    }
)