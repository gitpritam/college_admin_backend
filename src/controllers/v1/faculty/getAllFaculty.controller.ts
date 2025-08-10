import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import FacultyModel from "../../../models/faculty.model";
import CustomError from "../../../utils/CustomError";
import { success } from "zod";

const getAllFacultyController = AsyncHandler(
    async(req:Request, res: Response, next: NextFunction)=>{
        const faculties = await FacultyModel.find();
          if (faculties.length === 0) { 
             return next(new CustomError(404, "No faculties found"));
          }
           return res.status(200).json({
            success: true,
            message: "Faculties fetched successfully",
             data: faculties,
           });
        }   
);
export default getAllFacultyController;