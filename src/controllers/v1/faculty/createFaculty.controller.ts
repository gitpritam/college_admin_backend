import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateFacultyID } from "./id/generateFacultyID";
import { IFaculty } from "../../../@types/interface/schema/faculty.interface";
import FacultyModel from "../../../models/faculty.model";
import hashPassword from "../../../utils/password/hashPassword";
import { uploadImage } from "../../../utils/cloudinary/uploadImage";

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
      password,
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
        department &&
        password
      )
    ) {
      return next(new CustomError(400, "Required fields are missing"));
    }

    //generate id
    const ID = await generateFacultyID(new Date(joining_date), department);

    //password
    const hashedPassword = await hashPassword(password);

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
      password: hashedPassword,
    };
    if (middle_name) payload.middle_name = middle_name;
    if (role) payload.role = role;

    const newFaculty = await FacultyModel.create(payload);

    if (!newFaculty) {
      return next(new CustomError(400, "Failed to create faculty"));
    }

    let imageUrl: string | undefined;
    if (req.file) {
      console.log(req.file);
      const { buffer } = req.file;
      const public_id = `${ID}`;
      if (!buffer) {
        return next(new CustomError(400, "File upload failed"));
      }

      const imageUploadResponse = await uploadImage(buffer, public_id, {
        folder: "cm/faculty/",
      });
      console.log(imageUploadResponse);
      if (imageUploadResponse.secure_url) {
        imageUrl = imageUploadResponse.secure_url;
      }
      const updatedFaculty = await FacultyModel.findByIdAndUpdate(
        newFaculty._id,
        { $set: { profile_picture_url: imageUrl ?? "" } },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        message: "Faculty created successfully",
        result: updatedFaculty,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      result: newFaculty,
    });
  }
);

export default createFacultyController;
