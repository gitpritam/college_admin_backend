import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateStudentID } from "./id/generateStudentID";
import { IStudent } from "../../../@types/interface/schema/student.interface";
import StudentModel from "../../../models/student.model";

const createStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
       first_name,
       middle_name,
       last_name,
       registration_no,
       roll_no,
       dob,
       phone_number,
       email,
       guardian_name,
       guardian_phone_number,
       guardian_email,
       current_address,
       permanent_address,
       department,
       year_of_admission,
       year_of_passing,

    } = req.body;

    console.log(req.body);
    if (
      !(
        first_name &&
        last_name &&
        registration_no &&
        roll_no &&
        dob &&
        phone_number &&
        email &&
        guardian_name &&
        guardian_phone_number &&
        guardian_email &&
        current_address &&
        permanent_address &&
        department &&
        year_of_admission &&
        year_of_passing 
      )
    ) {
      return next(new CustomError(400, "Required fields are missing"));
    }

    const ID = await generateStudentID((year_of_admission), department);

    const payload: IStudent = {
      student_id: ID,
      first_name,
      last_name,
      registration_no,
      roll_no,
      dob: new Date(dob),
      phone_number,
      email,
      guardian_name,
      guardian_phone_number,
      guardian_email,
      current_address,
      permanent_address,
      department,
      year_of_admission,
      year_of_passing,

    };
    if (middle_name) payload.middle_name = middle_name;

    const newStudent = await StudentModel.create(payload);

    if (!newStudent) {
      return next(new CustomError(400, "Failed to create student"));
    }

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      result: newStudent,
    });
  }
);

export default createStudentController;
