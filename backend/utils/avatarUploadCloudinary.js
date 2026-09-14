import cloudinary from "../services/cloudinary.js";

const avatarUploadCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "avatar",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      )
      .end(fileBuffer);
  });
};

export default avatarUploadCloudinary;