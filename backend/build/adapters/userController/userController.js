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
const profileAuthApplication_1 = require("../../application/use-cases/profile/profileAuthApplication");
const userController = (userDBRepositoryImplementation, userDBRepositoryInterface, authServiceImplementation, authServiceInterface) => {
    const dbUserRepository = userDBRepositoryInterface(userDBRepositoryImplementation());
    const authService = authServiceInterface(authServiceImplementation());
    const getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const user = yield (0, profileAuthApplication_1.handleGetAllUsers)(userId, dbUserRepository);
        res.json({
            status: "success",
            message: "All users info fetched",
            user,
        });
    }));
    const getuserprofile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        const user = yield (0, profileAuthApplication_1.handleUserbyUsername)(username, dbUserRepository);
        res.json({
            status: "success",
            message: "User info fetched",
            user,
        });
    }));
    const followUserRequest = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, targetUserId } = req.body;
        const result = yield (0, profileAuthApplication_1.handleFollowUserRequest)(userId, targetUserId, dbUserRepository);
        res.json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    }));
    const unfollowUserRequest = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, targetUserId } = req.body;
        const result = yield (0, profileAuthApplication_1.handleUnFollowUserRequest)(userId, targetUserId, dbUserRepository);
        res.json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    }));
    const cancelfollowUserRequest = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, targetUserId } = req.body;
        const result = yield (0, profileAuthApplication_1.handleCancelFollowUserRequest)(userId, targetUserId, dbUserRepository);
        res.json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    }));
    const acceptfollowUserRequest = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, targetUserId } = req.body;
        const result = yield (0, profileAuthApplication_1.handleAcceptFollowUserRequest)(userId, targetUserId, dbUserRepository);
        res.json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    }));
    const rejectfollowUserRequest = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, targetUserId } = req.body;
        const result = yield (0, profileAuthApplication_1.handleRejectFollowUserRequest)(userId, targetUserId, dbUserRepository);
        res.json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    }));
    const blockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, blockUserId } = req.body;
        const result = yield (0, profileAuthApplication_1.handleBlockUser)(userId, blockUserId, dbUserRepository);
        res.json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    }));
    const unblockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, unblockUserId } = req.body;
        const result = yield (0, profileAuthApplication_1.handleUnBlockUser)(userId, unblockUserId, dbUserRepository);
        res.json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    }));
    return {
        getAllUsers,
        getuserprofile,
        followUserRequest,
        cancelfollowUserRequest,
        acceptfollowUserRequest,
        unfollowUserRequest,
        rejectfollowUserRequest,
        blockUser,
        unblockUser,
    };
};
exports.default = userController;
