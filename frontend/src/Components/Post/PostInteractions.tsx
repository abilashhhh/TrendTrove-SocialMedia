import React, { useState, useEffect } from 'react';
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike, AiOutlineComment } from 'react-icons/ai';
import { FaHashtag, FaUser } from 'react-icons/fa';
import { getPostLikesAndDislikesInfo, likePost, dislikePost } from '../../API/Post/post';
import MentionsHashtagsModal from '../../utils/MentionsHashtagsModal';
import LikesDislikesModal from '../../utils/LikesDislikesModal';

const PostInteractions = ({ post, currentUser  }) => {
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [dislikedPosts, setDislikedPosts] = useState<{ [key: string]: boolean }>({});
  const [likesDislikesData, setLikesDislikesData] = useState<{ [key: string]: { likesCount: number; dislikesCount: number; likedUsers: string[]; dislikedUsers: string[]; }; }>({});
  const [showModal, setShowModal] = useState(false);
  const [showingData, setShowingData] = useState('');
  const [modalData, setModalData] = useState<string[]>([]);
  const [showLikesDislikesModal, setShowLikesDislikesModal] = useState(false);
  const [showingDataLikesDislikes, setShowingDataLikesDislikes] = useState('');
  const [modalLikesDislikes, setModalLikesDislikes] = useState<string[]>([]);

  useEffect(() => {
    fetchLikesDislikesData(post._id);
  }, [post]);

  const fetchLikesDislikesData = async (postId: string) => {
    try {
      const data = await getPostLikesAndDislikesInfo(postId);
      setLikesDislikesData(prev => ({ ...prev, [postId]: data }));
    } catch (error) {
      console.error("Error fetching likes and dislikes data:", error);
    }
  };

  const handleLike = async (postId: string) => {
    const result = await likePost(currentUser._id, postId);
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (dislikedPosts[postId]) {
      setDislikedPosts(prev => ({ ...prev, [postId]: false }));
    }
    fetchLikesDislikesData(postId);
  };

  const handleDislike = async (postId: string) => {
    const result = await dislikePost(currentUser._id, postId);
    setDislikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (likedPosts[postId]) {
      setLikedPosts(prev => ({ ...prev, [postId]: false }));
    }
    fetchLikesDislikesData(postId);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center mt-4">
          <button className={`flex items-center space-x-2 hover:text-blue-600 ${likedPosts[post._id] ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`} onClick={() => handleLike(post._id)}>
            {likedPosts[post._id] ? <AiFillLike className="text-xl md:text-2xl lg:text-3xl" /> : <AiOutlineLike className="text-xl md:text-2xl lg:text-3xl" />}
          </button>
          <button className={`flex items-center space-x-2 hover:text-red-600 ${dislikedPosts[post._id] ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`} onClick={() => handleDislike(post._id)}>
            {dislikedPosts[post._id] ? <AiFillDislike className="text-xl md:text-2xl lg:text-3xl" /> : <AiOutlineDislike className="text-xl md:text-2xl lg:text-3xl" />}
          </button>
          <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
            <AiOutlineComment className="text-xl md:text-2xl lg:text-3xl" />
          </button>
        </div>
        <div className="gap-2 flex mt-4 items-center text-xs cursor-pointer">
          <div className="flex gap-2 cursor-pointer">
            <div title="Hashtags">
              <FaHashtag className="bg-slate-200 dark:bg-slate-700 rounded-full p-1 size-6" onClick={() => { setShowModal(true); setModalData(post.hashtags); setShowingData("Hashtags"); }} />
            </div>
            <div title="Mentions">
              <FaUser className="bg-slate-200 dark:bg-slate-700 rounded-full p-1 size-6" onClick={() => { setShowModal(true); setModalData(post.mentions); setShowingData("Mentions"); }} />
            </div>
          </div>
          <div className="flex flex-col">
            <div title="Likes count" onClick={() => { setShowLikesDislikesModal(true); setModalLikesDislikes(likesDislikesData[post._id]?.likedUsers || []); setShowingDataLikesDislikes("Liked Users"); }}>
              Likes: {likesDislikesData[post._id]?.likesCount || 0}
            </div>
            <div title="Dislikes count" onClick={() => { setShowLikesDislikesModal(true); setModalLikesDislikes(likesDislikesData[post._id]?.dislikedUsers || []); setShowingDataLikesDislikes("Disliked Users"); }}>
              Dislikes: {likesDislikesData[post._id]?.dislikesCount || 0}
            </div>
          </div>
        </div>
      </div>
      <MentionsHashtagsModal isOpen={showModal} onClose={() => setShowModal(false)} title={showingData} data={modalData} />
      <LikesDislikesModal isOpen={showLikesDislikesModal} onClose={() => setShowLikesDislikesModal(false)} title={showingDataLikesDislikes} data={modalLikesDislikes} />
    </div>
  );
};

export default PostInteractions;
