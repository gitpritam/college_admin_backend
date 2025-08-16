import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import cloudinary from "../../config/cloudinary.config";
/**
 * Upload an image Buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} publicId
 * @param {object} [options]
 * @returns {Promise<import('cloudinary').UploadApiResponse>}
 */

export async function uploadImage(
  buffer: Buffer,
  publicId: string,
  options?: UploadApiOptions
): Promise<UploadApiResponse> {
  return await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          public_id: publicId,
          overwrite: true,
          ...(options ?? {}),
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error("Cloudinary upload returned no result."));
          resolve(result);
        }
      )
      .end(buffer);
  });
}
