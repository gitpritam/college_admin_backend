import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateStudentID } from "./id/generateStudentID";
import { IStudent } from "../../../@types/interface/schema/student.interface";
import StudentModel from "../../../models/student.model";

const updateStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Student ID is required"));
    }

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
      year_of_passing,
      remark,
    } = req.body;
    console.log(req.body);

    const payload: Partial<IStudent> = {};
    if (first_name) payload.first_name = first_name;
    if (middle_name) payload.middle_name = middle_name;
    if (last_name) payload.last_name = last_name;
    if (registration_no) payload.registration_no = registration_no;
    if (roll_no) payload.roll_no = roll_no;
    if (dob) payload.dob = dob;
    if (phone_number) payload.phone_number = phone_number;
    if (email) payload.email = email;
    if (guardian_name) payload.guardian_name = guardian_name;
    if (guardian_phone_number)
      payload.guardian_phone_number = guardian_phone_number;
    if (guardian_email) payload.guardian_email = guardian_email;
    if (current_address) payload.current_address = current_address;
    if (permanent_address) payload.permanent_address = permanent_address;
    if (department) payload.department = department;
    // if (year_of_admission)payload.year_of_admission=year_of_admission;
    if (year_of_passing) payload.year_of_passing = year_of_passing;
    if (remark) payload.remark = remark;

    const updatedStudent = await StudentModel.findOneAndUpdate(
      { student_id: id },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return next(new CustomError(404, "Failed to update student"));
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      result: updatedStudent,
    });
  }
);
export default updateStudentController;
