// src/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "products",
      format: "png",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

const upload = multer({ storage });

export default upload;
