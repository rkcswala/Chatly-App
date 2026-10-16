
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
   cloud_name: "arenmcab",
  api_key: "523543779523678",
  api_secret: "cfgyRyTJecXmixGlXz3fNuuJdN0",
});

const Imageuploadcloudinary = async (fileBuffer) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "chatapp_profiles",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(fileBuffer);
    });

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

export default Imageuploadcloudinary;

