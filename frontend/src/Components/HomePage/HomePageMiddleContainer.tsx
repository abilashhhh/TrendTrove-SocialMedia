import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegSadTear } from "react-icons/fa";
import { StoreType } from "../../Redux/Store/reduxStore";
import {
  dislikePost,
  getAllPostsForUser as fetchAllPostsForUser,
  likePost,
  savePost,
  getLikedPosts,
  getDislikedPosts,
  getPostLikesAndDislikesInfo,
} from "../../API/Post/post";
import { FiMoreVertical } from "react-icons/fi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineComment,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaHashtag, FaMapMarkedAlt, FaUser } from "react-icons/fa";
import MentionsHashtagsModal from "../../utils/MentionsHashtagsModal";
import LikesDislikesModal from "../../utils/LikesDislikesModal";
import PostsDisplayCommon from "../Post/PostsDisplayCommon";
import HomePageRightSidebarMobileView from "./HomePageRightSidebarMobileView";

const MiddleContainer: React.FC = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showingData, setShowingData] = useState("");
  const [modalHashtags, setModalHashtags] = useState<string[]>([]);

  const [showLikesDislikesModal, setShowLikesDislikesModal] = useState(false);
  const [showingDataLikesDislikes, setShowingDataLikesDislikes] = useState("");
  const [modalLikesDislikes, setModalLikesDislikes] = useState<string[]>([]);

  const currentUser = useSelector((state: StoreType) => state.userAuth.user);
  const [posts, setPosts] = useState<any[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<any[]>([]);
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [dislikedPosts, setDislikedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  const [likesDislikesData, setLikesDislikesData] = useState<{
    [key: string]: {
      likesCount: number;
      dislikesCount: number;
      likedUsers: string[];
      dislikedUsers: string[];
    };
  }>({});

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchLikesDislikesData = async (postId: string) => {
    try {
      const data = await getPostLikesAndDislikesInfo(postId);
      setLikesDislikesData(prev => ({ ...prev, [postId]: data }));
    } catch (error) {
      console.error("Error fetching likes and dislikes data:", error);
    }
  };

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => fetchLikesDislikesData(post._id));
    }
  }, [posts]);

  const fetchUserPosts = async (id: string | undefined) => {
    try {
      if (id) {
        const response = await fetchAllPostsForUser();
        console.log("Fetch all user posts:, ", response.data)
        if (response && response.data) {
          setPosts(response.data);
          setVisiblePosts(response.data.slice(0, start)); // Show first 3 posts initially
        } else {
          console.log("No posts of users");
        }
      } else {
        console.log("User ID is undefined");
      }
    } catch (error) {
      console.log("Error getting new posts:", error);
    }
  };

  const fetchUserLikesAndDislikes = async (userId: string | undefined) => {
    try {
      if (userId) {
        const [likedResponse, dislikedResponse] = await Promise.all([
          getLikedPosts(userId),
          getDislikedPosts(userId),
        ]);

        // console.log("Liked posts:", likedResponse);
        // console.log("Disliked posts:", dislikedResponse);getAllPublicPostsForExplore

        if (likedResponse) {
          const likedPostsData = likedResponse.likedPosts.reduce(
            (acc: { [key: string]: boolean }, post: any) => {
              if (post.userId === userId) {
                acc[post.postId] = true;
              }
              return acc;
            },
            {}
          );
          setLikedPosts(likedPostsData);
        }

        if (dislikedResponse) {
          const dislikedPostsData = dislikedResponse.dislikedPosts.reduce(
            (acc: { [key: string]: boolean }, post: any) => {
              if (post.userId === userId) {
                acc[post.postId] = true;
              }
              return acc;
            },
            {}
          );
          setDislikedPosts(dislikedPostsData);
        }
      }
    } catch (error) {
      console.log("Error fetching liked and disliked posts:", error);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchUserPosts(currentUser._id);
      fetchUserLikesAndDislikes(currentUser._id);
    }
  }, [currentUser?._id]);

  const handleSavePost = async (postId: string) => {
    console.log("handleSavePost: ", postId);
    const response = await savePost(currentUser?._id, postId);
    if (response.status === "success") {
      toast.success("Post saved successfully");
    } else {
      toast.error("Error saving post");
    }
  };

  const handleLike = async (postId: string) => {
    const result = await likePost(currentUser._id, postId);
    console.log("Result of handleLike: ", result);

    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (dislikedPosts[postId]) {
      setDislikedPosts(prev => ({
        ...prev,
        [postId]: false,
      }));
    }
    fetchLikesDislikesData(postId);
  };

  const handleDislike = async (postId: string) => {
    const result = await dislikePost(currentUser._id, postId);
    console.log("Result of handleDislike: ", result);

    setDislikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    if (likedPosts[postId]) {
      setLikedPosts(prev => ({
        ...prev,
        [postId]: false,
      }));
    }

    fetchLikesDislikesData(postId);
  };

  const toggleOptions = (postId: string) => {
    if (showOptions === postId) {
      setShowOptions(null);
    } else {
      setShowOptions(postId);
    }
  };

  const start = 3 + page * 3;
  const end = start + 3;
  const loadMorePosts = useCallback(() => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setVisiblePosts(prevVisiblePosts => [
          ...prevVisiblePosts,
          ...posts.slice(start, end),
        ]);
        setPage(prevPage => prevPage + 1);
        setLoading(false);
      }, 1500);
    }
  }, [loading, page, posts]);

  const lastPostElementRef = useCallback(
    (node: Element) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && visiblePosts.length < posts.length) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadMorePosts, visiblePosts.length, posts.length]
  );

  return (
    <main className="flex-1  overflow-auto no-scrollbar bg-gray-800 dark:bg-gray-700 text-white items-center justify-center">
      <ToastContainer />
      <div className="lg:hidden md:hidden">
        <HomePageRightSidebarMobileView />
      </div>

      <div className=" bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar sm:pl-4 sm:pr-4 md:pl-36 md:pr-36 lg:pl-56 lg:pr-56 xl:pl-72 xl:pr-72 2xl:pl-96 2xl:pr-96">
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post, index) => (
            <div
              key={post._id}
              className="p-2 m-2 border border-slate-300 dark:border-slate-800 mb-4 rounded-lg bg-white dark:bg-gray-800 "
              ref={
                visiblePosts.length === index + 1 ? lastPostElementRef : null
              }>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={post.userId.dp}
                    alt=""
                    className="rounded-full h-10 w-10"
                    onClick={() => navigate(`/profiles/${post.userId.username}`)}
                  />
                  <div>
                    <p
                      className="font-bold"
                      onClick={() => navigate(`/profiles/${post.userId.username}`)}>
                      {post.userId.username}
                    </p>
                    {post.location && (
                      <p className="text-xs flex gap-2 m-1 text-gray-500 dark:text-gray-400 font-extralight break-all">
                        <FaMapMarkedAlt /> {post.location}
                      </p>
                    )}
                    <p className="text-xs font-extralight text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs font-light cursor-text text-slate-400 dark:text-slate-500">
                      {post.createdAt !== post.updatedAt ? "Edited" : ""}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    className="focus:outline-none mr-2"
                    onClick={() => toggleOptions(post._id)}>
                    <FiMoreVertical className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {showOptions === post._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-xs border cursor-pointer border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <p
                        onClick={() => navigate(`/profiles/${post.userId.username}`)}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        View Profile
                      </p>
                      <p
                        onClick={() => navigate(`/reportPost/${post._id}`)}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Report Post
                      </p>
                      <p
                        onClick={() => handleSavePost(post._id)}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
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
                    className={`flex items-center space-x-2 hover:text-blue-600 ${
                      likedPosts[post._id]
                        ? "text-blue-600"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                    onClick={() => handleLike(post._id)}>
                    {likedPosts[post._id] ? (
                      <AiFillLike
                        title="Like Post"
                        className="text-xl md:text-2xl lg:text-3xl"
                      />
                    ) : (
                      <AiOutlineLike
                        title="Like Post"
                        className="text-xl md:text-2xl lg:text-3xl"
                      />
                    )}
                  </button>
                  <button
                    className={`flex items-center space-x-2 hover:text-red-600 ${
                      dislikedPosts[post._id]
                        ? "text-red-600"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                    onClick={() => handleDislike(post._id)}>
                    {dislikedPosts[post._id] ? (
                      <AiFillDislike
                        title="Disike Post"
                        className="text-xl md:text-2xl lg:text-3xl"
                      />
                    ) : (
                      <AiOutlineDislike
                        title="Disike Post"
                        className="text-xl md:text-2xl lg:text-3xl"
                      />
                    )}
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
                    <AiOutlineComment
                      title="Add a comment"
                      className="text-xl md:text-2xl lg:text-3xl"
                      onClick={() => navigate(`/post/${post._id}`)}
                    />
                  </button>
                </div>
                <div className="flex gap-5 text-center items-center justify-center">
                  <div className="flex gap-2 mt-4 cursor-pointer">
                    <div title="Hashtags">
                      <FaHashtag
                        className="bg-slate-200 dark:bg-slate-700 rounded-full p-1 size-6"
                        onClick={() => {
                          setShowModal(true);
                          setModalHashtags(post.hashtags);
                          setShowingData("Hashtags");
                        }}
                      />
                    </div>
                    <div title="Mentions">
                      <FaUser
                        className="bg-slate-200 dark:bg-slate-700 rounded-full p-1 size-6"
                        onClick={() => {
                          setShowModal(true);
                          setModalHashtags(post.mentions);
                          setShowingData("Mentions");
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2 cursor-pointer">
                    <p
                      className="text-xs mt-2"
                      title="Likes count"
                      onClick={() => {
                        setShowLikesDislikesModal(true);
                        setModalLikesDislikes(
                          likesDislikesData[post._id].likesdislikesinfo
                            ?.likedUsers
                        );
                        setShowingDataLikesDislikes("Liked Users");
                      }}>
                      Likes:{" "}
                      {(likesDislikesData[post._id] &&
                        likesDislikesData[post._id].likesdislikesinfo
                          ?.likesCount) ||
                        0}
                    </p>
                    <p className="text-xs mt-2">|</p>
                    <p
                      className="text-xs mt-2"
                      title="Dislikes count"
                      onClick={() => {
                        setShowLikesDislikesModal(true);
                        setModalLikesDislikes(
                          likesDislikesData[post._id].likesdislikesinfo
                            ?.dislikedUsers
                        );
                        setShowingDataLikesDislikes("Disliked Users");
                      }}>
                      Dislikes:{" "}
                      {(likesDislikesData[post._id] &&
                        likesDislikesData[post._id].likesdislikesinfo
                          ?.dislikesCount) ||
                        0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-slate-900 p-4">
            <FaRegSadTear className="text-6xl text-gray-500 dark:text-gray-200  mb-4" />
            <p className="text-xl ">No Posts available</p>
          </div>
        )}
      </div>
      {loading && (
        <div className="flex items-center justify-center p-4 bg-slate-300 dark:bg-slate-900">
          <div className="p-3 animate-spin bg-gradient-to-bl from-slate-400 via-slate-700 to-slate-900 w-10 h-10 rounded-full flex items-center justify-center">
            <div className="rounded-full h-full w-full flex items-center justify-center"></div>
          </div>
          <p className="text-lg text-blue-500 ml-4">Loading posts...</p>
        </div>
      )}


      <MentionsHashtagsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={showingData}
        data={modalHashtags}
      />

      <LikesDislikesModal
        isOpen={showLikesDislikesModal}
        onClose={() => setShowLikesDislikesModal(false)}
        title={showingDataLikesDislikes}
        data={modalLikesDislikes}
      />
    </main>
  );
};

export default MiddleContainer;
