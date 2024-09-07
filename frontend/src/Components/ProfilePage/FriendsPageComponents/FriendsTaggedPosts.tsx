 

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkedAlt, FaRegSadTear } from "react-icons/fa";
import { AiOutlineLike, AiOutlineDislike, AiOutlineComment, AiFillLike, AiFillDislike } from "react-icons/ai";
import { FiMoreVertical } from 'react-icons/fi';
import { fetchAllPostsForUserUsingUsername, getLikedPosts, getDislikedPosts, getPostLikesAndDislikesInfo, savePost, getPostsLengthOfTheUser, likePost, dislikePost, fetchTaggedPostsOfTheCurrentUser, fetchTaggedPostsOfUserUsingUsername } from "../../../API/Post/post";
import useUserDetails from "../../../Hooks/useUserDetails";
import PostsDisplayCommon from '../../Post/PostsDisplayCommon';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiMapPin2Fill } from "react-icons/ri";

interface Post {
  userId: any;
  _id: string;
  dp: string;
  username: string;
  location?: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

const FriendsTaggedPosts = ({ username }: { username: string }) => {
  const currentUser = useUserDetails();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [dislikedPosts, setDislikedPosts] = useState<{ [key: string]: boolean }>({});
  const [likesDislikesData, setLikesDislikesData] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const toggleOptions = (postId: string) => {
    setShowOptions(showOptions === postId ? null : postId);
  };


  console.log("username : ",username)

  const fetchUserPosts = async (username: string) => {
    try {
      const response = await fetchTaggedPostsOfUserUsingUsername(username);
      console.log("responjse : ", response)
      if (response && response) {
        setPosts(response);
      } else {
        console.log("No posts found for the user");
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const fetchUserLikesAndDislikes = async (userId: string) => {
    try {
      const [likedResponse, dislikedResponse] = await Promise.all([
        getLikedPosts(userId),
        getDislikedPosts(userId),
      ]);

      if (likedResponse) {
        const likedPostsData = likedResponse.likedPosts.reduce(
          (acc: { [key: string]: boolean }, post: any) => {
            acc[post.postId] = true;
            return acc;
          },
          {}
        );
        setLikedPosts(likedPostsData);
      }

      if (dislikedResponse) {
        const dislikedPostsData = dislikedResponse.dislikedPosts.reduce(
          (acc: { [key: string]: boolean }, post: any) => {
            acc[post.postId] = true;
            return acc;
          },
          {}
        );
        setDislikedPosts(dislikedPostsData);
      }
    } catch (error) {
      console.error("Error fetching liked and disliked posts:", error);
    }
  };

  const fetchLikesDislikesData = async (postId: string) => {
    try {
      const data = await getPostLikesAndDislikesInfo(postId);
      setLikesDislikesData(prev => ({ ...prev, [postId]: data }));
    } catch (error) {
      console.error("Error fetching likes and dislikes data:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await likePost(currentUser._id,  postId);
      if (response.status === "success") {
        fetchLikesDislikesData(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setDislikedPosts(prev => ({ ...prev, [postId]: false }));
      } else {
        toast.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async (postId: string) => {
    try {
      const response = await dislikePost(currentUser._id, postId);
      if (response.status === "success") {
        fetchLikesDislikesData(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        setDislikedPosts(prev => ({ ...prev, [postId]: true }));
      } else {
        toast.error("Failed to dislike post");
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleSavePost = async (postId: string) => {
    try {
      const response = await savePost(currentUser?._id, postId);
      if (response.status === "success") {
        toast.success("Post saved successfully");
      } else {
        toast.error("Error saving post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUserPosts(username)
      .then(() => setIsLoading(false))
      .catch(err => {
        console.error("Error fetching user posts:", err);
        setIsLoading(false);
      });
  }, [username]);

  useEffect(() => {
    if (currentUser?._id) {
      fetchUserLikesAndDislikes(currentUser._id);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => fetchLikesDislikesData(post._id));
    }
  }, [posts]);

 
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-lg bg-gray-100 sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 xl:grid-cols-3 gap-1 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar justify-center">
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id} className="p-2 m-2 border mb-4 rounded-lg bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={post?.userId?.dp}
                  alt=""
                  className="rounded-full h-10 w-10"
                  onClick={() => navigate(`/profiles/${post?.userId?.username}`)}
                />
                <div>
                  <p className="font-bold" onClick={() => navigate(`/profiles/${post?.userId?.username}`)}>
                    {post?.userId?.username}
                  </p>
                  {post.location && (
                    <p className="text-xs flex gap-2 m-1 text-gray-500 dark:text-gray-400 font-extralight text-center items-center">
                 <RiMapPin2Fill />{post.location}
                    </p>
                  )}
                  <p className="text-xs font-extralight text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button className="focus:outline-none mr-2" onClick={() => toggleOptions(post._id)}>
                  <FiMoreVertical className="text-gray-500 dark:text-gray-400" />
                </button>
                {showOptions === post._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-xs border cursor-pointer border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <p onClick={() => navigate(`/profiles/${post?.userId?.username}`)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      View Profile
                    </p>
                    <p onClick={() => navigate(`/reportPost/${post._id}`)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Report Post
                    </p>
                    <p onClick={() => handleSavePost(post._id)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Save Post
                    </p>
                  </div>
                )}
              </div>
            </div>
            <PostsDisplayCommon post={post} />
            <div className="flex justify-between">
              <div className="flex gap-2 items-center mt-4">
                <button
                  className={`flex items-center space-x-2 hover:text-blue-600 ${likedPosts[post._id] ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
                  onClick={() => handleLike(post._id)}>
                  {likedPosts[post._id] ? (
                    <AiFillLike className="text-xl md:text-2xl lg:text-3xl" />
                  ) : (
                    <AiOutlineLike className="text-xl md:text-2xl lg:text-3xl" />
                  )}
                </button>
                <button
                  className={`flex items-center space-x-2 hover:text-red-600 ${dislikedPosts[post._id] ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}
                  onClick={() => handleDislike(post._id)}>
                  {dislikedPosts[post._id] ? (
                    <AiFillDislike className="text-xl md:text-2xl lg:text-3xl" />
                  ) : (
                    <AiOutlineDislike className="text-xl md:text-2xl lg:text-3xl" />
                  )}
                </button>
                <button onClick={() => navigate(`/post/${post._id}`)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
                  <AiOutlineComment className="text-xl md:text-2xl lg:text-3xl" />
                </button>
              </div>
              <div className="flex gap-2 mt-4 cursor-pointer">
                <p className="text-xs mt-2">Likes: {(likesDislikesData[post._id]?.likesdislikesinfo?.likesCount) || 0}</p>
                <p className="text-xs mt-2">|</p>
                <p className="text-xs mt-2">Dislikes: {(likesDislikesData[post._id]?.likesdislikesinfo?.dislikesCount) || 0}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col text-center items-center justify-center h-full bg-gray-100 dark:bg-slate-900 p-4">
        <FaRegSadTear className="text-6xl text-gray-500 dark:text-gray-200  mb-4" />
        <p className="text-xl text-gray-500 dark:text-gray-200 ">No posts available</p>
      </div>
      )}
    </div>
  );
};

export default FriendsTaggedPosts;
