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
exports.handleRejectPremium = exports.handleApprovePremium = exports.handleUnblockPost = exports.handleBlockPost = exports.handleUnBlockAccount = exports.handleBlockAccount = exports.handkeGetPremiumRequests = exports.handkeGetallpostreports = exports.handleGetAllUsersForAdmin = void 0;
const ErrorInApplication_1 = __importDefault(require("../../../utils/ErrorInApplication"));
const handleGetAllUsersForAdmin = (dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleyeallusers called")
        const user = yield dbUserRepository.getAllUsersForAdmin();
        return user;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to get all users data", 401);
    }
});
exports.handleGetAllUsersForAdmin = handleGetAllUsersForAdmin;
const handkeGetallpostreports = (dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handkeGetallpostreports called")
        const reports = yield dbUserRepository.getAllReportsForAdmin();
        return reports;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to get all users data", 401);
    }
});
exports.handkeGetallpostreports = handkeGetallpostreports;
const handkeGetPremiumRequests = (dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handkeGetPremiumRequests called")
        const reports = yield dbUserRepository.getAllPremiumRequestsForAdmin();
        return reports;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to get all users data", 401);
    }
});
exports.handkeGetPremiumRequests = handkeGetPremiumRequests;
const handleBlockAccount = (userId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Userdetails in handle block: ", userId)
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new Error("User not found");
        }
        // Update user's password in the database
        const user = yield dbUserRepository.blockAccount(userId);
        return user;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to block user", 401);
    }
});
exports.handleBlockAccount = handleBlockAccount;
const handleUnBlockAccount = (userId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Userdetails in handle unblock: ", userId)
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new Error("User not found");
        }
        // Update user's password in the database
        const user = yield dbUserRepository.unblockAccount(userId);
        return user;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to unblock user", 401);
    }
});
exports.handleUnBlockAccount = handleUnBlockAccount;
const handleBlockPost = (postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Post details in handle block: ", postId);
        const post = yield dbPostRepository.blockPost(postId);
        return post;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to block post", 401);
    }
});
exports.handleBlockPost = handleBlockPost;
const handleUnblockPost = (postId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Post details in handle unblock: ", postId);
        const post = yield dbPostRepository.unblockPost(postId);
        return post;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to unblock post", 401);
    }
});
exports.handleUnblockPost = handleUnblockPost;
const handleApprovePremium = (userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("premiumResult details in handleApprovePremium: ", userId);
        const premiumResult = yield dbPostRepository.approvePremium(userId);
        return premiumResult;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to approve premium", 401);
    }
});
exports.handleApprovePremium = handleApprovePremium;
const handleRejectPremium = (userId, dbPostRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("premiumResult details in handleRejectPremium: ", userId);
        const premiumResult = yield dbPostRepository.rejectPremium(userId);
        return premiumResult;
    }
    catch (err) {
        console.error("Error: ", err);
        throw new ErrorInApplication_1.default("Failed to reject premium", 401);
    }
});
exports.handleRejectPremium = handleRejectPremium;
