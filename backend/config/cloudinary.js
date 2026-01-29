import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    // Delete the local file after upload
    fs.unlinkSync(filePath);
    return uploadResult; // ✅ Return full result, not just URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Attempt to delete local file anyway
    try {
      fs.unlinkSync(filePath);
    } catch (fsError) {
      console.error("Failed to delete local file:", fsError);
    }
    return null; // ✅ Explicitly return null on error
  }
};

export default uploadOnCloudinary;