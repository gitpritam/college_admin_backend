import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateFacultyID } from "./id/generateFacultyID";
import { IFaculty } from "../../../@types/interface/schema/faculty.interface";
import FacultyModel from "../../../models/faculty.model";

const createFacultyController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      first_name,
      middle_name,
      last_name,
      designation,
      qualification,
      experience,
      dob,
      phone_number,
      email,
      current_address,
      permanent_address,
      joining_date,
      department,
      role,
    } = req.body;

    console.log(req.body);
    if (
      !(
        first_name &&
        last_name &&
        designation &&
        qualification &&
        experience &&
        dob &&
        phone_number &&
        email &&
        current_address &&
        permanent_address &&
        joining_date &&
        department
      )
    ) {
      return next(new CustomError(400, "Required fields are missing"));
    }

    //generate id
    const ID = await generateFacultyID(new Date(joining_date), department);

    //password

    const payload: IFaculty = {
      faculty_id: ID,
      first_name,
      last_name,
      designation,
      qualification,
      experience,
      dob: new Date(dob),
      phone_number,
      email,
      current_address,
      permanent_address,
      joining_date: new Date(joining_date),
      department,
    };
    if (middle_name) payload.middle_name = middle_name;
    if (role) payload.role = role;

    const newFaculty = await FacultyModel.create(payload);

    if (!newFaculty) {
      return next(new CustomError(400, "Failed to create faculty"));
    }

    return res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      result: newFaculty,
    });
  }
);

export default createFacultyController;
