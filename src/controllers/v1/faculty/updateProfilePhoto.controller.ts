import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import CustomError from "../../../utils/CustomError";
import { uploadImage } from "../../../utils/cloudinary/uploadImage";
import FacultyModel from "../../../models/faculty.model";
import getPublicId from "../../../utils/cloudinary/getPublicId";
import { deleteFile } from "../../../utils/cloudinary/deleteFile";

const updateProfilePhotoController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new CustomError(400, "Faculty id is required"));
    }

    if (!req.file) {
      return next(new CustomError(400, "Image data not found"));
    }

    const faculty = await FacultyModel.findOne({ faculty_id: id });
    if (!faculty) {
      return next(new CustomError(404, "Faculty not found"));
    }

    const { buffer } = req.file;
    if (!buffer) {
      return next(new CustomError(400, "File buffer is missing"));
    }

    //1-> there is no image uploaded
    //already a image exist
    let publicId = faculty.faculty_id;

    const imageUploadResponse = await uploadImage(buffer, publicId, {
      folder: "cm/faculty/",
      invalidate: true,
    });

    if (!imageUploadResponse || !imageUploadResponse.secure_url) {
      return next(new CustomError(500, "Image upload failed"));
    }

    const imageUrl = imageUploadResponse.secure_url;
    const uploadedPublicId = imageUploadResponse.public_id;
    try {
      const updatedFaculty = await FacultyModel.findByIdAndUpdate(
        faculty._id,
        { $set: { profile_picture_url: imageUrl } },
        { new: true }
      );

      if (!updatedFaculty) {
        return next(new CustomError(400, "Failed to update faculty"));
      }

      return res.status(200).json({
        success: true,
        message: "Faculty updated successfully",
        result: updatedFaculty,
      });
    } catch (error) {
      // ✅ Rollback image if DB save failed
      if (uploadedPublicId && faculty.profile_picture_url === "") {
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

export default updateProfilePhotoController;
