import { UploadApiErrorResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary.config";

type DestroyOptions = {
  resource_type?: "image" | "video" | "raw" | "auto";
  invalidate?: boolean;
};

type DestroyApiResponse = {
  result: "ok" | "not found" | "error" | string;
};

export async function deleteFile(
  publicId: string,
  options?: DestroyOptions
): Promise<DestroyApiResponse> {
  return await new Promise<DestroyApiResponse>((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image", invalidate: true, ...(options ?? {}) },
      (error: UploadApiErrorResponse | undefined, result: unknown) => {
        if (error) return reject(error);
        if (!result)
          return reject(new Error("Cloudinary destroy returned no result."));
        resolve(result as DestroyApiResponse);
      }
    );
  });
}
