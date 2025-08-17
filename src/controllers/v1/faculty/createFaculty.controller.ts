import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateFacultyID } from "./id/generateFacultyID";
import { IFaculty } from "../../../@types/interface/schema/faculty.interface";
import FacultyModel from "../../../models/faculty.model";
import hashPassword from "../../../utils/password/hashPassword";
import { uploadImage } from "../../../utils/cloudinary/uploadImage";
import { deleteFile } from "../../../utils/cloudinary/deleteFile";

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

    //Image upload
    let imageUrl: string | undefined;
    let uploadedPublicId: string | null = null;
    if (req.file) {
      const { buffer } = req.file;
      if (!buffer) {
        return next(new CustomError(400, "File buffer is missing"));
      }

      const imageUploadResponse = await uploadImage(buffer, ID, {
        folder: "cm/faculty/",
      });

      if (!imageUploadResponse || !imageUploadResponse.secure_url) {
        throw new CustomError(500, "Image upload failed");
      }

      imageUrl = imageUploadResponse.secure_url;
      uploadedPublicId = imageUploadResponse.public_id;
    }

    //payload
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
      profile_picture_url: imageUrl ?? "",
    };
    if (middle_name) payload.middle_name = middle_name;
    if (role) payload.role = role;
    try {
      const newFaculty = await FacultyModel.create(payload);

      if (!newFaculty) {
        return next(new CustomError(400, "Failed to create faculty"));
      }

      return res.status(201).json({
        success: true,
        message: "Faculty created successfully",
        result: newFaculty,
      });
    } catch (error) {
      // ✅ Rollback image if DB save failed
      if (uploadedPublicId) {
        try {
          await deleteFile(uploadedPublicId);
        } catch (rollbackErr) {
          console.error("⚠️ Failed to rollback uploaded image:", rollbackErr);
        }
      }
      return next(error);
    }
  }
);

export default createFacultyController;
