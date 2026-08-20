import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Eventora"); // replace with your unsigned preset
  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dbnd6bvqy/image/upload",
      formData
    );
    return response.data.secure_url; // uploaded image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
  }
};
