import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useUserDetails from "../../Hooks/useUserDetails";
import PostsDisplayCommon from "../Post/PostsDisplayCommon";
import {
  addCommentToPost,
  deleteCommentFromPost,
  editComment,
  getAllCommentsForThisPost,
  getPostUsingPostId,
  handleAddReplyToComment,
} from "../../API/Post/post";
import LoadingSpinner from "../LoadingSpinner";
import { Post } from "../../Types/Post";
import MentionsHashtagsModal from "../../utils/MentionsHashtagsModal";
import LikesDislikesModal from "../../utils/LikesDislikesModal";
import {
  FaMapMarkedAlt,
  FaHashtag,
  FaUser,
  FaPaperPlane,
  FaTrash,
  FaPen,
  FaReply,
} from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineComment,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import {
  dislikePost,
  getAllPostsForUser as fetchAllPostsForUser,
  likePost,
  savePost,
  getLikedPosts,
  getDislikedPosts,
  getPostLikesAndDislikesInfo,
} from "../../API/Post/post";

const CommentsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const getAllComments = async (postId: string | undefined) => {
    const allComments = await getAllCommentsForThisPost(postId);
    setComments(allComments.data);
    setCommentText("");
  };

  useEffect(() => {
    getAllComments(postId);
  }, []);

  const userDetails = useUserDetails();
  const navigate = useNavigate();
  const [post, setPostDetails] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState(false);
  const [showingData, setShowingData] = useState("");
  const [modalHashtags, setModalHashtags] = useState<string[]>([]);

  const [showLikesDislikesModal, setShowLikesDislikesModal] = useState(false);
  const [showingDataLikesDislikes, setShowingDataLikesDislikes] = useState("");
  const [modalLikesDislikes, setModalLikesDislikes] = useState<string[]>([]);

  const [posts, setPosts] = useState<any[]>([]);
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const [showCommentsSection, setShowCommentsSection] = useState<boolean>(true);
  const toggleShowCommentsSection = () => {
    setShowCommentsSection(!showCommentsSection);
  };

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

  const fetchLikesDislikesData = async (postId: string) => {
    try {
      const data = await getPostLikesAndDislikesInfo(postId);
      setLikesDislikesData(prev => ({ ...prev, [postId]: data }));
    } catch (error) {
      // console.error("Error fetching likes and dislikes data:", error);
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
        if (response && response.data) {
          setPosts(response.data);
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
    if (userDetails?._id) {
      fetchUserPosts(userDetails?._id);
      fetchUserLikesAndDislikes(userDetails?._id);
    }
  }, [userDetails?._id]);

  const handleSavePost = async (postId: string) => {
    console.log("handleSavePost: ", postId);
    const response = await savePost(userDetails._id, postId);
    if (response.status === "success") {
      toast.success("Post saved successfully");
    } else {
      toast.error("Error saving post");
    }
  };

  const handleLike = async (postId: string) => {
    const result = await likePost(userDetails._id, postId);
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
    const result = await dislikePost(userDetails._id, postId);
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

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await getPostUsingPostId(postId);
        setPostDetails(response.postData);
      } catch (error) {
        // console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <p>Post not found</p>
        </div>
      </Layout>
    );
  }

  const handleAddComment = async () => {
    if (commentText.trim() !== "") {
      const userComment = {
        postId,
        userId: userDetails?._id,
        comment: commentText,
        username: userDetails.username,
        dp: userDetails.dp,
        createdAt: new Date().toISOString(),
      };

      const res = await addCommentToPost(userComment);
      // console.log("Res: ", res);

      if (res.status === "success") {
        toast.success("Comment added");
        getAllComments(postId);
      } else {
        toast.error("Comment not added");
      }
    }
  };

  const handleReplyComment = (commentId: React.SetStateAction<null>) => {
    setReplyingTo(commentId);
  };

  const handleAddReply = async (commentId: any) => {
    if (replyText.trim() !== "") {
      const userReply = {
        commentId,
        postId,
        userId: userDetails?._id,
        username: userDetails.username,
        dp: userDetails.dp,
        reply: replyText,
        createdAt: new Date().toISOString(),
      };

      const res = await handleAddReplyToComment(userReply);
      // console.log("Res: ", res);

      if (res.status === "success") {
        setReplyingTo(null);
        setReplyText("");

        toast.success("Reply added");
        getAllComments(postId);
      } else {
        toast.error("Reply not added");
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const res = await deleteCommentFromPost(commentId);
    // console.log("Res: ", res);

    if (res?.deleteComment?.status === "success") {
      toast.success("Comment deleted");
    } else {
      toast.error("Comment not deleted");
    }
    getAllComments(postId);
  };

  const startEditingComment = (commentId: string, currentComment: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentComment);
  };

  const handleSaveEditedComment = async () => {
    if (editedCommentText.trim() !== "" && editingCommentId) {
      const res = await editComment(editingCommentId, editedCommentText);
      if (res.status === "success") {
        toast.success("Comment edited successfully");
        getAllComments(postId);
        setEditingCommentId(null);
        setEditedCommentText("");
        getAllComments(postId);
      } else {
        toast.error("Failed to edit comment");
      }
    }
  };

  return (
    <>
      <Layout>
        <ToastContainer />
        <main className=" w-full   text-black dark:text-white items-center">
          <div className="bg-gray-100 w-full h-full   dark:bg-gray-900   overflow-x-hidden  overflow-y-auto no-scrollbar ">
            <div className="flex flex-col lg:flex-row w-full h-full  justify-center">
              <div className="bg-slate-100 dark:bg-slate-900    -ml-2 lg:m-2 flex justify-center items-center ">
                <div className="lg:w-7/10 w-full flex justify-center items-center ">
                  <div className="max-w-2xl w-full h-full rounded-lg m-2  items-center ">
                    <div className="bg-white dark:bg-gray-800 rounded-lg  shadow-lg p-4 items-center ">
                      <div className="flex items-center  mb-4 ">
                        <img
                          src={post.userId?.dp}
                          alt=""
                          className="rounded-full h-10 w-10 mr-4 cursor-pointer"
                          onClick={() => navigate(`/profiles/${post.userId?.username}`)}
                        />
                        <div>
                          <p
                            className="font-bold cursor-pointer"
                            onClick={() =>
                              navigate(`/profiles/${post.userId?.username}`)
                            }>
                            {post.userId?.username}
                          </p>
                          {post.location && (
                            <p className="text-xs flex items-center text-gray-500 dark:text-gray-400 font-light">
                              <FaMapMarkedAlt className="mr-1" />{" "}
                              {post.location}
                            </p>
                          )}
                          <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="ml-auto relative">
                          <button
                            className="focus:outline-none"
                            onClick={() => toggleOptions(post._id)}>
                            <FiMoreVertical className="text-gray-500 dark:text-gray-400" />
                          </button>
                          {showOptions === post._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-xs border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                              <p
                                className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() =>
                                  navigate(`/profiles/${post.userId?.username}`)
                                }>
                                View Profile
                              </p>
                              <p
                                className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() =>
                                  navigate(`/reportPost/${post._id}`)
                                }>
                                Report Post
                              </p>
                              <p
                                className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSavePost(post._id)}>
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
                                title="Dislike Post"
                                className="text-xl md:text-2xl lg:text-3xl"
                              />
                            ) : (
                              <AiOutlineDislike
                                title="Dislike Post"
                                className="text-xl md:text-2xl lg:text-3xl"
                              />
                            )}
                          </button>
                          <button
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600"
                            onClick={() => navigate(`/post/${post._id}`)}>
                            <AiOutlineComment
                              title="Add a comment"
                              onClick={toggleShowCommentsSection}
                              className="text-xl md:text-2xl lg:text-3xl"
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
                                  likesDislikesData[post._id]?.likesdislikesinfo
                                    ?.likedUsers || []
                                );
                                setShowingDataLikesDislikes("Liked Users");
                              }}>
                              Likes:{" "}
                              {likesDislikesData[post._id]?.likesdislikesinfo
                                ?.likesCount || 0}
                            </p>
                            <p className="text-xs mt-2">|</p>
                            <p
                              className="text-xs mt-2"
                              title="Dislikes count"
                              onClick={() => {
                                setShowLikesDislikesModal(true);
                                setModalLikesDislikes(
                                  likesDislikesData[post._id]?.likesdislikesinfo
                                    ?.dislikedUsers || []
                                );
                                setShowingDataLikesDislikes("Disliked Users");
                              }}>
                              Dislikes:{" "}
                              {likesDislikesData[post._id]?.likesdislikesinfo
                                ?.dislikesCount || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showCommentsSection && (
                <div className="bg-white text-black dark:text-white p-2 sm:mt-2 lg:m-2 flex-grow   dark:bg-gray-900 sm:mr-4 border-l-2 border-slate-300 dark:border-slate-800 pl-4">
                  <div className="flex flex-col h-full w-full">
                    <div className="flex-grow overflow-y-auto overflow-x-hidden no-scrollbar w-full">
                      {comments.length > 0 ? (
                        comments.map(comment => (
                          <div
                            key={comment._id}
                            className="flex items-start justify-between overflow-wrap break-all mt-4 w-full bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
                            <div className="flex items-start flex-col w-full">
                              <div className="flex flex-row gap-2 w-full justify-between items-center">
                                <div className="flex w-full gap-2 items-center">
                                  <img
                                    src={comment.dp}
                                    alt=""
                                    className="rounded-full h-8 w-8 mr-2 cursor-pointer"
                                    onClick={() =>
                                      navigate(`/profiles/${comment.username}`)
                                    }
                                  />
                                  <p
                                    className="font-bold cursor-pointer"
                                    onClick={() =>
                                      navigate(`/profiles/${comment.username}`)
                                    }>
                                    {comment.username}
                                  </p>
                                  <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleString()}
                                  </p>
                                  <p className="text-xs font-light text-slate-400 dark:text-slate-500">
                                    {comment.createdAt !== comment.updatedAt
                                      ? "Edited"
                                      : ""}
                                  </p>
                                </div>
                                <div className="flex justify-end items-center ml-4 gap-2 w-full">
                                  {comment.userId === userDetails._id ? (
                                    <>
                                      <button
                                        className="text-blue-500 hover:text-blue-600 focus:outline-none"
                                        onClick={() =>
                                          startEditingComment(
                                            comment._id,
                                            comment.comment
                                          )
                                        }>
                                        <div className="flex gap-1 items-center">
                                          Edit <FaPen />
                                        </div>
                                      </button>
                                      <button
                                        className="ml-2 text-red-500 hover:text-red-600 focus:outline-none"
                                        onClick={() =>
                                          handleDeleteComment(comment._id)
                                        }>
                                        <div className="flex gap-1 items-center">
                                          Delete <FaTrash />
                                        </div>
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      className="text-green-500 hover:text-green-600 focus:outline-none"
                                      onClick={() =>
                                        handleReplyComment(comment._id)
                                      }>
                                      <div className="flex gap-1 items-center">
                                        Reply <FaReply />
                                      </div>
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="overflow-x-hidden w-full">
                                {editingCommentId === comment._id ? (
                                  <div className="flex flex-col mt-2 w-full">
                                    <textarea
                                      className="w-full h-32 p-4 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                      value={editedCommentText}
                                      onChange={e =>
                                        setEditedCommentText(e.target.value)
                                      }></textarea>
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(null);
                                          setEditedCommentText("");
                                        }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none">
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleSaveEditedComment}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-1 flex flex-wrap text-gray-700 dark:text-gray-300">
                                    {comment.comment}
                                  </div>
                                )}
                                {replyingTo === comment._id && (
                                  <div className="mt-2">
                                    <textarea
                                      className="w-full h-24 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                      value={replyText}
                                      onChange={e =>
                                        setReplyText(e.target.value)
                                      }></textarea>
                                    <div className="flex justify-end mt-2">
                                      <button
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none mr-2"
                                        onClick={() => setReplyingTo(null)}>
                                        Cancel
                                      </button>
                                      <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                        onClick={() =>
                                          handleAddReply(comment._id)
                                        }>
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {comment.replies.length > 0 && (
                                  <div>
                                    <button
                                      className="text-red-600"
                                      onClick={() =>
                                        setShowReplies(prev =>
                                          prev === comment._id
                                            ? null
                                            : comment._id
                                        )
                                      }>
                                      {showReplies === comment._id
                                        ? "Hide Replies"
                                        : `Show ${comment.replies.length} replies`}
                                    </button>
                                    {showReplies === comment._id && (
                                      <div>
                                        {comment.replies.map(reply => (
                                          <div
                                            key={reply._id}
                                            className="ml-8 mt-2 p-2 border-l-2 border-gray-200 dark:border-gray-600">
                                            <div className="flex flex-row gap-2 items-center">
                                              <div>
                                                <img
                                                  src={reply.dp}
                                                  className="w-6 h-6 rounded-full"
                                                  alt=""
                                                />
                                              </div>
                                              <div className="flex flex-row gap-2 items-center">
                                                <p className="text-sm font-semibold">
                                                  {reply.username}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                  {new Date(
                                                    reply.createdAt
                                                  ).toLocaleString()}
                                                </p>
                                              </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">
                                              {reply.reply}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                          No comments yet.
                        </p>
                      )}
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-bold flex flex-col sm:flex-row items-center m-1 sticky bottom-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center m-1 sticky bottom-0 w-full">
                        <div className="flex items-center gap-2 mb-2 sm:mb-0 sm:mr-4">
                          <img
                            src={userDetails.dp}
                            alt="DP"
                            className="w-6 h-6 rounded-full hidden sm:block"
                          />
                          <div className="lg:mr-4 hidden sm:block">
                            <h1 className="text-s font-bold">
                              {userDetails.username}
                            </h1>
                            <p className="text-xs font-extralight text-gray-500 dark:text-gray-400">
                              {new Date().toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row items-center w-full sm:ml-4">
                          <input
                            type="text"
                            placeholder="Add a comment"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            className="bg-gray-100 border-2   dark:bg-gray-700 w-full p-2 rounded-md"
                          />
                          <button
                            type="submit"
                            className="ml-2 sm:ml-4 bg-slate-500 text-white p-2 rounded-md hover:bg-slate-600 transition-colors flex items-center gap-2"
                            onClick={handleAddComment}>
                            <FaPaperPlane />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
        </main>
      </Layout>
    </>
  );
};

export default CommentsPage;
