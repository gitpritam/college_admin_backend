import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateFacultyID } from "./id/generateFacultyID";
import { IFaculty } from "../../../@types/interface/schema/faculty.interface";
import FacultyModel from "../../../models/faculty.model";
import hashPassword from "../../../utils/password/hashPassword";

const updateFacultyController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Faculty ID is required"));
    }

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
      password,
    } = req.body;

    console.log(req.body);

    const payload: Partial<IFaculty> = {};
    if (first_name) payload.first_name = first_name;
    if (middle_name) payload.middle_name = middle_name;
    if (last_name) payload.last_name = last_name;
    if (designation) payload.designation = designation;
    if (qualification) payload.qualification = qualification;
    if (experience) payload.experience = experience;
    if (dob) payload.dob = new Date(dob);
    if (phone_number) payload.phone_number = phone_number;
    if (email) payload.email = email;
    if (current_address) payload.current_address = current_address;
    if (permanent_address) payload.permanent_address = permanent_address;
    if (joining_date) payload.joining_date = new Date(joining_date);
    if (department) payload.department = department;
    if (role) payload.role = role;

    const updatedFaculty = await FacultyModel.findOneAndUpdate(
      { faculty_id: id },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updatedFaculty) {
      return next(new CustomError(404, "Failed to update faculty"));
    }

    return res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      result: updatedFaculty,
    });
  }
);

export default updateFacultyController;
