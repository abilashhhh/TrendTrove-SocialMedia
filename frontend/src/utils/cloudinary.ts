import axios from "axios";

const upload = async (
  fileData: string,
  setErr: (error: string) => void,
  folder: string,
  type: "image" | "video" | "audio"
) => {
  try {
    const response = await fetch(fileData);
    const blob = await response.blob();
    const file = new File([blob], "filename", { type: blob.type });

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    let uploadUrl;
    switch (type) {
      case "video":
        uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
        break;
      case "audio":
        uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
        break;
      case "image":
      default:
        uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        break;
    }

    const uploadResponse = await axios.post(uploadUrl, formData);

    if (uploadResponse) {
      return uploadResponse.data;
    }
  } catch (error: any) {
    setErr(error?.message || "Unknown error occurred");
    console.error("Error:", error.response?.data || error.message || error);
  }
};

export default upload;
