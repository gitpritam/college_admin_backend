function getPublicId(url: string): string {
  const parts = url.split("/");
  // Find version segment (v123456...)
  const versionIndex = parts.findIndex((p) => /^v\d+$/.test(p));
  if (versionIndex === -1) {
    throw new Error("Invalid Cloudinary URL: missing version segment");
  }
  // Everything after version is path + filename.ext
  const pathAndFile = parts.slice(versionIndex + 1).join("/");
  // Remove file extension
  return pathAndFile.replace(/\.[^/.]+$/, "");
}

export default getPublicId;
