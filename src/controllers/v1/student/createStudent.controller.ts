import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { generateStudentID } from "./id/generateStudentID";
import { IStudent } from "../../../@types/interface/schema/student.interface";
import StudentModel from "../../../models/student.model";
import { uploadImage } from "../../../utils/cloudinary/uploadImage";
import { deleteFile } from "../../../utils/cloudinary/deleteFile";
import { activityLogger } from "../../../config/log.config";

const createStudentController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const {
      first_name,
      middle_name,
      last_name,
      dob,
      phone_number,
      email,
      guardian_name,
      guardian_phone_number,
      guardian_email,
      current_address,
      permanent_address,
      department,
    } = req.body;

    console.log(req.body);
    if (
      !(
        first_name &&
        last_name &&
        dob &&
        phone_number &&
        email &&
        guardian_name &&
        guardian_phone_number &&
        guardian_email &&
        current_address &&
        permanent_address &&
        department
      )
    ) {
      activityLogger.warn("Student Create Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Required fields are missing",
      });
      return next(new CustomError(400, "Required fields are missing"));
    }
    const year_of_admission = new Date().getFullYear();
    const ID = await generateStudentID(year_of_admission, department);

    //Image upload
    let imageUrl: string | undefined;
    let uploadedPublicId: string | null = null;
    if (req.file) {
      const { buffer } = req.file;
      if (!buffer) {
        return next(new CustomError(400, "File buffer is missing"));
      }

      const imageUploadResponse = await uploadImage(buffer, ID, {
        folder: "cm/student/",
      });

      if (!imageUploadResponse || !imageUploadResponse.secure_url) {
        return next(new CustomError(500, "Image upload failed"));
      }

      imageUrl = imageUploadResponse.secure_url;
      uploadedPublicId = imageUploadResponse.public_id;
    }

    const payload: IStudent = {
      student_id: ID,
      first_name,
      last_name,
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
      passport_photo_url: imageUrl ?? "",
    };
    if (middle_name) payload.middle_name = middle_name;

    try {
      const newStudent = await StudentModel.create(payload);

      if (!newStudent) {
        activityLogger.warn("Student Create Failed", {
          user_id: user?._id,
          http_method: req.method,
          endpoint: req.originalUrl,
          message: "Failed to create student",
        });
        return next(new CustomError(400, "Failed to create student"));
      }

      activityLogger.info("Student Created", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: `Student \"${newStudent.first_name} ${newStudent.last_name}\" created with ID ${newStudent.student_id}`,
      });

      return res.status(201).json({
        success: true,
        message: "Student created successfully",
        result: newStudent,
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
      activityLogger.error("Student Create Failed", {
        user_id: user?._id,
        http_method: req.method,
        endpoint: req.originalUrl,
        message: "Unexpected error while creating student",
        stack: error instanceof Error ? error.stack : undefined,
      });
      return next(error);
    }
  }
);

export default createStudentController;
