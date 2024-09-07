import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store/reduxStore";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  dislikePost,
  likePost,
  getLikedPosts,
  getDislikedPosts,
  getPostLikesAndDislikesInfo,
  fetchPostsOfTheCurrentUser,
  removeTaggedPostForUser,
  fetchTaggedPostsOfTheCurrentUser,
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
import { FaHashtag, FaMapMarkedAlt, FaRegSadTear, FaUser } from "react-icons/fa";
import MentionsHashtagsModal from "../../utils/MentionsHashtagsModal";
import LikesDislikesModal from "../../utils/LikesDislikesModal";
import PostsDisplayCommon from "./PostsDisplayCommon";

const TaggedPostComponent = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [taggedPosts, setTaggedPosts] = useState<any[]>([]);
  const currentUser = useSelector((state: StoreType) => state.userAuth.user);
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

  const [showModal, setShowModal] = useState(false);
  const [showingData, setShowingData] = useState("");
  const [modalHashtags, setModalHashtags] = useState<string[]>([]);

  const [showLikesDislikesModal, setShowLikesDislikesModal] = useState(false);
  const [showingDataLikesDislikes, setShowingDataLikesDislikes] = useState("");
  const [modalLikesDislikes, setModalLikesDislikes] = useState<string[]>([]);

  const fetchUserLikesAndDislikes = async (userId: string | undefined) => {
    try {
      if (userId) {
        const [likedResponse, dislikedResponse] = await Promise.all([
          getLikedPosts(userId),
          getDislikedPosts(userId),
        ]);

        // console.log("Liked posts:", likedResponse);
        // console.log("Disliked posts:", dislikedResponse);

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
      // console.log("Error fetching liked and disliked posts:", error);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      const fetchData = async () => {
        const data = await fetchPostsOfTheCurrentUser();
        // console.log("data : ", data);
        if (data) {
          setPosts(data);
        }
        const taggedPostData = await fetchTaggedPostsOfTheCurrentUser();
        // console.log("taggedPostData : ", taggedPostData);
        if (taggedPostData) {
          setTaggedPosts(taggedPostData);
        }
        fetchUserLikesAndDislikes(currentUser._id);
      };
      fetchData();
    }
  }, [currentUser?._id]);

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

  const handleLike = async (postId: string) => {
    const result = await likePost(currentUser._id, postId);
    // console.log("Result of handleLike: ", result);

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
    // console.log("Result of handleDislike: ", result);

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

  const [showOptions, setShowOptions] = useState<string | null>(null);

  const toggleOptions = (postId: string) => {
    if (showOptions === postId) {
      setShowOptions(null);
    } else {
      setShowOptions(postId);
    }
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: () => (
      <div className="w-5 h-0.5 rounded-lg mt-2 bg-gray-500 dark:bg-gray-500"></div>
    ),
    dotsClass: "slick-dots slick-thumb flex justify-center",
  };

  const handleRemoveTag = async (postId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This post will be removed from the tagged list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async result => {
      if (result.isConfirmed) {
        console.log("removing post, postId:", postId);
        await removeTaggedPostForUser(currentUser._id, postId);

        Swal.fire(
          "Removed!",
          "Your post has been removed from tagged list.",
          "success"
        );
        window.location.reload();
      }
    });
  };

  return (
    <>
      <div className="rounded-lg bg-gray-100 sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 xl:grid-cols-3 gap-1 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar justify-center">
        {taggedPosts.length > 0 ? (
          taggedPosts.map(post => (
            <div
              key={post._id}
              className="p-2 m-2 border mb-4 rounded-lg bg-white dark:bg-gray-800">
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
                      <p className="text-xs flex gap-2 m-1 text-gray-500 dark:text-gray-400 font-extralight">
                        <FaMapMarkedAlt /> {post.location}
                      </p>
                    )}
                    <p className="text-xs font-extralight text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleString()}
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
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-xs border border-gray-300 dark:border-gray-700 cursor-pointer rounded-lg shadow-lg z-10">
                      <p
                        onClick={() => handleRemoveTag(post._id)}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Remove tag
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
                      <AiFillLike className="text-xl md:text-2xl lg:text-3xl" />
                    ) : (
                      <AiOutlineLike className="text-xl md:text-2xl lg:text-3xl" />
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
                      <AiFillDislike className="text-xl md:text-2xl lg:text-3xl" />
                    ) : (
                      <AiOutlineDislike className="text-xl md:text-2xl lg:text-3xl" />
                    )}
                  </button>
                  <button  onClick={() => navigate(`/post/${post._id}`)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
                    <AiOutlineComment className="text-xl md:text-2xl lg:text-3xl" />
                  </button>
                </div>
                <div>
                  <div className="gap-2  flex mt-4 items-center text-xs cursor-pointer">
                    <div className="flex gap-2  cursor-pointer">
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

                    <div className="flex flex-col">
                      <div
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
                        {likesDislikesData[post._id]?.likesdislikesinfo
                          ?.likesCount || 0}
                      </div>

                      <div
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
                        {likesDislikesData[post._id]?.likesdislikesinfo
                          ?.dislikesCount || 0}
                      </div>
                    </div>
                  </div>
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
    </>
  );
};

export default TaggedPostComponent;
