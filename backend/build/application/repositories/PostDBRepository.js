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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDBRepository = void 0;
const postDBRepository = (repository) => {
    const addNewPost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
        yield repository.addNewPost(postData);
    });
    const addNewStory = (storyData) => __awaiter(void 0, void 0, void 0, function* () {
        yield repository.addNewStory(storyData);
    });
    const taggedDataFromPosts = (usernames, postId) => __awaiter(void 0, void 0, void 0, function* () {
        yield repository.taggedDataFromPosts(usernames, postId);
    });
    const getPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getPostById(postId);
    });
    const updatePost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
        yield repository.updatePost(postData);
    });
    const getAllPostsForUser = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllPostsForUser(id); });
    const getAllPostsForUserUsername = (username) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllPostsForUserUsername(username); });
    const getAllTaggedPostsForUserUsername = (username) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllTaggedPostsForUserUsername(username); });
    const lengthofPostsForUser = (username) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.lengthofPostsForUser(username); });
    const getAllPostsForCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllPostsForCurrentUser(id); });
    const getAllSavedPostsForCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllSavedPostsForCurrentUser(id); });
    const getAllTaggedPostsForCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllTaggedPostsForCurrentUser(id); });
    const getParticularPostsForCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getParticularPostsForCurrentUser(id); });
    const reportPostsForUser = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.reportPostsForUser(data); });
    const savePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.savePostsForUser(userId, postId); });
    const removeSavePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.removeSavePostsForUser(userId, postId); });
    const removeTaggedPostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.removeTaggedPostsForUser(userId, postId); });
    const likePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.likePostsForUser(userId, postId); });
    const dislikePostsForUser = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.dislikePostsForUser(userId, postId); });
    const getLikedPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getLikedPosts(userId); });
    const getDislikedPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getDislikedPosts(userId); });
    const getlikesdislikesInfo = (postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getlikesdislikesInfo(postId); });
    const deltePostForUser = (postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deltePostForUser(postId); });
    const blockPost = (postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.blockPost(postId); });
    const unblockPost = (postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.unblockPost(postId); });
    const approvePremium = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.approvePremium(userId); });
    const rejectPremium = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.rejectPremium(userId); });
    const addNewComment = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
        yield repository.addNewComment(commentData);
    });
    const addNewReply = (replyData) => __awaiter(void 0, void 0, void 0, function* () {
        yield repository.addNewReply(replyData);
    });
    const getAllComments = (postId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllComments(postId); });
    const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteComment(commentId); });
    const editComment = (commentId, updatedText) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.editComment(commentId, updatedText); });
    const getAllPublicPosts = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllPublicPosts(id); });
    const darkMode = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.darkMode(userId); });
    const leftSidebar = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.leftSidebar(userId); });
    const rightSidebar = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.rightSidebar(userId); });
    const getAllStoriesForUser = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllStoriesForUser(id); });
    const createHighlights = (payload) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.createHighlights(payload); });
    const getAllStoriesForUserHighlights = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getStoriesForHighlights(id); });
    const getAllHighlightsForUserHighlights = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHighlightsData(id); });
    const getAllStoriesForUserHighlightsUsername = (username) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllStoriesForUserHighlightsUsername(username); });
    const getAllHighlightsForUserHighlightsUsingUsername = (username) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllHighlightsForUserHighlightsUsingUsername(username); });
    const deleteHighlight = (highlightId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteHighlight(highlightId); });
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
exports.postDBRepository = postDBRepository;
