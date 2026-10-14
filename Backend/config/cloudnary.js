import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "arenmcab",
  api_key: "523543779523678",
  api_secret: "cfgyRyTJecXmixGlXz3fNuuJdN0",
});



const uploadclounary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: "public",
    });

    // console.log("Cloudinary upload success");

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return result;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    throw error;
  }
};

export default uploadclounary;