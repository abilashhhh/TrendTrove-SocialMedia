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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const postAuthApplications_1 = require("../../application/use-cases/post/postAuthApplications");
const postController = (userDBRepositoryImplementation, userDBRepositoryInterface, postDBRepositoryImplementation, postDBRepositoryInterface, authServiceImplementation, authenticationServiceInterface) => {
    const dbUserRepository = userDBRepositoryInterface(userDBRepositoryImplementation());
    const dbPostRepository = postDBRepositoryInterface(postDBRepositoryImplementation());
    const authService = authenticationServiceInterface(authServiceImplementation());
    const addPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postData = req.body;
        const createPost = yield (0, postAuthApplications_1.handleCreatePost)(postData, dbPostRepository, dbUserRepository);
        res.status(201).json({
            status: "success",
            message: "Post created successfully",
            data: createPost,
        });
    }));
    const addStory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const storyData = req.body;
        console.log("story data: ", storyData);
        const createStory = yield (0, postAuthApplications_1.handleCreateStory)(storyData, dbPostRepository, dbUserRepository);
        console.log("createStory: ", createStory);
        res.status(201).json({
            status: "success",
            message: "Story created successfully",
            data: createStory,
        });
    }));
    const updatepost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postData = req.body;
        const createPost = yield (0, postAuthApplications_1.handleupdatepost)(postData, dbPostRepository, dbUserRepository);
        res.status(201).json({
            status: "success",
            message: "Post updated successfully",
            data: createPost,
        });
    }));
    const getpostforuser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const getPosts = yield (0, postAuthApplications_1.handleGetPostsForUser)(userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Posts fetched for user",
            data: getPosts,
        });
    }));
    const getpostforuserusername = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        const getPosts = yield (0, postAuthApplications_1.handleGetPostsForUserUsername)(username, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Posts fetched for user",
            data: getPosts,
        });
    }));
    const gettaggedpostforuserusername = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        const getPosts = yield (0, postAuthApplications_1.handleTaggedGetPostsForUserUsername)(username, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "tagged posts fetched for user",
            data: getPosts,
        });
    }));
    const getpostlengthofuser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        const getPostsLength = yield (0, postAuthApplications_1.handleGetLengthForUser)(username, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Posts fetched for user",
            data: getPostsLength,
        });
    }));
    const getpostofcurrentuser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const getPosts = yield (0, postAuthApplications_1.handleGetPostsOfCurrentUser)(userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Posts fetched for current user",
            data: getPosts,
        });
    }));
    const getsavedpostofcurrentuser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const getPosts = yield (0, postAuthApplications_1.handleGetSavedPostsOfCurrentUser)(userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Posts fetched for current user",
            data: getPosts,
        });
    }));
    const gettaggedpostofcurrentuser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const getPosts = yield (0, postAuthApplications_1.handleGetTaggedPostsOfCurrentUser)(userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Posts fetched for current user",
            data: getPosts,
        });
    }));
    const getparticularpostofcurrentuser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const getPosts = yield (0, postAuthApplications_1.handleGetParticularPost)(id, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post fetched for current user",
            data: getPosts,
        });
    }));
    const getPostUsingPostId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = req.params;
        const getPosts = yield (0, postAuthApplications_1.handleGetParticularPost)(postId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post fetched for current user",
            postData: getPosts,
        });
    }));
    const reportPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        const reportPost = yield (0, postAuthApplications_1.handleReportPosts)(data, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post reported successfully",
            data: reportPost,
        });
    }));
    const savePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, postId } = req.body;
        const savePost = yield (0, postAuthApplications_1.handleSavePosts)(userId, postId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post saved successfully",
            data: savePost,
        });
    }));
    const removesavePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, postId } = req.body;
        const removesavePost = yield (0, postAuthApplications_1.handleRemoveSavePosts)(userId, postId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post removed from saved successfully",
            data: removesavePost,
        });
    }));
    const removetaggedpost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, postId } = req.body;
        const removeTaggedPost = yield (0, postAuthApplications_1.handleRemoveTaggedPosts)(userId, postId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post removed from tags successfully",
            data: removeTaggedPost,
        });
    }));
    const likePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, postId } = req.body;
        const likePost = yield (0, postAuthApplications_1.handleLikePosts)(userId, postId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post liked successfully",
            data: likePost,
        });
    }));
    const dislikePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, postId } = req.body;
        const dislikePost = yield (0, postAuthApplications_1.handleDislikePosts)(userId, postId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Post disliked successfully",
            data: dislikePost,
        });
    }));
    const getallpublicpostsforexplore = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            const allPosts = yield (0, postAuthApplications_1.handleGetAllPublicPosts)(userId, dbPostRepository);
            res.status(200).json({ allPosts });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch public posts", error });
        }
    }));
    const generatecaption = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("reached generate caption");
            const { imageurl } = req.body;
            const { userId } = req.body;
            console.log("Image URL in backend:", imageurl);
            console.log("User ID:", userId);
            const caption = yield (0, postAuthApplications_1.handleGenerateCaption)(imageurl, userId);
            console.log("Caption:", caption);
            res.status(200).json({ caption });
        }
        catch (error) {
            console.error("Error generating caption:", error);
            res.status(500).json({ message: "Failed to generate caption for post", error });
        }
    }));
    const getlikedposts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const likedPosts = yield (0, postAuthApplications_1.handleGetLikedPosts)(userId, dbPostRepository);
        res.status(200).json({ likedPosts });
    }));
    const getdislikedposts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const dislikedPosts = yield (0, postAuthApplications_1.handleGetDislikedPosts)(userId, dbPostRepository);
        res.status(200).json({ dislikedPosts });
    }));
    const getlikesdislikesinfo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = req.params;
        const likesdislikesinfo = yield (0, postAuthApplications_1.handleGetlikesdislikesinfo)(postId, dbPostRepository);
        res.status(200).json({ likesdislikesinfo });
    }));
    const deletepost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = req.params;
        const deltePostResult = yield (0, postAuthApplications_1.handleDeltePosts)(postId, dbPostRepository);
        res.status(200).json({ deltePostResult });
    }));
    const addComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commentData = req.body;
        console.log("COmment data in add Comment controller : ", commentData);
        const createComment = yield (0, postAuthApplications_1.handleCreateComment)(commentData, dbPostRepository, dbUserRepository);
        res.status(201).json({
            status: "success",
            message: "Comment created successfully",
            data: createComment,
        });
    }));
    const replytocomment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const replyData = req.body;
        console.log("Reply data in controller : ", replyData);
        const createReply = yield (0, postAuthApplications_1.handleReplyToComment)(replyData, dbPostRepository, dbUserRepository);
        res.status(201).json({
            status: "success",
            message: "Reply added successfully",
            data: createReply,
        });
    }));
    const getallcomments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = req.params;
        const allComments = yield (0, postAuthApplications_1.handleGetAllComments)(postId, dbPostRepository);
        // console.log("All commens t0 send back : ", allComments)
        res.status(201).json({
            status: "success",
            message: "All comments fetched for the post ",
            data: allComments,
        });
    }));
    const deleteComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { commentId } = req.params;
        const deleteComment = yield (0, postAuthApplications_1.handleDelteComment)(commentId, dbPostRepository);
        res.status(200).json({ deleteComment });
    }));
    const editComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { commentId, updatedText } = req.body;
        console.log("handleEditComments:", commentId, updatedText);
        try {
            const allComments = yield (0, postAuthApplications_1.handleEditComments)(commentId, updatedText, dbPostRepository);
            res.status(201).json({
                status: "success",
                message: "All comments edited for the post",
                data: allComments,
            });
        }
        catch (error) {
            res.status(error.status || 500).json({
                status: "error",
                message: error.message || "Failed to edit comments",
            });
        }
    }));
    const darkmode = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const modesResult = yield (0, postAuthApplications_1.handleDarkMode)(userId, dbPostRepository);
            res.status(201).json({
                status: "success",
                message: "Dark mode set successfully",
            });
        }
        catch (error) {
            res.status(error.status || 500).json({
                status: "error",
                message: error.message || "Failed to set dark mode",
            });
        }
    }));
    const leftsidebar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const modesResult = yield (0, postAuthApplications_1.handleLeftSidebar)(userId, dbPostRepository);
            res.status(201).json({
                status: "success",
                message: "handleLeftSidebar updated successfully",
            });
        }
        catch (error) {
            res.status(error.status || 500).json({
                status: "error",
                message: error.message || "Failed to handleLeftSidebar",
            });
        }
    }));
    const rightsidebar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const modesResult = yield (0, postAuthApplications_1.handleRightSidebar)(userId, dbPostRepository);
            res.status(201).json({
                status: "success",
                message: "handleRightSidebar updated successfully",
            });
        }
        catch (error) {
            res.status(error.status || 500).json({
                status: "error",
                message: error.message || "Failed to handleRightSidebar",
            });
        }
    }));
    const getstories = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const getStoriesData = yield (0, postAuthApplications_1.handleGetStoriesForUser)(userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Stories fetched for user",
            data: getStoriesData,
        });
    }));
    const getStoriesForHighlights = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const getStoriesData = yield (0, postAuthApplications_1.handleGetStoriesForHighlights)(userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Stories fetched for user highlights",
            data: getStoriesData,
        });
    }));
    const storiesforhighlightsusername = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const { userId }: { userId: string } = req.body;
        const { username } = req.params;
        console.log("Username; storiesforhighlightsusername ", username);
        const getStoriesData = yield (0, postAuthApplications_1.handleGetStoriesForHighlightsUsername)(username, dbPostRepository);
        console.log("getStoriesData; storiesforhighlightsusername ", getStoriesData);
        res.status(201).json({
            status: "success",
            message: "Stories fetched for user highlights",
            data: getStoriesData,
        });
    }));
    const getHighlightsData = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        // console.log("getHighlightsData Userid: ", userId)
        const getHighlightsDataUser = yield (0, postAuthApplications_1.handleGetHighlightsData)(userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Highlights Data fetched for user highlights",
            data: getHighlightsDataUser,
        });
    }));
    const gethighlightsusingusername = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const { username } = req.params;
        // console.log("getHighlightsData Userid: ", userId)
        // console.log("getHighlightsData username: ", username)
        const getHighlightsDataUser = yield (0, postAuthApplications_1.handleGetHighlightsDataUsingUsername)(username, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Highlights Data fetched for user highlights",
            data: getHighlightsDataUser,
        });
    }));
    const createstoryhighlights = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        // console.log("Payload: create highlight : ", payload)
        const getStoriesData = yield (0, postAuthApplications_1.handleCreateHighlights)(payload, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Highlights created successfully",
            data: getStoriesData,
        });
    }));
    const deletehighlight = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { highlightId } = req.params;
        const { userId } = req.body;
        const getStoriesData = yield (0, postAuthApplications_1.handleDeleteHighlight)(highlightId, userId, dbPostRepository);
        res.status(201).json({
            status: "success",
            message: "Highlights deleted",
        });
    }));
    const getFeeds = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        // const userId = "66641cdb828195c0d1697a32"
        // console.log("getFeeds Userid: ", userId);
        const getFeedsResult = yield (0, postAuthApplications_1.handleGetFeeds)(userId);
        res.status(201).json({
            status: "success",
            message: "Feeds fetched for user",
            data: getFeedsResult,
        });
    }));
    return {
        addPost,
        updatepost,
        getpostforuser,
        getpostforuserusername,
        gettaggedpostforuserusername,
        getpostlengthofuser,
        getpostofcurrentuser,
        getsavedpostofcurrentuser,
        gettaggedpostofcurrentuser,
        getparticularpostofcurrentuser,
        getPostUsingPostId,
        generatecaption,
        reportPost,
        savePost,
        removesavePost,
        removetaggedpost,
        likePost,
        dislikePost,
        getlikedposts,
        getallpublicpostsforexplore,
        getdislikedposts,
        getlikesdislikesinfo,
        deletepost,
        addComment,
        getallcomments,
        deleteComment,
        editComment,
        replytocomment,
        darkmode,
        leftsidebar,
        rightsidebar,
        addStory,
        getstories,
        createstoryhighlights,
        getStoriesForHighlights,
        getHighlightsData,
        gethighlightsusingusername,
        deletehighlight,
        storiesforhighlightsusername,
        getFeeds,
    };
};
exports.default = postController;
