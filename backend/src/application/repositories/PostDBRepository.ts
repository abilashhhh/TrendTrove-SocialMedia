import { PostRepositoryMongoDB } from "../../frameworks/database/mongodb/respositories/postRepositoryDatabase";
import {
  Comment,
  CommentInterface,
  ReplyInterface,
} from "../../types/commentInterface";
import {
  PostDataInterface,
  ReportPostInterface,
  StoryInterface,
  highlightsInterface,
} from "../../types/postsInterface";

export const postDBRepository = (
  repository: ReturnType<PostRepositoryMongoDB>
) => {
  const addNewPost = async (postData: PostDataInterface) => {
    await repository.addNewPost(postData);
  };

  const addNewStory = async (storyData: StoryInterface) => {
    await repository.addNewStory(storyData);
  };

  const taggedDataFromPosts = async (usernames: string[], postId: string) => {
    await repository.taggedDataFromPosts(usernames, postId);
  };

  const getPostById = async (postId: string) => {
    return await repository.getPostById(postId);
  };

  const updatePost = async (postData: PostDataInterface) => {
    await repository.updatePost(postData);
  };

  const getAllPostsForUser = async (id: string) =>
    await repository.getAllPostsForUser(id);

  const getAllPostsForUserUsername = async (username: string) =>
    await repository.getAllPostsForUserUsername(username);

  const getAllTaggedPostsForUserUsername = async (username: string) =>
    await repository.getAllTaggedPostsForUserUsername(username);

  const lengthofPostsForUser = async (username: string) =>
    await repository.lengthofPostsForUser(username);

  const getAllPostsForCurrentUser = async (id: string) =>
    await repository.getAllPostsForCurrentUser(id);

  const getAllSavedPostsForCurrentUser = async (id: string) =>
    await repository.getAllSavedPostsForCurrentUser(id);

  const getAllTaggedPostsForCurrentUser = async (id: string) =>
    await repository.getAllTaggedPostsForCurrentUser(id);

  const getParticularPostsForCurrentUser = async (id: string) =>
    await repository.getParticularPostsForCurrentUser(id);

  const reportPostsForUser = async (data: ReportPostInterface) =>
    await repository.reportPostsForUser(data);

  const savePostsForUser = async (userId: string, postId: string) =>
    await repository.savePostsForUser(userId, postId);

  const removeSavePostsForUser = async (userId: string, postId: string) =>
    await repository.removeSavePostsForUser(userId, postId);

  const removeTaggedPostsForUser = async (userId: string, postId: string) =>
    await repository.removeTaggedPostsForUser(userId, postId);

  const likePostsForUser = async (userId: string, postId: string) =>
    await repository.likePostsForUser(userId, postId);

  const dislikePostsForUser = async (userId: string, postId: string) =>
    await repository.dislikePostsForUser(userId, postId);

  const getLikedPosts = async (userId: string) =>
    await repository.getLikedPosts(userId);

  const getDislikedPosts = async (userId: string) =>
    await repository.getDislikedPosts(userId);

  const getlikesdislikesInfo = async (postId: string) =>
    await repository.getlikesdislikesInfo(postId);

  const deltePostForUser = async (postId: string) =>
    await repository.deltePostForUser(postId);

  const blockPost = async (postId: string) =>
    await repository.blockPost(postId);

  const unblockPost = async (postId: string) =>
    await repository.unblockPost(postId);

  const approvePremium = async (userId: string) =>
    await repository.approvePremium(userId);

  const rejectPremium = async (userId: string) =>
    await repository.rejectPremium(userId);

  const addNewComment = async (commentData: CommentInterface) => {
    await repository.addNewComment(commentData);
  };
  const addNewReply = async (replyData: ReplyInterface) => {
    await repository.addNewReply(replyData);
  };

  const getAllComments = async (postId: string) =>
    await repository.getAllComments(postId);

  const deleteComment = async (commentId: string) =>
    await repository.deleteComment(commentId);

  const editComment = async (commentId: string, updatedText: string) =>
    await repository.editComment(commentId, updatedText);

  const getAllPublicPosts = async (id: string) =>
    await repository.getAllPublicPosts(id);

  const darkMode = async (userId: string) => await repository.darkMode(userId);

  const leftSidebar = async (userId: string) =>
    await repository.leftSidebar(userId);

  const rightSidebar = async (userId: string) =>
    await repository.rightSidebar(userId);

  const getAllStoriesForUser = async (id: string) =>
    await repository.getAllStoriesForUser(id);

  const createHighlights = async (payload: highlightsInterface) =>
    await repository.createHighlights(payload);

  const getAllStoriesForUserHighlights = async (id: string) =>
    await repository.getStoriesForHighlights(id);
  
 
  const getAllHighlightsForUserHighlights = async (id: string) =>
    await repository.getHighlightsData(id);
 
  const getAllStoriesForUserHighlightsUsername = async (username: string) =>
    await repository.getAllStoriesForUserHighlightsUsername(username);

  const getAllHighlightsForUserHighlightsUsingUsername = async (username: string) =>
    await repository.getAllHighlightsForUserHighlightsUsingUsername(username);
 
  const deleteHighlight = async (highlightId: string) =>
    await repository.deleteHighlight(  highlightId);

  return {
    addNewPost,
    addNewStory,
    taggedDataFromPosts,
    updatePost,
    getPostById,
    blockPost,
    unblockPost,
    getAllPostsForUser,
    getAllPostsForUserUsername,
    getAllTaggedPostsForUserUsername,
    lengthofPostsForUser,
    getAllPostsForCurrentUser,
    getAllSavedPostsForCurrentUser,
    getAllTaggedPostsForCurrentUser,
    getParticularPostsForCurrentUser,
    reportPostsForUser,
    savePostsForUser,
    removeSavePostsForUser,
    removeTaggedPostsForUser,
    likePostsForUser,
    dislikePostsForUser,
    getLikedPosts,
    getDislikedPosts,
    getlikesdislikesInfo,
    deltePostForUser,
    addNewComment,
    addNewReply,
    getAllComments,
    deleteComment,
    editComment,
    getAllPublicPosts,
    approvePremium,
    rejectPremium,
    darkMode,
    leftSidebar,
    rightSidebar,
    getAllStoriesForUser,
    createHighlights,
    getAllStoriesForUserHighlightsUsername,
    getAllStoriesForUserHighlights,
    getAllHighlightsForUserHighlights,
    getAllHighlightsForUserHighlightsUsingUsername,
    deleteHighlight,

  };
};

export type PostDBInterface = typeof postDBRepository;
