import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { UserInfo } from "../../Types/userProfile";
import { Post } from "../../Types/Post";
import {
  FaTextHeight,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaTrash,
  FaHashtag,
} from "react-icons/fa";
import { getPostUsingPostId, updatePost} from "../../API/Post/post";
import { useNavigate, useParams } from "react-router-dom";
import debounce from "../../utils/debouncer";
import { usernameAvailability } from "../../API/Auth/auth";
import "react-toastify/dist/ReactToastify.css";

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

const EditPostMiddlePage: React.FC<AddPostProps> = ({ userDetails }) => {
  const { postId } = useParams<{ postId: string }>();

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

  useEffect(() => {
    const handleGetPost = async () => {
      const postDetails = await getPostUsingPostId(postId);
      setPostData(postDetails.postData);
      setMentionStatuses(
        postDetails.postData.mentions.map((mention: string) => ({
          username: mention,
          available: null,
        }))
      );
      setHashtags(postDetails.postData.hashtags);
    };
    handleGetPost();
  }, []);
 

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
 

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const validMentions = mentionStatuses
      .filter(mention => mention.available === false)
      .map(mention => mention.username);

  
      const dataToSubmit = {
        ...postData,
        mentions: validMentions,
        hashtags: hashtags.filter(hashtag => hashtag.trim() !== ""),
        postId: postId,
      };

    if (
      postData.captions.trim() !== ""
    ) {
      try {
        const response = await updatePost(dataToSubmit);
        if (response.status === "success") {
          toast.success("Post updated successfully");
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          toast.error("Failed to update post");
        }
      } catch (error) {
        toast.error("Failed to update post");
        console.log("Error updating post: ", error);
      }
    } else {
      toast.error("Please make some changes");
    }
  };


  return (
    <main className="flex-1 p-2 bg-gray-800 dark:bg-gray-700 text-black dark:text-white ">
      <ToastContainer />
      <div className="p-2 lg:p-58 rounded-lg bg-gray-100 dark:bg-gray-900 h-full  overflow-auto ">
        <div className="flex flex-row md:flex-row items-center md:items-start bg-slate-200 dark:bg-gray-800 rounded-lg p-2">
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
              {formatDate(Date.now() )}
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
            value={postData?.location}
            placeholder="Add your location here.."
            className="bg-slate-200 dark:bg-gray-800 text-black dark:text-white w-full h-20 p-3 no-scrollbar rounded-lg"
            onChange={handleInputChange}
          />
        </div>
        {/* <button
          className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg  mt-4"
          onClick={handleSubmit}>
          {isUploading ? (
            <Oval height={24} width={24} color="white" secondaryColor="white" />
          ) : (
            "Update Post"
          )}
        </button> */}
        <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Update Post
                </button>
              </div>
      </div>
    </main>
  );
};

export default EditPostMiddlePage;
