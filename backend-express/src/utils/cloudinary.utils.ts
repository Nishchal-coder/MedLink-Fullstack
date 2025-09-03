import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});

const uploadOnCloudinary = async (
  avatarLocal: string
): Promise<UploadApiResponse | string | null> => {
  try {
    if (!avatarLocal) {
      console.log("Avatar not found");
      return "Error: avatar not provided to upload on Cloudinary";
    }

    const uploadLink = await cloudinary.uploader.upload(avatarLocal, {
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      resource_type: "auto",
    });

    console.log("Upload link:", uploadLink);
    fs.unlinkSync(avatarLocal);
    return uploadLink;
  } catch (error) {
    if (fs.existsSync(avatarLocal)) {
      fs.unlinkSync(avatarLocal);
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };
