import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import debounce from "../../../utils/debouncer";
import {
  faCheckCircle,
  faTimesCircle,
  faUser,
  faEnvelope,
  faPhone,
  faInfoCircle,
  faMapMarkerAlt,
  faTransgender,
  faCrown,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { UserInfo } from "../../../Types/userProfile";
import {
  validateName,
  validateUsername,
  validatePhoneNumber,
} from "../../../utils/validations";
import { usernameAvailability } from "../../../API/Auth/auth";
import { editProfile } from "../../../API/Profile/profile";
import { useNavigate } from "react-router-dom";
import upload from "../../../utils/cloudinary";
import ImageCropper from "../../ImageCropper";

interface ProfileProps {
  userDetails: UserInfo;
}

const EditProfile: React.FC<ProfileProps> = ({ userDetails }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserInfo>(userDetails);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    username: "",
    phone: "",
    bio: "",
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isDpCrop, setIsDpCrop] = useState(true);
  const aspect1 = isDpCrop ? 4 : 6;
  const aspect2 = isDpCrop ? 4 : 3;
  

  const handleDp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsDpCrop(true);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsDpCrop(false);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      const response = await upload(
        croppedImageUrl,
        (err) => toast.error(err),
        isDpCrop ? "dp" : "cover",
        "image"
      );
      if (response?.url) {
        setFormData((prevState) => ({
          ...prevState,
          [isDpCrop ? "dp" : "coverPhoto"]: response.url,
        }));
        toast.success(
          isDpCrop
            ? "Profile picture updated successfully"
            : "Cover photo updated successfully"
        );
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Error uploading image:", error);
    }
    setIsCropping(false);
    setImageToCrop(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (username === userDetails.username) {
        setUsernameAvailable(true);
        return;
      }
      try {
        const response = await usernameAvailability(username);
        setUsernameAvailable(response.available);
      } catch (error) {
        console.error("Error checking username availability:", error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.username && formData.username.trim() !== "") {
      checkUsernameAvailability(formData.username);
    }
  }, [formData.username]);

  const validateField = (name: string, value: string) => {
    let validationMessage = "";

    switch (name) {
      case "name":
        validationMessage = validateName(value);
        break;
      case "username":
        validationMessage = validateUsername(value);
        checkUsernameAvailability(value); // Check availability on change
        break;
      case "phone":
        validationMessage = validatePhoneNumber(value);
        break;
      case "bio":
        validationMessage =
          value.length > 200 ? "Bio must be 200 characters or less" : "";
        break;
      default:
        break;
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationMessage,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const field in formData) {
      const value = formData[field as keyof UserInfo];
      if (typeof value === "string") {
        validateField(field, value);
      }
    }

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    if (!hasErrors) {
      if (usernameAvailable === false) {
        toast.error("Username not available");
        return;
      }
      try {
        const result = await editProfile(formData);
        toast.success("Profile updated successfully");
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      } catch (error) {
        toast.error("Error updating profile. Try again");
        console.error("Error updating profile:", error);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  return (
    <>
      <ToastContainer />
     
      <main className="flex-1   bg-gray-100 min-h-screen w-full dark:bg-gray-700 text-white overflow-auto">
        <div className="max-w-full mx-auto relative">
        {!isCropping && !imageToCrop && (
          <form
            onSubmit={handleSubmit}
            className="px-6 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg mb-4 relative"
          >
            <button
              type="submit"
              className="absolute top-4 right-4 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Save Changes
            </button>

            <div className="flex items-center justify-between mb-4">
              <img
                src={formData.dp}
                alt="Profile Picture"
                className="h-40 w-40 rounded-full object-cover border-4 border-white dark:border-gray-100"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              id="image-input"
              className="hidden"
              onChange={handleDp}
            />
            <label htmlFor="image-input" className="block">
              <p className="text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:bg-blue-600 sm:text-base sm:p-3 sm:ml-0 mb-7 w-32 md:w-36 lg:w-40">
                Upload New DP
              </p>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-800 rounded px-5 py-2"
                  />
                  {validationErrors.username && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {validationErrors.username}
                    </p>
                  )}
                  {!validationErrors.username &&
                    usernameAvailable === false && (
                      <p className="text-red-500 text-xs font-semibold mt-1">
                        Username not available
                      </p>
                    )}
                  {!validationErrors.username && usernameAvailable === true && (
                    <p className="text-green-500 text-xs font-semibold mt-1">
                      Username available
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-800 rounded px-5 py-2"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {validationErrors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </label>
                  <h1>{formData.email}</h1>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-800 rounded px-5 py-2"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-800 rounded px-5 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faTransgender} className="mr-2" />
                    Gender
                  </label>
                  <div className="flex gap-4">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleGenderChange}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleGenderChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={handleGenderChange}
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    className="text-lg font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-800 rounded px-5 py-2"
                  />
                  {validationErrors.bio && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {validationErrors.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={faCrown} className="mr-2" />
                <label className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                  Premium Account
                </label>
                <FontAwesomeIcon
                  icon={formData.isPremium ? faCheckCircle : faTimesCircle}
                  className={`text-lg font-semibold ${
                    formData.isPremium ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>

              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                <label className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                  Private Account
                </label>
                <FontAwesomeIcon
                  icon={formData.isPrivate ? faCheckCircle : faTimesCircle}
                  className={`text-lg font-semibold ${
                    formData.isPrivate ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 mt-10">
              <img
                src={formData.coverPhoto}
                alt="Cover photo"
                className="h-140 w-140 object-cover border-4 p-3 border-white dark:border-gray-100 rounded-lg"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              id="image-input2"
              className="hidden"
              onChange={handleCoverPhoto}
            />
            <label htmlFor="image-input2" className="block">
              <p className="text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:bg-blue-600 sm:text-base sm:p-3 sm:ml-0 mb-7 w-32 md:w-36 lg:w-40">
                Upload Cover Photo
              </p>
            </label>
          </form> )}
          {isCropping && imageToCrop && (

      <ImageCropper
        imageSrc={imageToCrop}
        aspect1={aspect1}
        aspect2={aspect2}
        onCropComplete={handleCropComplete}
        onClose={() => setIsCropping(false)}
      />
      
      )}
        </div>
      </main>
    </>
  );
};

export default EditProfile;
