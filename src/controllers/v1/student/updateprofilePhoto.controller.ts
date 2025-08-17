import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { uploadImage } from "../../../utils/cloudinary/uploadImage";
import { deleteFile } from "../../../utils/cloudinary/deleteFile";
import StudentModel from "../../../models/student.model";

const updateStudentProfilePhotoController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Student id is required"));
    }

    if (!req.file) {
      return next(new CustomError(400, "Image data not found"));
    }

    const student = await StudentModel.findOne({ student_id: id });
    if (!student) {
      return next(new CustomError(404, "Student not found"));
    }

    const { buffer } = req.file;
    if (!buffer) {
      return next(new CustomError(400, "File buffer is missing"));
    }

    //1-> there is no image uploaded
    //already a image exist
    let publicId = student.student_id;

    const imageUploadResponse = await uploadImage(buffer, publicId, {
      folder: "cm/student/",
      invalidate: true,
    });

    if (!imageUploadResponse || !imageUploadResponse.secure_url) {
      return next(new CustomError(500, "Image upload failed"));
    }

    const imageUrl = imageUploadResponse.secure_url;
    const uploadedPublicId = imageUploadResponse.public_id;
    try {
      const updatedStudent = await StudentModel.findByIdAndUpdate(
        student._id,
        { $set: { passport_photo_url: imageUrl } },
        { new: true }
      );

      if (!updatedStudent) {
        return next(new CustomError(400, "Failed to updatestudent"));
      }

      return res.status(200).json({
        success: true,
        message: "Student updated successfully",
        result: updatedStudent,
      });
    } catch (error) {
      // ✅ Rollback image if DB save failed
      if (uploadedPublicId && student.passport_photo_url === "") {
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

export default updateStudentProfilePhotoController;
