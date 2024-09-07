import {
  PostDataInterface,
  ReportPostInterface,
  StoryInterface,
  highlightsInterface,
} from "../../../../types/postsInterface";
const cron = require("node-cron");
import Post from "../models/postModel";
import ReportPost from "../models/reportPostModel";
import User from "../models/userModel";
import Like from "../models/likePostModel";
import Dislike from "../models/dislikePostModel";
import ErrorInApplication from "../../../../utils/ErrorInApplication";
import Comment from "../models/commentModel";
import {
  CommentInterface,
  ReplyInterface,
} from "../../../../types/commentInterface";
import PremiumAccount from "../models/premiumAccount";
import Story from "../models/storyModel";
import Highlights from "../models/highlightsModel";
import mongoose from "mongoose";

//////////////////////////////////////////////////////////

export const postRepositoryMongoDB = () => {
  //////////////////////////////////////////////////////////

  const addNewPost = async (postData: PostDataInterface) => {
    try {
      const newPost = new Post(postData);
      const newPostData = await newPost.save();
      // console.log("newPostData: ",newPostData)

      await taggedDataFromPosts(newPostData?.mentions, newPostData?._id);

      return newPostData;
    } catch (error) {
      // console.log(error);
      throw new Error("Error adding new post!");
    }
  };

  const updatePost = async (postData: PostDataInterface) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postData.postId,
        postData,
        { new: true }
      );
      return updatedPost;
    } catch (error) {
      // console.log(error);
      throw new Error("Error updating post!");
    }
  };

  const taggedDataFromPosts = async (usernames: string[], postId: string) => {
    try {
      console.log("Usrenamse : ", usernames);
      console.log("postId : ", postId);
      const updatePromises = usernames.map(username =>
        User.findOneAndUpdate(
          { username: username },
          { $push: { taggedPosts: { $each: [postId], $position: 0 } } },
          { new: true, upsert: true }
        )
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error(error);
      throw new Error("Error updating post - adding tags!");
    }
  };

  const getAllPostsForUser = async (id: string) => {
    try {
      const requesterUser = await User.findById(id);
      if (!requesterUser) {
        throw new Error("User not found");
      }

      const followingOfRequestedUser = await User.findById(id, {
        following: 1,
      }).exec();

      if (!followingOfRequestedUser || !followingOfRequestedUser.following) {
        throw new Error("User not following anyone");
      }

      let followingUsersId = followingOfRequestedUser.following.map(
        follow => follow.userId
      );

      if (followingUsersId.length === 0) {
        const publicUsers = await User.find({ isPrivate: false }, { _id: 1 }).exec();
        followingUsersId = publicUsers.map((user) => user._id);
      }

      const userIdsToFetch = [...followingUsersId, id];

      const currentUser = await User.findById(id);
      const blockedUsers = currentUser?.blockedUsers || [];

      const gettingPosts = await Post.find({
        userId: { $in: userIdsToFetch, $nin: blockedUsers },  
      }).sort({ createdAt: -1 })
      .populate("userId", "username dp");

      return gettingPosts;
    } catch (error) {
      console.error("Error getting all posts for user:", error);
      throw new Error("Error getting all posts for user!");
    }
  };

  const getAllPostsForUserUsername = async (username: string) => {
    try {
      // Find the user by username
      const requesterUser = await User.findOne({ username });
      if (!requesterUser) {
        throw new Error("User not found");
      }

      const currentUserId = requesterUser._id;

      // Fetch blocked users for the current user
      const currentUser = await User.findById(currentUserId);
      const blockedUsers = currentUser?.blockedUsers || [];

      // Fetch posts excluding users in blockedUsers list
      const gettingPosts = await Post.find({
        userId: { $in: [...blockedUsers, currentUserId] }, // Include currentUserId to fetch user's own posts
      }).sort({ createdAt: -1 })
      .populate("userId", "username dp");

      return gettingPosts;
    } catch (error) {
      console.error("Error getting all posts for user:", error);
      throw new Error("Error getting all posts for user!");
    }
  };

  const getAllTaggedPostsForUserUsername = async (username: string) => {
    try {
      if (!username) {
        throw new Error("User ID is required");
      }

      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const taggedPostIds = user.taggedPosts;

      if (!taggedPostIds || taggedPostIds.length === 0) {
        return [];
      }

      const taggedPosts = await Post.find({
        _id: { $in: taggedPostIds },
        isBlocked: false,
      }).sort({createdAt: -1,}).populate("userId", "username dp");
      console.log("tagged posts : ", taggedPosts);
      return taggedPosts;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Error getting tagged posts of current user!");
    }
  };

  const lengthofPostsForUser = async (username: string) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        throw new Error("User not found");
      }

      const postCount = await Post.countDocuments({ userId: user._id });
      return postCount;
    } catch (error) {
      // console.log(error);
      throw new Error("Error getting length of posts for user!");
    }
  };

  const getAllPostsForCurrentUser = async (id: string) => {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }

      const requesterUser = await User.findById(id);
      if (!requesterUser) {
        throw new Error("User not found");
      }

      const gettingPosts = await Post.find({ userId: id }).sort({
        createdAt: -1,
      }).populate("userId", "username dp");
      // console.log("Getting posts before returning:", gettingPosts);
      return gettingPosts;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Error getting all posts of current user!");
    }
  };

  const getAllSavedPostsForCurrentUser = async (userId: string) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const savedPostIds = user.savedPosts;

      if (!savedPostIds || savedPostIds.length === 0) {
        return [];
      }

      const savedPosts = await Post.find({
        _id: { $in: savedPostIds },
        isBlocked: false,
      }).sort({
        createdAt: -1,
      }).populate("userId", "username dp");

      return savedPosts;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Error getting saved posts of current user!");
    }
  };

  const getAllTaggedPostsForCurrentUser = async (userId: string) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const taggedPostIds = user.taggedPosts;

      if (!taggedPostIds || taggedPostIds.length === 0) {
        return [];
      }

      const taggedPosts = await Post.find({
        _id: { $in: taggedPostIds },
        isBlocked: false,
      }).sort({
        createdAt: -1,
      }).populate("userId", "username dp");

      return taggedPosts;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Error getting tagged posts of current user!");
    }
  };

  const getParticularPostsForCurrentUser = async (id: string) => {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }
      const gettingPosts = await Post.findById(id).populate("userId", "username dp");
      // console.log("Getting posts before returning:", gettingPosts);
      return gettingPosts;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Error getting all posts of current user!");
    }
  };

  const reportPostsForUser = async (data: ReportPostInterface) => {
    try {
      const newPeport = new ReportPost(data);
      return await newPeport.save();
    } catch (error) {
      // console.log(error);
      throw new Error("Error reporting new post!");
    }
  };

  const savePostsForUser = async (userId: string, postId: string) => {
    try {
      // console.log("Data in postRepository, userId, postId: ", userId, postId);

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      if (!user.savedPosts.includes(postId)) {
        user.savedPosts.push(postId);
        await user.save();
        // console.log("Post saved successfully");
      } else {
        // console.log("Post already saved");
      }
    } catch (error) {
      // console.log(error);
      throw new Error("Error saving post!");
    }
  };

  const removeSavePostsForUser = async (userId: string, postId: string) => {
    try {
      // console.log("Data in postRepository, userId, postId: ", userId, postId);

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      if (user.savedPosts.includes(postId)) {
        user.savedPosts.pull(postId);
        await user.save();
        // console.log("Post removed successfully from saved posts");
      } else {
        // console.log("Post not present in saved posts");
      }
    } catch (error) {
      // console.log(error);
      throw new Error("Error removing saved post!");
    }
  };

  const removeTaggedPostsForUser = async (userId: string, postId: string) => {
    try {
      // console.log("Data in postRepository, userId, postId: ", userId, postId);

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      if (user.taggedPosts.includes(postId)) {
        user.taggedPosts.pull(postId);
        await user.save();
        // console.log("Post removed successfully from saved posts");
      } else {
        // console.log("Post not present in saved posts");
      }
    } catch (error) {
      // console.log(error);
      throw new Error("Error removing tags from post!");
    }
  };

  const likePostsForUser = async (userId: string, postId: string) => {
    try {
      await Dislike.findOneAndDelete({ userId, postId });

      const like = new Like({ userId, postId });
      await like.save();

      // console.log("Post liked successfully!");
    } catch (error) {
      console.error(error);
      throw new Error("Error liking post!");
    }
  };

  const dislikePostsForUser = async (userId: string, postId: string) => {
    try {
      await Like.findOneAndDelete({ userId, postId });

      const dislike = new Dislike({ userId, postId });
      await dislike.save();

      // console.log("Post disliked successfully!");
    } catch (error) {
      console.error(error);
      throw new Error("Error disliking post!");
    }
  };

  const getLikedPosts = async (userId: string) => {
    try {
      const likedPosts = await Like.find({ userId });
      // console.log("Liked posts:", likedPosts);
      return likedPosts;
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      throw new Error("Error fetching liked posts!");
    }
  };

  const getDislikedPosts = async (userId: string) => {
    try {
      const dislikedPosts = await Dislike.find({ userId });
      // console.log("Disliked posts:", dislikedPosts);
      return dislikedPosts;
    } catch (error) {
      console.error("Error fetching disliked posts:", error);
      throw new Error("Error fetching disliked posts!");
    }
  };

  const getlikesdislikesInfo = async (postId: string) => {
    try {
      const likes = await Like.find({ postId }).populate("userId", "username");
      const dislikes = await Dislike.find({ postId }).populate(
        "userId",
        "username"
      );
      const data = {
        postId: postId,
        likesCount: likes.length,
        dislikesCount: dislikes.length,
        likedUsers: likes.map(like => like.userId.username),
        dislikedUsers: dislikes.map(dislike => dislike.userId.username),
      };
      // console.log("data on getlikesdislikesInfo : ", getlikesdislikesInfo);
      return data;
    } catch (error) {
      console.error("Error fetching disliked posts:", error);
      throw new Error("Error fetching disliked posts!");
    }
  };

  const deltePostForUser = async (postId: string) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
        throw new Error("Post not found");
      }
      // console.log("Post deleted successfully:", deletedPost);
      return { status: "success", message: "post deleted" };
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Error deleting post!");
    }
  };

  const getPostById = async (postId: string) => {
    return await Post.findById(postId);
  };

  const blockPost = async (postId: string) => {
    const post = await Post.findByIdAndUpdate(
      postId,
      { isBlocked: true },
      { new: true }
    );
    if (!post) {
      throw new ErrorInApplication("Post not found", 404);
    }
    return post;
  };

  const unblockPost = async (postId: string) => {
    const post = await Post.findByIdAndUpdate(
      postId,
      { isBlocked: false },
      { new: true }
    );
    if (!post) {
      throw new ErrorInApplication("Post not found", 404);
    }
    return post;
  };

  const approvePremium = async (userId: string) => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const premiumDetails = await PremiumAccount.findOneAndUpdate(
      { userId: userId },

      {
        "premiumRequest.isAdminApproved": true,
        premiumExpiresAt: oneMonthFromNow,
        isPremium: true,
        hasExpired: false,
      },
      { new: true }
    );
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
    });

    if (!premiumDetails) {
      throw new ErrorInApplication("premiumDetails not found", 404);
    }

    return premiumDetails;
  };

  const rejectPremium = async (userId: string) => {
    const premiumDetails = await PremiumAccount.findOneAndUpdate(
      { userId: userId },
      {
        "premiumRequest.isAdminApproved": false,
        premiumExpiresAt: null,
        isPremium: false,
      },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      isPremium: false,
    });

    if (!premiumDetails) {
      throw new ErrorInApplication("premiumDetails not found", 404);
    }
    return premiumDetails;
  };

  const checkAndExpirePremiumAccounts = async () => {
    try {
      const now = new Date();
      const expiredAccounts = await PremiumAccount.find({
        premiumExpiresAt: { $lte: now },
        hasExpired: false,
      });

      for (const account of expiredAccounts) {
        await PremiumAccount.findByIdAndUpdate(account._id, {
          premiumExpiresAt: null,
          isPremium: false,
          hasExpired: true,
          paymentDetails: null,
          "premiumRequest.isAdminApproved": false,
        });

        await User.findByIdAndUpdate(account.userId, {
          isPremium: false,
        });
      }

      // console.log(`${expiredAccounts.length} premium accounts have been updated as expired.`);
    } catch (error) {
      console.error("Error updating expired premium accounts:", error);
    }
  };

  const addNewComment = async (newCommentData: CommentInterface) => {
    try {
      const newComment = new Comment(newCommentData);
      const newCommentDataSaved = await newComment.save();
      console.log("newCommentDataSaved: ", newCommentDataSaved);
      return newCommentDataSaved;
    } catch (error) {
      console.log(error);
      throw new Error("Error adding new post!");
    }
  };

  const addNewReply = async (newReply: ReplyInterface) => {
    try {
      const comment = await Comment.findById(newReply.commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }

      const reply = {
        postId: newReply.postId,
        userId: newReply.userId,
        username: newReply.username,
        reply: newReply.reply,
        dp: newReply.dp,
      };

      comment.replies.push(reply);

      await comment.save();
      console.log("Comment reply : ", comment);
      return comment;
    } catch (error) {
      console.log(error);
      throw new Error("Error adding new reply!");
    }
  };

  const getAllComments = async (postId: string) => {
    try {
      const allComments = await Comment.find({ postId }).sort({
        createdAt: -1,
      });
      // console.log("Allcomments:", allComments)
      return allComments;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching comments!");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const deleteComment = await Comment.findByIdAndDelete(commentId);
      if (!deleteComment) {
        throw new Error("comment not found");
      }
      // console.log("comment deleted successfully:", deleteComment);
      return { status: "success", message: "Comment deleted" };
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error("Error deleting comment!");
    }
  };

  const editComment = async (commentId: string, updatedText: string) => {
    try {
      const editedComment = await Comment.findByIdAndUpdate(
        commentId,
        { comment: updatedText },
        { new: true }
      );
      if (!editedComment) {
        throw new ErrorInApplication("Comment not found", 404);
      }
      return editedComment;
    } catch (error) {
      throw new Error("Error updating comment");
    }
  };

  const darkMode = async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isDarkMode: !user.isDarkMode },
        { new: true }
      );
      return updatedUser;
    } catch (error: any) {
      throw new Error("Error updating dark mode: " + error.message);
    }
  };

  const leftSidebar = async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isLeftSidebarOpen: !user.isLeftSidebarOpen },
        { new: true }
      );
      return updatedUser;
    } catch (error: any) {
      throw new Error("Error updating isLeftSidebarOpen " + error.message);
    }
  };

  const rightSidebar = async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isRightSidebarOpen: !user.isRightSidebarOpen },
        { new: true }
      );
      return updatedUser;
    } catch (error: any) {
      throw new Error("Error updating isRightSidebarOpen " + error.message);
    }
  };

  const getAllPublicPosts = async (id: string) => {
    try {
      const currentUser = await User.findById(id);

      const followingUserIds = currentUser?.following.map(
        follow => follow.userId
      );
      const allPosts = await Post.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            $or: [
              { "user.isPrivate": false },
              { "user._id": { $in: followingUserIds } },
            ],
            isBlocked: false,
            isArchived: false,
          },
        },
        {
          $project: {
            images: 1,
            videos: 1,
            userId: 1,
            captions: 1,
            username: 1,
            dp: 1,
            location: 1,
            hashtags: 1,
            mentions: 1,
            likes: 1,
            shares: 1,
            comments: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $unwind: {
            path: "$images",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$videos",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // console.log("All posts : ", allPosts);

      return allPosts;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching public posts!");
    }
  };

  const addNewStory = async (storyData: StoryInterface) => {
    try {
      const newStory = new Story(storyData);
      const newStoryData = await newStory.save();

      return newStoryData;
    } catch (error) {
      // console.log(error);
      throw new Error("Error adding new story!");
    }
  };

  const getAllStoriesForUser = async (id: string) => {
    try {
      const requesterUser = await User.findById(id);
      if (!requesterUser) {
        throw new Error("User not found");
      }

      const followingOfRequestedUser = await User.findById(id, {
        following: 1,
      }).exec();

      if (!followingOfRequestedUser || !followingOfRequestedUser.following) {
        throw new Error("User not following anyone");
      }

      const followingUsersId = followingOfRequestedUser.following.map(
        follow => follow.userId
      );

      const userIdsToFetch = [...followingUsersId, id];

      const currentUser = await User.findById(id);
      const blockedUsers = currentUser?.blockedUsers || [];

      const gettingStories = await Story.find({
        userId: { $in: userIdsToFetch, $nin: blockedUsers },
        isExpired: false,
      })
        .sort({ createdAt: -1 })
        .populate("userId", "username dp");

      // console.log("Getting stories from repo: ", gettingStories);

      return gettingStories;
    } catch (error) {
      console.error("Error getting all stories for user:", error);
      throw new Error("Error getting all stories for user!");
    }
  };

  const deleteHighlight = async (highlightId: string) => {
    const highlightData = await Highlights.findById(highlightId);
    if (!highlightData) {
      throw new Error("Highlights not found");
    } else {
      await Highlights.findByIdAndDelete(highlightId);
    }
    return;
  };

  const createHighlights = async (payload: highlightsInterface) => {
    // console.log("create highlights opayload : ", payload)

    const newHighlight = new Highlights(payload);
    const newHighlightData = await newHighlight.save();
    // console.log("create highlights newHighlightData : ", newHighlightData);
    return newHighlightData;
  };

  const getStoriesForHighlights = async (id: string) => {
    const requesterUser = await User.findById(id);
    if (!requesterUser) {
      throw new Error("User not found");
    }

    const stories = await Story.find({ userId: id })
      .sort({ createdAt: -1 })
      .populate("userId", "username dp");

    // console.log("Getting stories:", stories);

    return stories;
  };

  const getAllStoriesForUserHighlightsUsername = async (username: string) => {
    try {
      const currentUser = await User.findOne({ username });
      if (!currentUser) {
        throw new Error(`User with username ${username} not found`);
      }

      const currentUserid = currentUser._id;
      console.log("Requested user ID: ", currentUserid);

      const stories = await Story.find({ userId: currentUserid })
        .sort({ createdAt: -1 })
        .populate("userId", "username dp");

      // console.log("Getting stories: getAllStoriesForUserHighlightsUsername", stories);

      return stories;
    } catch (error) {
      console.error(
        "Error getting stories for user highlights username:",
        error
      );
      throw error;
    }
  };

  // getAllStoriesForUserHighlightsUsername('abilashn13')

  const getHighlightsData = async (id: string) => {
    const requesterUser = await User.findById(id);
    if (!requesterUser) {
      throw new Error("User not found");
    }

    const highlights = await Highlights.find({ userId: id });

    // console.log("Getting highlights data:", highlights);

    return highlights;
  };

  const getAllHighlightsForUserHighlightsUsingUsername = async (
    username: string
  ) => {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User not found");
    }

    const highlights = await Highlights.find({ userId: user._id });

    // console.log("Getting highlights data:", highlights);

    return highlights;
  };

  const updateStoryExpiry = async () => {
    const currentDate = new Date();

    const stories = await Story.find({});

    for (const story of stories) {
      const timeDifference =
        currentDate.getTime() - new Date(story.createdAt).getTime();
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference >= 24) {
        if (!story.isExpired) {
          story.isExpired = true;
          await story.save();
        }
      }
    }
  };

  cron.schedule("* * * * *", () => {
    checkAndExpirePremiumAccounts();
    updateStoryExpiry();
  });

  ////////////////////////////////////////////////

  const removeAllTaggedPostsForAllUsers = async () => {
    try {
      // Update all users and set their taggedPosts array to an empty array
      await User.updateMany({}, { $set: { taggedPosts: [] } });

      console.log("All tagged posts removed for all users.");
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Error removing tagged posts for all users!");
    }
  };

  // removeAllTaggedPostsForAllUsers()

  return {
    addNewPost,
    taggedDataFromPosts,
    getPostById,
    updatePost,
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
    blockPost,
    unblockPost,
    approvePremium,
    rejectPremium,
    addNewComment,
    addNewReply,
    getAllComments,
    deleteComment,
    editComment,
    getAllPublicPosts,
    rightSidebar,
    leftSidebar,
    darkMode,
    addNewStory,
    getAllStoriesForUser,
    getHighlightsData,
    getAllHighlightsForUserHighlightsUsingUsername,
    createHighlights,
    getStoriesForHighlights,
    getAllStoriesForUserHighlightsUsername,
    deleteHighlight,
  };
};
//////////////////////////////////////////////////////////

export type PostRepositoryMongoDB = typeof postRepositoryMongoDB;
