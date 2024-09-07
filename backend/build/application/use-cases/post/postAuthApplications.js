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
exports.handleGetFeeds = exports.handleDeleteHighlight = exports.handleGetHighlightsDataUsingUsername = exports.handleGetHighlightsData = exports.handleGetStoriesForHighlightsUsername = exports.handleGetStoriesForHighlights = exports.handleCreateHighlights = exports.handleGetStoriesForUser = exports.handleRightSidebar = exports.handleLeftSidebar = exports.handleDarkMode = exports.handleEditComments = exports.handleDelteComment = exports.handleGetAllComments = exports.handleReplyToComment = exports.handleCreateComment = exports.handleDeltePosts = exports.handleGetlikesdislikesinfo = exports.handleGetDislikedPosts = exports.handleGetLikedPosts = exports.handleGenerateCaption = exports.handleGetAllPublicPosts = exports.handleDislikePosts = exports.handleLikePosts = exports.handleRemoveTaggedPosts = exports.handleRemoveSavePosts = exports.handleSavePosts = exports.handleReportPosts = exports.handleGetParticularPost = exports.handleGetSavedPostsOfCurrentUser = exports.handleGetTaggedPostsOfCurrentUser = exports.handleGetPostsOfCurrentUser = exports.handleGetLengthForUser = exports.handleTaggedGetPostsForUserUsername = exports.handleGetPostsForUserUsername = exports.handleGetPostsForUser = exports.handleupdatepost = exports.handleCreateStory = exports.handleCreatePost = void 0;
const clarifai_1 = __importDefault(require("clarifai"));
const ErrorInApplication_1 = __importDefault(require("../../../utils/ErrorInApplication"));
const rssServices_1 = require("../../../frameworks/services/rssServices");
const handleCreatePost = (postData, dbPostRepository, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Post data in handleCreatePost :", postData);
        if (!postData.userId) {
            throw new ErrorInApplication_1.default("User ID is required to create a post", 400);
        }
        const userData = yield dbUserRepository.getUserById(postData.userId);
        if (!userData) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const newPostData = Object.assign(Object.assign({}, postData), { username: userData === null || userData === void 0 ? void 0 : userData.username, dp: userData === null || userData === void 0 ? void 0 : userData.dp });
        // // console.log("User exists....");
        const newPost = yield dbPostRepository.addNewPost(newPostData);
        // await dbPostRepository.taggedDataFromPosts(postData.mentions , newPost._id)
        return newPost;
    }
    catch (error) {
        console.error("Error in handleCreatePost:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to create post", 500);
    }
});
exports.handleCreatePost = handleCreatePost;
const handleCreateStory = (storyData, dbPostRepository, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Post data in handleCreateStory :", storyData);
        if (!storyData.userId) {
            throw new ErrorInApplication_1.default("User ID is required to create a story", 400);
        }
        const userData = yield dbUserRepository.getUserById(storyData.userId);
        if (!userData) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const newPost = yield dbPostRepository.addNewStory(storyData);
        return newPost;
    }
    catch (error) {
        console.error("Error in handleCreateStory:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to create story", 500);
    }
});
exports.handleCreateStory = handleCreateStory;
const handleupdatepost = (postData, dbPostRepository, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Post data in handleupdatepost:", postData);
        if (!postData.userId) {
            throw new ErrorInApplication_1.default("User ID is required to update a post", 400);
        }
        if (!postData.postId) {
            throw new ErrorInApplication_1.default("post ID is required to update a post", 400);
        }
        yield dbPostRepository.taggedDataFromPosts(postData.mentions, postData.postId);
        // console.log("User exists....");
        const newPost = yield dbPostRepository.updatePost(postData);
        // console.log("updated post data:", newPost);
        return newPost;
    }
    catch (error) {
        console.error("Error in updatePost:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to updatePost post", 500);
    }
});
exports.handleupdatepost = handleupdatepost;
const handleGetPostsForUser = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetPostsForUser reached");
        if (!id) {
            throw new ErrorInApplication_1.default("User ID is required to get all posts", 400);
        }
        const allPostsForUser = yield dbPostRepository.getAllPostsForUser(id);
        const filteredPosts = allPostsForUser.filter(post => !post.isBlocked);
        // console.log("Filtered posts from handleGetPostsForUser :", filteredPosts);
        return filteredPosts;
    }
    catch (error) {
        // console.log("Error in handleGetPostsForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all posts", 500);
    }
});
exports.handleGetPostsForUser = handleGetPostsForUser;
const handleGetPostsForUserUsername = (username, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetPostsForUserUsername reached");
        if (!username) {
            throw new ErrorInApplication_1.default("username is required to get all posts", 400);
        }
        const allPostsForUser = yield dbPostRepository.getAllPostsForUserUsername(username);
        const filteredPosts = allPostsForUser.filter(post => !post.isBlocked);
        // console.log("Filtered posts from handleGetPostsForUserUsername :", filteredPosts);
        return filteredPosts;
    }
    catch (error) {
        // console.log("Error in handleGetPostsForUserUsername");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all posts", 500);
    }
});
exports.handleGetPostsForUserUsername = handleGetPostsForUserUsername;
const handleTaggedGetPostsForUserUsername = (username, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleTaggedGetPostsForUserUsername reached");
        if (!username) {
            throw new ErrorInApplication_1.default("username is required to get all posts", 400);
        }
        const allPostsForUser = yield dbPostRepository.getAllTaggedPostsForUserUsername(username);
        const filteredPosts = allPostsForUser.filter(post => !post.isBlocked);
        // console.log("Filtered posts from handleTaggedGetPostsForUserUsername :", filteredPosts);
        return filteredPosts;
    }
    catch (error) {
        // console.log("Error in handleTaggedGetPostsForUserUsername");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all posts", 500);
    }
});
exports.handleTaggedGetPostsForUserUsername = handleTaggedGetPostsForUserUsername;
const handleGetLengthForUser = (username, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetLengthForUser reached");
        if (!username) {
            throw new ErrorInApplication_1.default("User ID is required to get all posts", 400);
        }
        const length = yield dbPostRepository.lengthofPostsForUser(username);
        // console.log("All posts from handleGetPostsForuser :", length);
        return length;
    }
    catch (error) {
        // console.log("Error in handleGetLengthForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all posts", 500);
    }
});
exports.handleGetLengthForUser = handleGetLengthForUser;
const handleGetPostsOfCurrentUser = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetPostsOfCurrentUser reached");
        if (!id) {
            throw new ErrorInApplication_1.default("ID is required to get all posts", 400);
        }
        const allPostsForUser = yield dbPostRepository.getAllPostsForCurrentUser(id);
        // console.log("All posts from handleGetPostsOfCurrentUser :", allPostsForUser);
        return allPostsForUser;
    }
    catch (error) {
        // console.log("Error in handleGetPostsOfCurrentUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all  posts of current user", 500);
    }
});
exports.handleGetPostsOfCurrentUser = handleGetPostsOfCurrentUser;
const handleGetTaggedPostsOfCurrentUser = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetSavedPostsOfCurrentUser reached");
        if (!id) {
            throw new ErrorInApplication_1.default("ID is required to get all posts", 400);
        }
        const allPostsForUser = yield dbPostRepository.getAllTaggedPostsForCurrentUser(id);
        // console.log("All posts from handleGetSavedPostsOfCurrentUser :", allPostsForUser);
        return allPostsForUser;
    }
    catch (error) {
        // console.log("Error in handleGetSavedPostsOfCurrentUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all  saved posts of current user", 500);
    }
});
exports.handleGetTaggedPostsOfCurrentUser = handleGetTaggedPostsOfCurrentUser;
const handleGetSavedPostsOfCurrentUser = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetSavedPostsOfCurrentUser reached");
        if (!id) {
            throw new ErrorInApplication_1.default("ID is required to get all posts", 400);
        }
        const allPostsForUser = yield dbPostRepository.getAllSavedPostsForCurrentUser(id);
        // console.log("All posts from handleGetSavedPostsOfCurrentUser :", allPostsForUser);
        return allPostsForUser;
    }
    catch (error) {
        // console.log("Error in handleGetSavedPostsOfCurrentUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all  saved posts of current user", 500);
    }
});
exports.handleGetSavedPostsOfCurrentUser = handleGetSavedPostsOfCurrentUser;
const handleGetParticularPost = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetParticularPost reached");
        if (!id) {
            throw new ErrorInApplication_1.default(" ID is required to get all posts", 400);
        }
        const allPostsForUser = yield dbPostRepository.getParticularPostsForCurrentUser(id);
        // console.log("All posts from handleGetParticularPost :", allPostsForUser);
        return allPostsForUser;
    }
    catch (error) {
        // console.log("Error in handleGetParticularPost");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all  posts of current user", 500);
    }
});
exports.handleGetParticularPost = handleGetParticularPost;
const handleReportPosts = (data, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleReportPosts reached");
        if (!data.postId) {
            throw new ErrorInApplication_1.default("Post ID is required to report post", 400);
        }
        // console.log("report post data: ", data)
        const reportPostsForUser = yield dbPostRepository.reportPostsForUser(data);
        // console.log("All posts from reportPostsForUser :", reportPostsForUser);
        return reportPostsForUser;
    }
    catch (error) {
        // console.log("Error in handleGetPostsForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to report post", 500);
    }
});
exports.handleReportPosts = handleReportPosts;
const handleSavePosts = (userId, postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleSavePosts reached");
        if (!postId) {
            throw new ErrorInApplication_1.default("Post ID and user id is required to save post", 400);
        }
        const savePostsForUser = yield dbPostRepository.savePostsForUser(userId, postId);
        // console.log("All posts from savePostsForUser :", savePostsForUser);
        return savePostsForUser;
    }
    catch (error) {
        // console.log("Error in savePostsForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to save posts", 500);
    }
});
exports.handleSavePosts = handleSavePosts;
const handleRemoveSavePosts = (userId, postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleRemoveSavePosts reached");
        if (!postId) {
            throw new ErrorInApplication_1.default("Post ID and user id is required to save post", 400);
        }
        const removeSavePostsForUser = yield dbPostRepository.removeSavePostsForUser(userId, postId);
        // console.log("All posts from removeSavePostsForUser :", removeSavePostsForUser);
        return removeSavePostsForUser;
    }
    catch (error) {
        // console.log("Error in removeSavePostsForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to remove saved post", 500);
    }
});
exports.handleRemoveSavePosts = handleRemoveSavePosts;
const handleRemoveTaggedPosts = (userId, postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleRemoveSavePosts reached");
        if (!postId) {
            throw new ErrorInApplication_1.default("Post ID and user id is required to save post", 400);
        }
        const removeTaggedPostsForUser = yield dbPostRepository.removeTaggedPostsForUser(userId, postId);
        return removeTaggedPostsForUser;
    }
    catch (error) {
        // console.log("Error in removeTaggedPostsForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to remove saved post", 500);
    }
});
exports.handleRemoveTaggedPosts = handleRemoveTaggedPosts;
const handleLikePosts = (userId, postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleSavePosts reached");
        if (!postId) {
            throw new ErrorInApplication_1.default("Post ID and user id is required to like post", 400);
        }
        const handleLikePostsForUser = yield dbPostRepository.likePostsForUser(userId, postId);
        // console.log("All posts from handleLikePostsForUser :", handleLikePostsForUser);
        return handleLikePostsForUser;
    }
    catch (error) {
        // console.log("Error in handleLikePosts");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to like posts", 500);
    }
});
exports.handleLikePosts = handleLikePosts;
const handleDislikePosts = (userId, postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleDislikePosts reached");
        if (!postId) {
            throw new ErrorInApplication_1.default("Post ID and user id is required to dislike post", 400);
        }
        const handleDislikePostsForUser = yield dbPostRepository.dislikePostsForUser(userId, postId);
        // console.log("All posts from handleDislikePostsForUser :", handleDislikePostsForUser);
        return handleDislikePostsForUser;
    }
    catch (error) {
        // console.log("Error in handleDislikePostsForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to dislike posts", 500);
    }
});
exports.handleDislikePosts = handleDislikePosts;
const handleGetAllPublicPosts = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetAllPublicPosts reached");
        const getAllPublicPosts = yield dbPostRepository.getAllPublicPosts(id);
        return getAllPublicPosts;
    }
    catch (error) {
        // console.log("Error in handleGetAllPublicPosts");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all public  posts for explore", 500);
    }
});
exports.handleGetAllPublicPosts = handleGetAllPublicPosts;
const clarifaiApp = new clarifai_1.default.App({
    // apiKey: 'x63of8rtn18z',
    apiKey: "a893b94727a54b0abb11b87b5cf35212",
    // apiKey: '09de53abfe904096935624c270d6b21b',
});
const handleGenerateCaption = (imageUrl, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("handleGenerateCaption reached: ", imageUrl, userId);
        const response = yield clarifaiApp.models.predict(clarifai_1.default.GENERAL_MODEL, imageUrl);
        console.log("response: ", response);
        if (response && response.outputs && response.outputs.length > 0) {
            const concepts = response.outputs[0].data.concepts;
            const descriptions = concepts.map((concept) => concept.name);
            console.log("captions:", descriptions.join(", "));
            return { caption: descriptions.join(", ") };
        }
        else {
            console.error("No outputs in response");
            throw new Error("No outputs in response");
        }
    }
    catch (error) {
        console.error("Error generating caption:", error);
        throw new Error("Failed to generate caption");
    }
});
exports.handleGenerateCaption = handleGenerateCaption;
const handleGetLikedPosts = (userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetLikedPosts reached");
        const handleGetLikedPosts = yield dbPostRepository.getLikedPosts(userId);
        // console.log("All posts from handleGetLikedPosts :", handleGetLikedPosts);
        return handleGetLikedPosts;
    }
    catch (error) {
        // console.log("Error in handleGetLikedPosts");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get liked posts", 500);
    }
});
exports.handleGetLikedPosts = handleGetLikedPosts;
const handleGetDislikedPosts = (userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetDislikedPosts reached");
        const handleGetDislikedPosts = yield dbPostRepository.getDislikedPosts(userId);
        // console.log("All posts from handleGetDislikedPosts :", handleGetDislikedPosts);
        return handleGetDislikedPosts;
    }
    catch (error) {
        // console.log("Error in handleGetDislikedPosts");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get liked posts", 500);
    }
});
exports.handleGetDislikedPosts = handleGetDislikedPosts;
const handleGetlikesdislikesinfo = (postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetlikesdislikesinfo reached");
        const handleGetlikesdislikesinfo = yield dbPostRepository.getlikesdislikesInfo(postId);
        // console.log("All posts from handleGetlikesdislikesinfo :", handleGetlikesdislikesinfo);
        return handleGetlikesdislikesinfo;
    }
    catch (error) {
        // console.log("Error in handleGetlikesdislikesinfo");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get liked posts", 500);
    }
});
exports.handleGetlikesdislikesinfo = handleGetlikesdislikesinfo;
const handleDeltePosts = (postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleDeltePosts reached");
        const handleDeltePostsForUser = yield dbPostRepository.deltePostForUser(postId);
        // console.log("All posts from handleDeltePostsForUser :", handleGetlikesdislikesinfo);
        return handleDeltePostsForUser;
    }
    catch (error) {
        // console.log("Error in handleDeltePostsForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get delete posts", 500);
    }
});
exports.handleDeltePosts = handleDeltePosts;
const handleCreateComment = (commentData, dbPostRepository, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Post data in handleCreateComment :", postData);
        if (!commentData.userId) {
            throw new ErrorInApplication_1.default("User ID is required to create a post", 400);
        }
        if (!commentData.postId) {
            throw new ErrorInApplication_1.default("Post ID is required to create a comment", 400);
        }
        const userData = yield dbUserRepository.getUserById(commentData.userId);
        if (!userData) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const newComment = yield dbPostRepository.addNewComment(commentData);
        return newComment;
    }
    catch (error) {
        console.error("Error in handleCreateComment:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to create comment", 500);
    }
});
exports.handleCreateComment = handleCreateComment;
const handleReplyToComment = (replyData, dbPostRepository, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Post data in handleReplyToComment:", replyData);
        // Validate required fields
        if (!replyData.userId) {
            throw new ErrorInApplication_1.default("User ID is required to create a reply", 400);
        }
        if (!replyData.postId) {
            throw new ErrorInApplication_1.default("Post ID is required to create a reply", 400);
        }
        if (!replyData.commentId) {
            throw new ErrorInApplication_1.default("Comment ID is required to create a reply", 400);
        }
        // Get user data from the repository
        const userData = yield dbUserRepository.getUserById(replyData.userId);
        if (!userData) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        console.log("Post data in handleReplyToComment:", replyData);
        // Add the new reply to the post
        const newReplyAdded = yield dbPostRepository.addNewReply(replyData);
        return newReplyAdded;
    }
    catch (error) {
        console.error("Error in handleReplyToComment:", error);
        // Re-throw custom application errors
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        // Throw a generic error for unexpected cases
        throw new ErrorInApplication_1.default("Failed to create reply", 500);
    }
});
exports.handleReplyToComment = handleReplyToComment;
const handleGetAllComments = (postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetAllComments reached");
        const handleGetAllComments = yield dbPostRepository.getAllComments(postId);
        // console.log("All posts from handleGetAllComments :", handleGetAllComments);
        return handleGetAllComments;
    }
    catch (error) {
        // console.log("Error in handleGetAllComments");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all comments", 500);
    }
});
exports.handleGetAllComments = handleGetAllComments;
const handleDelteComment = (commentId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleDelteComment reached");
        const handleDelteComment = yield dbPostRepository.deleteComment(commentId);
        return handleDelteComment;
    }
    catch (error) {
        // console.log("Error in handleDelteComment");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to delete posts", 500);
    }
});
exports.handleDelteComment = handleDelteComment;
const handleEditComments = (commentId, updatedText, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleEditComments reached");
        const handleEditComments = yield dbPostRepository.editComment(commentId, updatedText);
        return handleEditComments;
    }
    catch (error) {
        // console.log("Error in handleEditComments");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to delete posts", 500);
    }
});
exports.handleEditComments = handleEditComments;
const handleDarkMode = (userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleDarkModeResult reached");
        const handleDarkModeResult = yield dbPostRepository.darkMode(userId);
        return handleDarkModeResult;
    }
    catch (error) {
        // console.log("Error in handleDarkModeResult");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to set to darkMode", 500);
    }
});
exports.handleDarkMode = handleDarkMode;
const handleLeftSidebar = (userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleDarkModeResult reached");
        const handleDarkModeResult = yield dbPostRepository.leftSidebar(userId);
        return handleDarkModeResult;
    }
    catch (error) {
        // console.log("Error in handleDarkModeResult");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to set to darkMode", 500);
    }
});
exports.handleLeftSidebar = handleLeftSidebar;
const handleRightSidebar = (userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleDarkModeResult reached");
        const handleDarkModeResult = yield dbPostRepository.rightSidebar(userId);
        return handleDarkModeResult;
    }
    catch (error) {
        // console.log("Error in handleDarkModeResult");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to set to darkMode", 500);
    }
});
exports.handleRightSidebar = handleRightSidebar;
const handleGetStoriesForUser = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetStoriesForUser reached");
        if (!id) {
            throw new ErrorInApplication_1.default("User ID is required to get all stories", 400);
        }
        const allStoriesForUser = yield dbPostRepository.getAllStoriesForUser(id);
        return allStoriesForUser;
    }
    catch (error) {
        // console.log("Error in handleGetStoriesForUser");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all stories", 500);
    }
});
exports.handleGetStoriesForUser = handleGetStoriesForUser;
const handleCreateHighlights = (payload, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createHighlightsResult = yield dbPostRepository.createHighlights(payload);
        return createHighlightsResult;
    }
    catch (error) {
        // console.log("Error in handleCreateHighlights");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to create highlights", 500);
    }
});
exports.handleCreateHighlights = handleCreateHighlights;
const handleGetStoriesForHighlights = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetStoriesForHighlights reached");
        if (!id) {
            throw new ErrorInApplication_1.default("User ID is required to get all stories", 400);
        }
        const allStoriesForUser = yield dbPostRepository.getAllStoriesForUserHighlights(id);
        return allStoriesForUser;
    }
    catch (error) {
        // console.log("Error in handleGetStoriesForHighlights");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all stories for highlights", 500);
    }
});
exports.handleGetStoriesForHighlights = handleGetStoriesForHighlights;
const handleGetStoriesForHighlightsUsername = (username, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("handleGetStoriesForHighlightsUsername reached", username);
        if (!username) {
            throw new ErrorInApplication_1.default("Username is required to get all stories", 400);
        }
        const allStoriesForUser = yield dbPostRepository.getAllStoriesForUserHighlightsUsername(username);
        console.log("All stories : ", allStoriesForUser);
        return allStoriesForUser;
    }
    catch (error) {
        // console.log("Error in handleGetStoriesForHighlightsUsername");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all stories for highlights using username", 500);
    }
});
exports.handleGetStoriesForHighlightsUsername = handleGetStoriesForHighlightsUsername;
const handleGetHighlightsData = (id, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetHighlightsData reached");
        if (!id) {
            throw new ErrorInApplication_1.default("User ID is required to get all stories", 400);
        }
        const allStoriesForUser = yield dbPostRepository.getAllHighlightsForUserHighlights(id);
        return allStoriesForUser;
    }
    catch (error) {
        // console.log("Error in handleGetHighlightsData");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all highlights for user highlights", 500);
    }
});
exports.handleGetHighlightsData = handleGetHighlightsData;
const handleGetHighlightsDataUsingUsername = (username, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleGetHighlightsDataUsingUsername reached");
        if (!username) {
            throw new ErrorInApplication_1.default("Username is required to get all stories", 400);
        }
        const allStoriesForUser = yield dbPostRepository.getAllHighlightsForUserHighlightsUsingUsername(username);
        return allStoriesForUser;
    }
    catch (error) {
        // console.log("Error in handleGetHighlightsDataUsingUsername");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all highlights for user highlights", 500);
    }
});
exports.handleGetHighlightsDataUsingUsername = handleGetHighlightsDataUsingUsername;
const handleDeleteHighlight = (highlightId, userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleDeleteHighlight reached");
        if (!userId) {
            throw new ErrorInApplication_1.default("User ID is required to get all stories", 400);
        }
        if (!highlightId) {
            throw new ErrorInApplication_1.default("Highlight ID is required ", 400);
        }
        const deleteHighlight = yield dbPostRepository.deleteHighlight(highlightId);
        return deleteHighlight;
    }
    catch (error) {
        // console.log("Error in handleDeleteHighlight");
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get all stories for highlights", 500);
    }
});
exports.handleDeleteHighlight = handleDeleteHighlight;
const handleGetFeeds = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!userId) {
            throw new ErrorInApplication_1.default("User ID is required to get all feeds", 400);
        }
        const feeds = yield (0, rssServices_1.fetchRssFeeds)();
        // console.log("Fetched feeds: ", feeds);
        return feeds;
    }
    catch (error) {
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        console.error('Failed to get feeds', error);
        throw new ErrorInApplication_1.default("Failed to get feeds", 500);
    }
});
exports.handleGetFeeds = handleGetFeeds;
