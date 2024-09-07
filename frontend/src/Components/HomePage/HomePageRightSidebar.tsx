import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import useUserDetails from "../../Hooks/useUserDetails";
import { rightSidebar } from "../../API/Profile/profile";
import upload from "../../utils/cloudinary";
import ImageCropper from "../ImageCropper";
import { toast } from "react-toastify";
import { getAllStories, handleAddNewStory } from "../../API/Post/post";
import { GiNextButton } from "react-icons/gi";
import { GiPreviousButton } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { useSwipeable } from "react-swipeable";

interface Story {
  userId: string;
  isHighlighted: boolean;
  captions?: string;
  username?: string;
  dp?: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "text";
  viewers: string[];
  viewCount: number;
  hiddenFrom: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const currentUser = useUserDetails();
  const [showAddStory, setShowAddStory] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [allStories, setAllStories] = useState<Story[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [storyLargeScreen, setStoryLargeScreen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const response = await getAllStories();
        if (response && response.data) {
          setAllStories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
    };

    fetchAllStories();
  }, [isOpen, loading, showAddStory]);

  useEffect(() => {
    if (currentUser.isRightSidebarOpen !== undefined) {
      setIsOpen(currentUser.isRightSidebarOpen);
    }
  }, [currentUser.isRightSidebarOpen]);

