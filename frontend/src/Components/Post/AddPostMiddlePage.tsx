import React, { useCallback, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { UserInfo } from "../../Types/userProfile";
import { Post } from "../../Types/Post";
import {
  FaTextHeight,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaTrash,
  FaHashtag,
  FaCrop,
} from "react-icons/fa";
import upload from "../../utils/cloudinary";
import { Oval } from "react-loader-spinner";
import { handleGenerateCaption, uploadPost } from "../../API/Post/post";
import { useNavigate } from "react-router-dom";
import debounce from "../../utils/debouncer";
import { usernameAvailability } from "../../API/Auth/auth";
import "react-toastify/dist/ReactToastify.css";
import ImageCropper from "../ImageCropper";

interface AddPostProps {
  userDetails: UserInfo;
}

const formatDate = (date: any) => {
  if (!date) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

const AddPostMiddlePage: React.FC<AddPostProps> = ({ userDetails }) => {
  const [captionsData, setCaptions] = useState("");

  console.log("captions data: ", captionsData);

  const [postData, setPostData] = useState<Partial<Post>>({
    userId: userDetails._id,
    isArchived: false,
    captions: "",
    location: "",
    images: [],
    videos: [],
    hashtags: [],
    mentions: [],
  });

  const [mentionStatuses, setMentionStatuses] = useState<
    { username: string; available: boolean | null }[]
  >([]);

  const [hashtags, setHashtags] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [indexToCrop, setIndexToCrop] = useState<number | null>(null);
  const [croppedImagesLength, setCroppedImagesLength] = useState<number>(1);
  
  const debouncedCheckUsernameAvailability = useCallback(
    debounce(async (index: number, username: string) => {
      if (!username) {
        setMentionStatuses(prevState =>
          prevState.map((mention, idx) =>
            idx === index ? { ...mention, available: null } : mention
          )
        );
        return;
      }
      try {
        const response = await usernameAvailability(username);
        setMentionStatuses(prevState =>
          prevState.map((mention, idx) =>
            idx === index
              ? { ...mention, available: response.available }
              : mention
          )
        );
      } catch (error) {
        console.error("Error checking username availability:", error);
      }
    }, 500),
    []
  );

  const handleMentionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    setMentionStatuses(prevState =>
      prevState.map((mention, idx) =>
        idx === index ? { ...mention, username: value } : mention
      )
    );
    debouncedCheckUsernameAvailability(index, value);
  };

  const handleAddHashtag = () => {
    setHashtags([...hashtags, ""]);
  };

  const handleRemoveHashtag = (index: number) => {
    const updatedHashtags = [...hashtags];
    updatedHashtags.splice(index, 1);
    setHashtags(updatedHashtags);
    setPostData(prevState => ({
      ...prevState,
      hashtags: updatedHashtags,
    }));
  };

  const handleHashtagChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const updatedHashtags = [...hashtags];
    updatedHashtags[index] = value;
    setHashtags(updatedHashtags);
    setPostData(prevState => ({
      ...prevState,
      hashtags: updatedHashtags,
    }));
  };

  const handleAddMention = () => {
    setMentionStatuses([...mentionStatuses, { username: "", available: null }]);
  };

  const handleRemoveMention = (index: number) => {
    const updatedMentions = [...mentionStatuses];
    updatedMentions.splice(index, 1);
    setMentionStatuses(updatedMentions);
    setPostData(prevState => ({
      ...prevState,
      mentions: updatedMentions.map(mention => mention.username),
    }));
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (
        postData.images!.length + postData.videos!.length + files.length >
        5
      ) {
        toast.error(
          "You can only upload up to a total of 5 images and videos."
        );
        return;
      }
      setIsUploading(true);
      try {
        const urls = await Promise.all(
          files.map(async file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<string>((resolve, reject) => {
              reader.onloadend = async () => {
                try {
                  const imgData = reader.result as string;
                  const response = await upload(
                    imgData,
                    err => toast.error(err),
                    "postimage",
                    "image"
                  );
                  if (response?.url) {
                    resolve(response.url);
                  } else {
                    reject("Failed to upload image");
                  }
                } catch (error) {
                  reject(error);
                }
              };
            });
          })
        );
        setPostData(prevState => ({
          ...prevState,
          images: [...(prevState.images || []), ...urls],
        }));
        toast.success("Images uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload images");
        console.log("Error uploading images: ", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = postData.images!.filter((_, i) => i !== index);
    setPostData(prevState => ({
      ...prevState,
      images: updatedImages,
    }));
  };

  const handleCropImage = (index: number) => {
    console.log("Post to crop index: ", index);
    const imgToCrop = postData.images!.filter((_, i) => i === index);
    console.log("img to crop: ", imgToCrop);
    setIsCropping(true);
    setImageToCrop(imgToCrop[0]);
    setIndexToCrop(index);
    setCroppedImagesLength(croppedImagesLength + 1)
  };
const handleCropComplete = async (croppedUrl: string) => {
  setCroppedImageUrl(croppedUrl);
  setIsCropping(false);
  try {
    const response = await upload(
      croppedUrl,
      (err) => toast.error(err),
      "postimage",
      "image"
    );
    if (response?.url) {
      setPostData((prevState) => {
        if (prevState.images && indexToCrop !== null) {
          const updatedImages = prevState.images.map((img, i) =>
            i === indexToCrop ? response.url : img
          );
          return {
            ...prevState,
            images: updatedImages,
          };
        }
        return prevState;
      });
      toast.success("Cropped image uploaded successfully");
    } else {
      toast.error("Failed to upload cropped image");
    }
  } catch (error) {
    toast.error("Failed to upload cropped image");
    console.log("Error uploading cropped image: ", error);
  }
};


  const handleAddVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (
        postData.images!.length + postData.videos!.length + files.length >
        5
      ) {
        toast.error(
          "You can only upload up to a total of 5 images and videos."
        );
        return;
      }
      setIsUploading(true);
      try {
        const urls = await Promise.all(
          files.map(async file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<string>((resolve, reject) => {
              reader.onloadend = async () => {
                try {
                  const videoData = reader.result as string;
                  const response = await upload(
                    videoData,
                    err => toast.error(err),
                    "postVideo",
                    "video"
                  );
                  if (response?.url) {
                    resolve(response.url);
                  } else {
                    reject("Failed to upload video");
                  }
                } catch (error) {
                  reject(error);
                }
              };
            });
          })
        );
        setPostData(prevState => ({
          ...prevState,
          videos: [...(prevState.videos || []), ...urls],
        }));
        toast.success("Videos uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload videos");
        console.log("Error uploading videos: ", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = postData.videos!.filter((_, i) => i !== index);
    setPostData(prevState => ({
      ...prevState,
      videos: updatedVideos,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGenerateCaptionFunction = async (imageUrl: string) => {
    console.log("handle generate cap fun called: ", imageUrl);
    const captionResult = await handleGenerateCaption(imageUrl);
    if (captionResult) {
      console.log("Caption res:", captionResult);
      setCaptions(captionResult?.caption?.caption);
    }
  };

  const handleSubmit = async () => {
      const allImagesCropped = postData.images?.length <= croppedImagesLength
    
    if (!allImagesCropped) {
      toast.error('Please crop all images before submitting the post.');
      return;
    }
  
    const validMentions = mentionStatuses
      .filter(mention => mention.available === false)
      .map(mention => mention.username);

    const dataToSubmit = {
      ...postData,
      mentions: validMentions,
    };

    if (
      postData.images.length > 0 ||
      postData.videos.length > 0 ||
      postData.captions.trim() !== ""
    ) {
      try {
        const response = await uploadPost(dataToSubmit);
        if (response.status === "success") {
          toast.success("Post created successfully");
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          toast.error("Failed to create post");
        }
      } catch (error) {
        toast.error("Failed to create post");
        console.log("Error creating post: ", error);
      }
    } else {
      toast.error("Please add at least one image, video, or caption.");
    }
  };

  return (
    <main className="flex-1  p-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white ">
      <ToastContainer />
      <div className="p-2 lg:p-58 rounded-lg bg-gray-100 dark:bg-gray-900 h-full  overflow-auto ">
        <div className="flex flex-row md:flex-row items-center md:items-start  rounded-lg p-2">
          <div className="flex-shrink-0">
            <img
              src={userDetails.dp}
              alt={`${userDetails.username}'s profile`}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-800 mb-4 md:mb-0"
            />
          </div>
          <div className="text-center ml-2 md:text-left md:ml-6">
            <h1 className="text-l text-gray-400 font-bold mb-1">Posting as</h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              {userDetails.username}
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              {formatDate(Date.now())}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 mt-5  flex items-center">
          <FaTextHeight className="mr-2" />
          Add a Caption
        </h2>
        <textarea
          className="w-full p-2 mb-4 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white resize-none"
          name="captions"
          rows={4}
          placeholder="Add your caption here..."
          value={postData.captions}
          onChange={handleInputChange}
        />
        <div className="flex items-center justify-start gap-8 mb-4">
          <div
            className="flex items-center 
          ">
            <FaUpload className="mr-2 text-blue-500" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleAddImage}
              />
              <span className="text-blue-500">Upload Images</span>
            </label>
          </div>
          <div className="flex items-center">
            <FaUpload className="mr-2 text-blue-500" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                multiple
                onChange={handleAddVideo}
              />
              <span className="text-blue-500">Upload Videos</span>
            </label>
          </div>
        </div>
        <div className="flex flex-wrap">
          {postData.images!.map((url, index) => (
            <div key={index} className="relative m-2">
              <img
                src={url}
                alt={`uploaded-${index}`}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
        className="absolute top-0 right-8 m-1 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        onClick={() => handleCropImage(index)}
      >
        <FaCrop className="text-sm" />
      </button>
      <button
        className="absolute top-0 right-0 m-1 text-white bg-red-600 hover:bg-red-500 rounded-full p-2 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        onClick={() => handleRemoveImage(index)}
      >
        <FaTrash className="text-sm" />
      </button>
            </div>
          ))}
          {postData.videos!.map((url, index) => (
            <div key={index} className="relative m-2">
              <video
                src={url}
                className="w-32 h-32 object-cover rounded-lg"
                controls
              />
              <button
                className="absolute top-0 right-0 m-1 text-white bg-red-500 rounded-full p-1"
                onClick={() => handleRemoveVideo(index)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          {postData?.images && postData.images.length > 0 && (
            <button
              onClick={() => handleGenerateCaptionFunction(postData?.images[0])}
              className="bg-slate-700 p-3 rounded-lg m-2 hover:bg-slate-800">
              Generate caption
            </button>
          )}
          {captionsData && (
            <div className="bg-slate-700 rounded-lg p-3 m-2">
              {captionsData}{" "}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(captionsData).then(() => {
                    toast("Text copied to clipboard!");
                  });
                }}
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
        <div className="s:flex-col lg:flex lg:flex-row gap-5 justify-evenly">
          <div>
            <div className="flex items-center justify-start gap-3 mb-4 mt-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FaHashtag className="mr-2" />
                Hashtags
              </h2>
              <button
                className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded-lg"
                onClick={handleAddHashtag}>
                <FaPlus className="mr-1" /> Add Hashtag
              </button>
            </div>
            {hashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={hashtag}
                  onChange={e => handleHashtagChange(e, index)}
                  className="flex-1 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                  placeholder="#Hashtag"
                />
                <button
                  className="ml-2 text-white bg-red-500 rounded-full p-1"
                  onClick={() => handleRemoveHashtag(index)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-start gap-3  mb-4 mt-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                @ Mention Users
              </h2>
              <button
                className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded-lg"
                onClick={handleAddMention}>
                <FaPlus className="mr-1" /> Add Mention
              </button>
            </div>
            {mentionStatuses.map((mention, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={mention.username}
                  onChange={e => handleMentionChange(e, index)}
                  className="flex-1 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                  placeholder="@username"
                />
                {mention.available !== null && (
                  <span className="ml-2">
                    {mention.available ? (
                      <FaTimesCircle className="text-red-500" />
                    ) : (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </span>
                )}
                <button
                  className="ml-2 text-white bg-red-500 rounded-full p-1"
                  onClick={() => handleRemoveMention(index)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 font-extrabold  mt-2 rounded-lg  cursor-pointer  ">
          <span>Add location:</span>
          <input
            name="location"
            placeholder="Add your location here.."
            className="bg-slate-200 dark:bg-gray-800 text-black dark:text-white w-full h-20 p-3 no-scrollbar rounded-lg"
            onChange={handleInputChange}
          />
        </div>
        <button
          className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg  mt-4"
          onClick={handleSubmit}>
          {isUploading ? (
            <Oval height={24} width={24} color="white" secondaryColor="white" />
          ) : (
            "Submit Post"
          )}
        </button>

        {isCropping && (
          <ImageCropper
            imageSrc={imageToCrop}
            aspect1={2}
            aspect2={2}
            onCropComplete={handleCropComplete}
            onClose={() => setIsCropping(false)}
          />
        )}




      </div>
    </main>
  );
};

export default AddPostMiddlePage;
