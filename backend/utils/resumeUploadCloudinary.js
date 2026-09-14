import cloudinary from "../services/cloudinary.js";

const resumeUploadCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "resumes",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

export default resumeUploadCloudinary;