  const toggleSidebar = useCallback(async () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    await rightSidebar();
  }, []);

  const handleAddStory = async () => {
    setLoading(true);
    if (!mediaFile) {
      toast.error("Please upload an image or video");
      setLoading(false);
      return;
    }

    let mediaUrlToUpload: string | File = mediaFile;

    if (croppedImageUrl && mediaFile.type.startsWith("image")) {
      mediaUrlToUpload = croppedImageUrl;
    } else if (mediaFile.type.startsWith("video")) {
      mediaUrlToUpload = videoUrl;
    }

    try {
      const response = await upload(
        mediaUrlToUpload,
        err => console.error(err),
        "stories",
        mediaFile.type.startsWith("image") ? "image" : "video"
      );

      if (response) {
        const newStory: Story = {
          userId: currentUser.id,
          isHighlighted: false,
          captions: caption,
          mediaUrl: response.secure_url,
          mediaType: mediaFile.type.startsWith("image") ? "image" : "video",
          viewers: [],
          viewCount: 0,
          hiddenFrom: [],
        };

        const addedStory = await handleAddNewStory(newStory);
        if (addedStory.status === "success") {
          toast.success("Story added successfully");
        } else {
          toast.error("Error in adding story");
        }
      }
    } catch (error) {
      toast.error("Error in uploading media");
      console.error(error);
    } finally {
      setLoading(false);
      setShowAddStory(false);
      setMediaFile(null);
      setMediaUrl(null);
      setCaption("");
    }
  };

  const handleCancelStory = () => {
    setShowAddStory(false);
    setMediaFile(null);
    setMediaUrl(null);
    setCaption("");
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setMediaFile(file);

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setMediaUrl(fileUrl);

      if (file.type.startsWith("image")) {
        setImageToCrop(fileUrl);
        setIsCropping(true);
      } else if (file.type.startsWith("video")) {
        setVideoUrl(fileUrl);
      }
    }
  };

  const handleCropComplete = (croppedUrl: string) => {
    setCroppedImageUrl(croppedUrl);
    setIsCropping(false);
  };

  const items = useMemo(
    () =>
      allStories?.map((story, index) => (
        <div
          key={index}
          onClick={() => {
            setStoryLargeScreen(true);
            setSelectedStoryIndex(index);
          }}
          className={`relative overflow-hidden rounded-lg ${
            isOpen ? "h-60" : "w-full h-24"
          }`}>
          {story.mediaType === "image" && (
            <img
              src={story.mediaUrl}
              alt="Story"
              className="object-cover w-full h-full"
            />
          )}
          {story.mediaType === "video" && (
            <video
              src={story.mediaUrl}
              controls
              autoPlay
              muted
              className="object-cover w-full h-full"
            />
          )}
          <div
            className={`absolute flex items-center justify-center gap-1 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-50 py-1 px-2 text-white text-center ${
              isOpen ? "text-sm" : "text-xs"
            } font-semibold`}>
            <img
              src={story.userId.dp}
              className="w-6 h-6 rounded-full"
              alt="DP"
            />
            {story?.userId?.username || "Sample User"}
          </div>
        </div>
      )),
    [isOpen, allStories]
  );

  const handlePrevStory = () => {
    setSelectedStoryIndex(prevIndex =>
      prevIndex === 0 ? (allStories?.length || 1) - 1 : prevIndex - 1
    );
  };

  const handleNextStory = () => {
    setSelectedStoryIndex(prevIndex =>
      prevIndex === (allStories?.length || 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextStory(),
    onSwipedRight: () => handlePrevStory(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <aside
      className={`border-l-2 border-slate-300 dark:border-slate-800 ${
        isOpen ? "md:w-72 w-full" : "w-28"
      } md:block   hidden transition-width duration-300 ease-in-out h-full`}>
      <div className="flex flex-col items-center p-2   bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar">
        <div className="flex justify-center mb-2 w-full">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-800 text-white rounded-full">
            <FaChevronLeft className={`${isOpen ? "hidden" : "block"}`} />
            <FaChevronRight className={`${isOpen ? "block" : "hidden"}`} />
          </button>
        </div>

        <div
          className={`grid gap-2 w-full ${
            isOpen ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}>
          <div
            onClick={() => setShowAddStory(true)}
            className={`relative overflow-hidden rounded-lg transition-all flex flex-col duration-300 ${
              isOpen ? "h-60" : "h-24"
            } bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 hover:dark:bg-slate-800 dark:text-white p-4 cursor-pointer flex items-center justify-center`}>
            <div>
              <IoAddCircleSharp
                size={40}
                className="text-slate-900 dark:text-slate-100 group-hover:text-zinc-800"
              />
            </div>
            <div
              className={`text-slate-900 dark:text-slate-100 font-semibold items-center justify-center align-middle ${
                isOpen ? "text-lg" : "text-sm"
              }`}>
              Add Story
            </div>
          </div>
          {items}
        </div>

        {storyLargeScreen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
            onClick={() => setStoryLargeScreen(false)}>
            <div
              className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xl mx-auto"
              onClick={e => e.stopPropagation()}>
              <div
                className="flex justify-center items-center max-h-xl w-full"
                {...handlers}>
                <button
                  onClick={handlePrevStory}
                  className="text-slate-400 px-4 py-2 rounded-lg">
                  <GiPreviousButton />
                </button>
                <div className="relative rounded-lg transition-all duration-300 h-[calc(100vh-16rem)] w-full">
                  {allStories[selectedStoryIndex].mediaType === "image" ? (
                    <img
                      src={allStories[selectedStoryIndex].mediaUrl}
                      alt="Story"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <video
                      src={allStories[selectedStoryIndex].mediaUrl}
                      controls
                      autoPlay
                      muted
                      className="object-cover w-full h-full"
                    />
                  )}
                  <div className="absolute flex items-center justify-center gap-1 top-0 left-0 bg-gray-900 p-2 text-white text-center text-xs font-semibold">
                    <img
                      src={allStories[selectedStoryIndex].userId.dp}
                      className="w-6 h-6 rounded-full"
                      alt="DP"
                    />
                    {allStories[selectedStoryIndex]?.userId?.username ||
                      "Sample User"}
                  </div>
                  {allStories[selectedStoryIndex].captions && (
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-900 p-2 text-white text-center break-all">
                      {allStories[selectedStoryIndex]?.captions}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleNextStory}
                  className="text-slate-400 px-4 py-2 rounded-lg">
                  <GiNextButton />
                </button>
              </div>
              <div className="flex justify-center m-2">
                <button
                  onClick={() => setStoryLargeScreen(false)}
                  className="text-slate-400 px-4 py-2 rounded-lg">
                  <IoMdCloseCircle />
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddStory && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto">
              <p className="text-center mb-4 text-black dark:text-white">
                Add a new story
              </p>
              <div className="grid w-full max-w-xs items-center gap-1.5 p-4">
                <label
                  htmlFor="media"
                  className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Picture/Video
                </label>
                <input
                  className="w-full rounded-md border border-blue-300 bg-white text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                  type="file"
                  accept="image/*, video/*"
                  id="media"
                  onChange={handleMediaChange}
                />
                {mediaUrl && !isCropping && (
                  <div className="mt-2">
                    {mediaFile?.type.startsWith("video") ? (
                      <video
                        src={mediaUrl}
                        controls
                        className="w-full rounded-md"
                      />
                    ) : (
                      <img
                        src={croppedImageUrl || mediaUrl}
                        alt="Preview"
                        className="w-full rounded-md"
                      />
                    )}
                  </div>
                )}
                <textarea
                  className="bg-slate-200 dark:bg-slate-700 h-20 p-2 rounded-md text-sm text-gray-600 dark:text-white"
                  placeholder="Type here"
                  name="caption"
                  id="caption"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}></textarea>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                {loading ? (
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
                    Uploading...
                  </button>
                ) : (
                  <button
                    onClick={handleAddStory}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                    Add Story
                  </button>
                )}
                <button
                  onClick={handleCancelStory}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isCropping && (
          <ImageCropper
            imageSrc={imageToCrop}
            aspect1={4}
            aspect2={6}
            onCropComplete={handleCropComplete}
            onClose={() => setIsCropping(false)}
          />
        )}
      </div>
    </aside>
  );
};

export default React.memo(RightSidebar);
