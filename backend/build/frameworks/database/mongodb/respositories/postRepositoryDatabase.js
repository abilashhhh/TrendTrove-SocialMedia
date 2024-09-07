"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepositoryMongoDB = void 0;
const cron = require("node-cron");
const postModel_1 = __importDefault(require("../models/postModel"));
const reportPostModel_1 = __importDefault(require("../models/reportPostModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const likePostModel_1 = __importDefault(require("../models/likePostModel"));
const dislikePostModel_1 = __importDefault(require("../models/dislikePostModel"));
const ErrorInApplication_1 = __importDefault(require("../../../../utils/ErrorInApplication"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const premiumAccount_1 = __importDefault(require("../models/premiumAccount"));
const storyModel_1 = __importDefault(require("../models/storyModel"));
const highlightsModel_1 = __importDefault(require("../models/highlightsModel"));
//////////////////////////////////////////////////////////
const postRepositoryMongoDB = () => {
    //////////////////////////////////////////////////////////
    const addNewPost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newPost = new postModel_1.default(postData);
            const newPostData = yield newPost.save();
            // console.log("newPostData: ",newPostData)
            yield taggedDataFromPosts(newPostData === null || newPostData === void 0 ? void 0 : newPostData.mentions, newPostData === null || newPostData === void 0 ? void 0 : newPostData._id);
            return newPostData;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error adding new post!");
        }
    });
    const updatePost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedPost = yield postModel_1.default.findByIdAndUpdate(postData.postId, postData, { new: true });
            return updatedPost;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error updating post!");
        }
    });
    const taggedDataFromPosts = (usernames, postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Usrenamse : ", usernames);
            console.log("postId : ", postId);
            const updatePromises = usernames.map(username => userModel_1.default.findOneAndUpdate({ username: username }, { $push: { taggedPosts: { $each: [postId], $position: 0 } } }, { new: true, upsert: true }));
            yield Promise.all(updatePromises);
        }
        catch (error) {
            console.error(error);
            throw new Error("Error updating post - adding tags!");
        }
    });
    const getAllPostsForUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const requesterUser = yield userModel_1.default.findById(id);
            if (!requesterUser) {
                throw new Error("User not found");
            }
            const followingOfRequestedUser = yield userModel_1.default.findById(id, {
                following: 1,
            }).exec();
            if (!followingOfRequestedUser || !followingOfRequestedUser.following) {
                throw new Error("User not following anyone");
            }
            let followingUsersId = followingOfRequestedUser.following.map(follow => follow.userId);
            if (followingUsersId.length === 0) {
                const publicUsers = yield userModel_1.default.find({ isPrivate: false }, { _id: 1 }).exec();
                followingUsersId = publicUsers.map((user) => user._id);
            }
            const userIdsToFetch = [...followingUsersId, id];
            const currentUser = yield userModel_1.default.findById(id);
            const blockedUsers = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.blockedUsers) || [];
            const gettingPosts = yield postModel_1.default.find({
                userId: { $in: userIdsToFetch, $nin: blockedUsers },
            }).sort({ createdAt: -1 })
                .populate("userId", "username dp");
            return gettingPosts;
        }
        catch (error) {
            console.error("Error getting all posts for user:", error);
            throw new Error("Error getting all posts for user!");
        }
    });
    const getAllPostsForUserUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find the user by username
            const requesterUser = yield userModel_1.default.findOne({ username });
            if (!requesterUser) {
                throw new Error("User not found");
            }
            const currentUserId = requesterUser._id;
            // Fetch blocked users for the current user
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const blockedUsers = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.blockedUsers) || [];
            // Fetch posts excluding users in blockedUsers list
            const gettingPosts = yield postModel_1.default.find({
                userId: { $in: [...blockedUsers, currentUserId] }, // Include currentUserId to fetch user's own posts
            }).sort({ createdAt: -1 })
                .populate("userId", "username dp");
            return gettingPosts;
        }
        catch (error) {
            console.error("Error getting all posts for user:", error);
            throw new Error("Error getting all posts for user!");
        }
    });
    const getAllTaggedPostsForUserUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!username) {
                throw new Error("User ID is required");
            }
            const user = yield userModel_1.default.findOne({ username });
            if (!user) {
                throw new Error("User not found");
            }
            const taggedPostIds = user.taggedPosts;
            if (!taggedPostIds || taggedPostIds.length === 0) {
                return [];
            }
            const taggedPosts = yield postModel_1.default.find({
                _id: { $in: taggedPostIds },
                isBlocked: false,
            }).sort({ createdAt: -1, }).populate("userId", "username dp");
            console.log("tagged posts : ", taggedPosts);
            return taggedPosts;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Error getting tagged posts of current user!");
        }
    });
    const lengthofPostsForUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("User not found");
            }
            const postCount = yield postModel_1.default.countDocuments({ userId: user._id });
            return postCount;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error getting length of posts for user!");
        }
    });
    const getAllPostsForCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!id) {
                throw new Error("User ID is required");
            }
            const requesterUser = yield userModel_1.default.findById(id);
            if (!requesterUser) {
                throw new Error("User not found");
            }
            const gettingPosts = yield postModel_1.default.find({ userId: id }).sort({
                createdAt: -1,
            }).populate("userId", "username dp");
            // console.log("Getting posts before returning:", gettingPosts);
            return gettingPosts;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Error getting all posts of current user!");
        }
    });
    const getAllSavedPostsForCurrentUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!userId) {
                throw new Error("User ID is required");
            }
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const savedPostIds = user.savedPosts;
            if (!savedPostIds || savedPostIds.length === 0) {
                return [];
            }
            const savedPosts = yield postModel_1.default.find({
                _id: { $in: savedPostIds },
                isBlocked: false,
            }).sort({
                createdAt: -1,
            }).populate("userId", "username dp");
            return savedPosts;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Error getting saved posts of current user!");
        }
    });
    const getAllTaggedPostsForCurrentUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!userId) {
                throw new Error("User ID is required");
            }
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const taggedPostIds = user.taggedPosts;
            if (!taggedPostIds || taggedPostIds.length === 0) {
                return [];
            }
            const taggedPosts = yield postModel_1.default.find({
                _id: { $in: taggedPostIds },
                isBlocked: false,
            }).sort({
                createdAt: -1,
            }).populate("userId", "username dp");
            return taggedPosts;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Error getting tagged posts of current user!");
        }
    });
    const getParticularPostsForCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!id) {
                throw new Error("User ID is required");
            }
            const gettingPosts = yield postModel_1.default.findById(id).populate("userId", "username dp");
            // console.log("Getting posts before returning:", gettingPosts);
            return gettingPosts;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Error getting all posts of current user!");
        }
    });
    const reportPostsForUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newPeport = new reportPostModel_1.default(data);
            return yield newPeport.save();
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error reporting new post!");
        }
    });
    const savePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log("Data in postRepository, userId, postId: ", userId, postId);
            const user = yield userModel_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            if (!user.savedPosts.includes(postId)) {
                user.savedPosts.push(postId);
                yield user.save();
                // console.log("Post saved successfully");
            }
            else {
                // console.log("Post already saved");
            }
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error saving post!");
        }
    });
    const removeSavePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log("Data in postRepository, userId, postId: ", userId, postId);
            const user = yield userModel_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            if (user.savedPosts.includes(postId)) {
                user.savedPosts.pull(postId);
                yield user.save();
                // console.log("Post removed successfully from saved posts");
            }
            else {
                // console.log("Post not present in saved posts");
            }
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error removing saved post!");
        }
    });
    const removeTaggedPostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log("Data in postRepository, userId, postId: ", userId, postId);
            const user = yield userModel_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            if (user.taggedPosts.includes(postId)) {
                user.taggedPosts.pull(postId);
                yield user.save();
                // console.log("Post removed successfully from saved posts");
            }
            else {
                // console.log("Post not present in saved posts");
            }
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error removing tags from post!");
        }
    });
    const likePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield dislikePostModel_1.default.findOneAndDelete({ userId, postId });
            const like = new likePostModel_1.default({ userId, postId });
            yield like.save();
            // console.log("Post liked successfully!");
        }
        catch (error) {
            console.error(error);
            throw new Error("Error liking post!");
        }
    });
    const dislikePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield likePostModel_1.default.findOneAndDelete({ userId, postId });
            const dislike = new dislikePostModel_1.default({ userId, postId });
            yield dislike.save();
            // console.log("Post disliked successfully!");
        }
        catch (error) {
            console.error(error);
            throw new Error("Error disliking post!");
        }
    });
    const getLikedPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const likedPosts = yield likePostModel_1.default.find({ userId });
            // console.log("Liked posts:", likedPosts);
            return likedPosts;
        }
        catch (error) {
            console.error("Error fetching liked posts:", error);
            throw new Error("Error fetching liked posts!");
        }
    });
    const getDislikedPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dislikedPosts = yield dislikePostModel_1.default.find({ userId });
            // console.log("Disliked posts:", dislikedPosts);
            return dislikedPosts;
        }
        catch (error) {
            console.error("Error fetching disliked posts:", error);
            throw new Error("Error fetching disliked posts!");
        }
    });
    const getlikesdislikesInfo = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const likes = yield likePostModel_1.default.find({ postId }).populate("userId", "username");
            const dislikes = yield dislikePostModel_1.default.find({ postId }).populate("userId", "username");
            const data = {
                postId: postId,
                likesCount: likes.length,
                dislikesCount: dislikes.length,
                likedUsers: likes.map(like => like.userId.username),
                dislikedUsers: dislikes.map(dislike => dislike.userId.username),
            };
            // console.log("data on getlikesdislikesInfo : ", getlikesdislikesInfo);
            return data;
        }
        catch (error) {
            console.error("Error fetching disliked posts:", error);
            throw new Error("Error fetching disliked posts!");
        }
    });
    const deltePostForUser = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedPost = yield postModel_1.default.findByIdAndDelete(postId);
            if (!deletedPost) {
                throw new Error("Post not found");
            }
            // console.log("Post deleted successfully:", deletedPost);
            return { status: "success", message: "post deleted" };
        }
        catch (error) {
            console.error("Error deleting post:", error);
            throw new Error("Error deleting post!");
        }
    });
    const getPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield postModel_1.default.findById(postId);
    });
    const blockPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield postModel_1.default.findByIdAndUpdate(postId, { isBlocked: true }, { new: true });
        if (!post) {
            throw new ErrorInApplication_1.default("Post not found", 404);
        }
        return post;
    });
    const unblockPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield postModel_1.default.findByIdAndUpdate(postId, { isBlocked: false }, { new: true });
        if (!post) {
            throw new ErrorInApplication_1.default("Post not found", 404);
        }
        return post;
    });
    const approvePremium = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        const premiumDetails = yield premiumAccount_1.default.findOneAndUpdate({ userId: userId }, {
            "premiumRequest.isAdminApproved": true,
            premiumExpiresAt: oneMonthFromNow,
            isPremium: true,
            hasExpired: false,
        }, { new: true });
        yield userModel_1.default.findByIdAndUpdate(userId, {
            isPremium: true,
        });
        if (!premiumDetails) {
            throw new ErrorInApplication_1.default("premiumDetails not found", 404);
        }
        return premiumDetails;
    });
    const rejectPremium = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const premiumDetails = yield premiumAccount_1.default.findOneAndUpdate({ userId: userId }, {
            "premiumRequest.isAdminApproved": false,
            premiumExpiresAt: null,
            isPremium: false,
        }, { new: true });
        yield userModel_1.default.findByIdAndUpdate(userId, {
            isPremium: false,
        });
        if (!premiumDetails) {
            throw new ErrorInApplication_1.default("premiumDetails not found", 404);
        }
        return premiumDetails;
    });
    const checkAndExpirePremiumAccounts = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            const expiredAccounts = yield premiumAccount_1.default.find({
                premiumExpiresAt: { $lte: now },
                hasExpired: false,
            });
            for (const account of expiredAccounts) {
                yield premiumAccount_1.default.findByIdAndUpdate(account._id, {
                    premiumExpiresAt: null,
                    isPremium: false,
                    hasExpired: true,
                    paymentDetails: null,
                    "premiumRequest.isAdminApproved": false,
                });
                yield userModel_1.default.findByIdAndUpdate(account.userId, {
                    isPremium: false,
                });
            }
            // console.log(`${expiredAccounts.length} premium accounts have been updated as expired.`);
        }
        catch (error) {
            console.error("Error updating expired premium accounts:", error);
        }
    });
    const addNewComment = (newCommentData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newComment = new commentModel_1.default(newCommentData);
            const newCommentDataSaved = yield newComment.save();
            console.log("newCommentDataSaved: ", newCommentDataSaved);
            return newCommentDataSaved;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error adding new post!");
        }
    });
    const addNewReply = (newReply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const comment = yield commentModel_1.default.findById(newReply.commentId);
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
            yield comment.save();
            console.log("Comment reply : ", comment);
            return comment;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error adding new reply!");
        }
    });
    const getAllComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allComments = yield commentModel_1.default.find({ postId }).sort({
                createdAt: -1,
            });
            // console.log("Allcomments:", allComments)
            return allComments;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching comments!");
        }
    });
    const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deleteComment = yield commentModel_1.default.findByIdAndDelete(commentId);
            if (!deleteComment) {
                throw new Error("comment not found");
            }
            // console.log("comment deleted successfully:", deleteComment);
            return { status: "success", message: "Comment deleted" };
        }
        catch (error) {
            console.error("Error deleting comment:", error);
            throw new Error("Error deleting comment!");
        }
    });
    const editComment = (commentId, updatedText) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const editedComment = yield commentModel_1.default.findByIdAndUpdate(commentId, { comment: updatedText }, { new: true });
            if (!editedComment) {
                throw new ErrorInApplication_1.default("Comment not found", 404);
            }
            return editedComment;
        }
        catch (error) {
            throw new Error("Error updating comment");
        }
    });
    const darkMode = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, { isDarkMode: !user.isDarkMode }, { new: true });
            return updatedUser;
        }
        catch (error) {
            throw new Error("Error updating dark mode: " + error.message);
        }
    });
    const leftSidebar = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, { isLeftSidebarOpen: !user.isLeftSidebarOpen }, { new: true });
            return updatedUser;
        }
        catch (error) {
            throw new Error("Error updating isLeftSidebarOpen " + error.message);
        }
    });
    const rightSidebar = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, { isRightSidebarOpen: !user.isRightSidebarOpen }, { new: true });
            return updatedUser;
        }
        catch (error) {
            throw new Error("Error updating isRightSidebarOpen " + error.message);
        }
    });
    const getAllPublicPosts = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(id);
            const followingUserIds = currentUser === null || currentUser === void 0 ? void 0 : currentUser.following.map(follow => follow.userId);
            const allPosts = yield postModel_1.default.aggregate([
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
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching public posts!");
        }
    });
    const addNewStory = (storyData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newStory = new storyModel_1.default(storyData);
            const newStoryData = yield newStory.save();
            return newStoryData;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error adding new story!");
        }
    });
    const getAllStoriesForUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const requesterUser = yield userModel_1.default.findById(id);
            if (!requesterUser) {
                throw new Error("User not found");
            }
            const followingOfRequestedUser = yield userModel_1.default.findById(id, {
                following: 1,
            }).exec();
            if (!followingOfRequestedUser || !followingOfRequestedUser.following) {
                throw new Error("User not following anyone");
            }
            const followingUsersId = followingOfRequestedUser.following.map(follow => follow.userId);
            const userIdsToFetch = [...followingUsersId, id];
            const currentUser = yield userModel_1.default.findById(id);
            const blockedUsers = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.blockedUsers) || [];
            const gettingStories = yield storyModel_1.default.find({
                userId: { $in: userIdsToFetch, $nin: blockedUsers },
                isExpired: false,
            })
                .sort({ createdAt: -1 })
                .populate("userId", "username dp");
            // console.log("Getting stories from repo: ", gettingStories);
            return gettingStories;
        }
        catch (error) {
            console.error("Error getting all stories for user:", error);
            throw new Error("Error getting all stories for user!");
        }
    });
    const deleteHighlight = (highlightId) => __awaiter(void 0, void 0, void 0, function* () {
        const highlightData = yield highlightsModel_1.default.findById(highlightId);
        if (!highlightData) {
            throw new Error("Highlights not found");
        }
        else {
            yield highlightsModel_1.default.findByIdAndDelete(highlightId);
        }
        return;
    });
    const createHighlights = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("create highlights opayload : ", payload)
        const newHighlight = new highlightsModel_1.default(payload);
        const newHighlightData = yield newHighlight.save();
        // console.log("create highlights newHighlightData : ", newHighlightData);
        return newHighlightData;
    });
    const getStoriesForHighlights = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const requesterUser = yield userModel_1.default.findById(id);
        if (!requesterUser) {
            throw new Error("User not found");
        }
        const stories = yield storyModel_1.default.find({ userId: id })
            .sort({ createdAt: -1 })
            .populate("userId", "username dp");
        // console.log("Getting stories:", stories);
        return stories;
    });
    const getAllStoriesForUserHighlightsUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findOne({ username });
            if (!currentUser) {
                throw new Error(`User with username ${username} not found`);
            }
            const currentUserid = currentUser._id;
            console.log("Requested user ID: ", currentUserid);
            const stories = yield storyModel_1.default.find({ userId: currentUserid })
                .sort({ createdAt: -1 })
                .populate("userId", "username dp");
            // console.log("Getting stories: getAllStoriesForUserHighlightsUsername", stories);
            return stories;
        }
        catch (error) {
            console.error("Error getting stories for user highlights username:", error);
            throw error;
        }
    });
    // getAllStoriesForUserHighlightsUsername('abilashn13')
    const getHighlightsData = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const requesterUser = yield userModel_1.default.findById(id);
        if (!requesterUser) {
            throw new Error("User not found");
        }
        const highlights = yield highlightsModel_1.default.find({ userId: id });
        // console.log("Getting highlights data:", highlights);
        return highlights;
    });
    const getAllHighlightsForUserHighlightsUsingUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ username: username });
        if (!user) {
            throw new Error("User not found");
        }
        const highlights = yield highlightsModel_1.default.find({ userId: user._id });
        // console.log("Getting highlights data:", highlights);
        return highlights;
    });
    const updateStoryExpiry = () => __awaiter(void 0, void 0, void 0, function* () {
        const currentDate = new Date();
        const stories = yield storyModel_1.default.find({});
        for (const story of stories) {
            const timeDifference = currentDate.getTime() - new Date(story.createdAt).getTime();
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            if (hoursDifference >= 24) {
                if (!story.isExpired) {
                    story.isExpired = true;
                    yield story.save();
                }
            }
        }
    });
    cron.schedule("* * * * *", () => {
        checkAndExpirePremiumAccounts();
        updateStoryExpiry();
    });
    ////////////////////////////////////////////////
    const removeAllTaggedPostsForAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Update all users and set their taggedPosts array to an empty array
            yield userModel_1.default.updateMany({}, { $set: { taggedPosts: [] } });
            console.log("All tagged posts removed for all users.");
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Error removing tagged posts for all users!");
        }
    });
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
exports.postRepositoryMongoDB = postRepositoryMongoDB;
