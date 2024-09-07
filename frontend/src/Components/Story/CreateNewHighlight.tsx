import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import {
  createStoryHighlights,
  getStoriesForHighlights,
} from "../../API/Post/post";
import { TiTick } from "react-icons/ti";
import ImageCropper from "../ImageCropper";
import upload from "../../utils/cloudinary";
import { ToastContainer, toast } from "react-toastify";
import { setAdminCredentials } from "../../Redux/AdminSlice/adminSlice";

const CreateNewHighlight = () => {
  const [storyHighlights, setStoryhighlights] = useState([]);
  const [selectedStories, setSelectedStories] = useState([]);
  const [highlightName, setHighlightName] = useState("");
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [callEffect, setCallEffect] = useState(false);

  useEffect(() => {
    const getAllStoriesOfUser = async () => {
      const stories = await getStoriesForHighlights();
      if (stories.status === "success") {
        setStoryhighlights(stories?.data);
      }
    };
    getAllStoriesOfUser();
  }, [callEffect]);

  const handleTickClick = (storyId: string) => {
    setSelectedStories(prevSelected =>
      prevSelected.includes(storyId)
        ? prevSelected.filter(id => id !== storyId)
        : [...prevSelected, storyId]
    );
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImageToCrop(fileUrl);
      setIsCropping(true);
    }
  };

  const handleCropComplete = (croppedUrl: string) => {
    setCroppedImageUrl(croppedUrl);
    setIsCropping(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!highlightName || !croppedImageUrl || selectedStories.length === 0) {
      toast.error("Please provide a highlight name, cover image, and select at least one story.");
      return;
    }

    const response = await upload(
      croppedImageUrl,
      err => console.error(err),
      "highlightsCover",
      "image"
    );

    const resUrl = response.url;
    const payload = {
      highlightName,
      coverImage: resUrl,
      selectedStories,
    };

    const createHighlight = await createStoryHighlights(payload);

    if (createHighlight.status === "success") {
      setCallEffect(true)
      toast.success("Highlights created successfully");
      
    }

    setTimeout(() => {
      setSelectedStories([]);
      setHighlightName("");
      setCroppedImageUrl(null);
      setIsCropping(false);
      setImageToCrop(null);
      document.getElementById("addNewHighlight")?.close();
    }, 1000);
  };

  return (
    <>
      <dialog id="addNewHighlight" className="modal">
        <ToastContainer />
        <div className="modal-box w-full max-w-3xl text-black dark:text-gray-300 overflow-auto no-scrollbar bg-gray-200 dark:bg-gray-800">
          <h3 className="font-bold text-lg underline my-2">
            Create new highlight
          </h3>

          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <form onSubmit={handleSubmit}>
            <div className="gap-3 flex justify-between mb-2">
              <label className="form-control w-full max-w-xs">
                <div className="flex">
                  <div className="label">
                    <span className="label-text text-black dark:text-gray-300 bg-gray-200 dark:bg-gray-800">
                      Name of highlight:
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input text-black dark:text-gray-300 bg-gray-200 dark:bg-gray-800 input-bordered w-full max-w-xs"
                      value={highlightName}
                      onChange={e => setHighlightName(e.target.value)}
                    />
                  </div>
                </div>
              </label>

              <div>
                <button
                  type="submit"
                  className="btn text-black dark:text-gray-400 bg-gray-200 hover:bg-slate-300 hover:dark:bg-slate-800 dark:bg-gray-900">
                  Submit
                </button>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-control w-full max-w-xs">
                <div className="flex">
                  <div className="label">
                    <span className="label-text text-black dark:text-gray-300 bg-gray-200 dark:bg-gray-800">
                      Highlight Cover Image:
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      className="input text-black dark:text-gray-300 bg-gray-200 dark:bg-gray-800 input-bordered w-full max-w-xs"
                      onChange={handleCoverImageUpload}
                    />
                  </div>
                </div>
                {croppedImageUrl && <img src={croppedImageUrl} alt="Cropped Highlight Cover" />}
              </label>
            </div>
            <h1>Select stories to add </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {storyHighlights &&
                storyHighlights.map((story, index) => (
                  <div key={index} className="p-2">
                    {story.mediaType === "video" ? (
                      <div>
                        <video
                          className={`w-32 h-44 object-cover rounded-none rounded-tr-lg rounded-tl-lg  ${
                            selectedStories.includes(story._id)
                              ? "border-4 border-green-700"
                              : "border-4 border-red-400"
                          }`}
                          controls>
                          <source src={story.mediaUrl} type="video/mp4" />
                        </video>
                        <div
                          className={`p-2 gap-2 -mt-2 bg-gray-300 dark:bg-gray-900 rounded-none rounded-br-lg rounded-bl-lg flex justify-evenly ${
                            selectedStories.includes(story._id)
                              ? "border-4 border-green-700"
                              : "border-4 border-red-400"
                          }`}>
                          <TiTick
                            className={`cursor-pointer text-2xl ${
                              selectedStories.includes(story._id)
                                ? "bg-green-700"
                                : "bg-gray-400"
                            } rounded-full`}
                            onClick={() => handleTickClick(story._id)}
                          />
                          <FaTimes
                            className={`cursor-pointer text-2xl ${
                              !selectedStories.includes(story._id)
                                ? "bg-red-700"
                                : "bg-gray-400"
                            } rounded-full`}
                            onClick={() => handleTickClick(story._id)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <img
                          className={`w-32 h-44 object-cover rounded-none rounded-tr-lg rounded-tl-lg  ${
                            selectedStories.includes(story._id)
                              ? "border-4 border-green-700"
                              : "border-4 border-red-400"
                          }`}
                          src={story.mediaUrl}
                          alt="Story Highlight"
                        />
                        <div
                          className={`p-2 gap-2 -mt-2 bg-gray-300 dark:bg-gray-900 rounded-none rounded-br-lg rounded-bl-lg flex justify-evenly ${
                            selectedStories.includes(story._id)
                              ? "border-4 border-green-700"
                              : "border-4 border-red-400"
                          }`}>
                          <TiTick
                            className={`cursor-pointer text-2xl ${
                              selectedStories.includes(story._id)
                                ? "bg-green-700"
                                : "bg-gray-400"
                            } rounded-full`}
                            onClick={() => handleTickClick(story._id)}
                          />
                          <FaTimes
                            className={`cursor-pointer text-2xl ${
                              !selectedStories.includes(story._id)
                                ? "bg-red-700"
                                : "bg-gray-400"
                            } rounded-full`}
                            onClick={() => handleTickClick(story._id)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        {isCropping && (
          <ImageCropper
            imageSrc={imageToCrop}
            aspect1={4}
            aspect2={4}
            onCropComplete={handleCropComplete}
            onClose={() => setIsCropping(false)}
          />
        )}
      </dialog>

      <div className="rounded-lg mt-2">
        <div
          onClick={() => document.getElementById("addNewHighlight")?.showModal()}
          className="bg-slate-200 flex flex-col justify-center items-center cursor-pointer p-4 dark:bg-slate-800  w-16 h-1w-16 sm:w-16 sm:h-1w-16 md:w-16 md:h-1w-16 lg:w-24 lg:h-24 rounded-full flex-shrink-0">
          <FaPlusCircle className="text-2xl" />
          <div className="text-center text-sm">Create highlight</div>
        </div>
      </div>
    </>
  );
};
export default CreateNewHighlight;
