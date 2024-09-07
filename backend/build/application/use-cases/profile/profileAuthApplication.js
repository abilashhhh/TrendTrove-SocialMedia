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
exports.handleverifydocspremium = exports.handleSetPremiumAccount = exports.handleVerifiedAccountPayment = exports.handlePremiumAccountUserProgress = exports.handleVerifyPassword = exports.handleUnBlockUser = exports.handleBlockUser = exports.handleRejectFollowUserRequest = exports.handleAcceptFollowUserRequest = exports.handleCancelFollowUserRequest = exports.handleUnFollowUserRequest = exports.handleFollowUserRequest = exports.handleUserbyUsername = exports.handleGetAllUsers = exports.handlePublicAccount = exports.handlePrivateAccount = exports.handleSuspendAccount = exports.handleDeleteAccount = exports.handlePasswordChange = exports.handlePasswordChange2 = exports.handleEditProfile = exports.handleUserInfo = void 0;
const ErrorInApplication_1 = __importDefault(require("../../../utils/ErrorInApplication"));
const razorpay_1 = __importDefault(require("razorpay"));
// import Razorpay from "razorpay";
const handleUserInfo = (userId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("handleUserInfo ran in profile usecase");
        const userData = yield dbUserRepository.getUserById(userId);
        if (!userData) {
            throw new Error("User not found!");
        }
        const user = {
            _id: userData._id.toString(),
            name: userData.name,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            dp: userData.dp,
            coverPhoto: userData.coverPhoto,
            bio: userData.bio,
            gender: userData.gender,
            address: userData.address,
            followers: userData.followers,
            following: userData.following,
            isVerifiedAccount: userData.isVerifiedAccount,
            notifications: userData.notifications,
            savedPosts: userData.savedPosts,
            blockedUsers: userData.blockedUsers,
            taggedPosts: userData === null || userData === void 0 ? void 0 : userData.taggedPosts,
            isGoogleSignedIn: userData.isGoogleSignedIn,
            isBlocked: userData.isBlocked,
            isPrivate: userData.isPrivate,
            isPremium: userData.isPremium,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            isDarkMode: userData.isDarkMode,
            isLeftSidebarOpen: userData.isLeftSidebarOpen,
            isRightSidebarOpen: userData.isRightSidebarOpen,
        };
        return user;
    }
    catch (err) {
        // console.log("error : ", err);
        throw new ErrorInApplication_1.default("User not found!", 401);
    }
});
exports.handleUserInfo = handleUserInfo;
const handleEditProfile = (profileInfo, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("profileInfo...............=-==========", profileInfo);
        if (profileInfo.email) {
            const userData = yield dbUserRepository.getUserByEmail(profileInfo.email);
            if (userData) {
                // console.log("User exists...");
                const user = yield dbUserRepository.updateProfile(profileInfo);
                // console.log("user: ", user);
            }
        }
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to edit profile", 500);
    }
});
exports.handleEditProfile = handleEditProfile;
const handlePasswordChange2 = (_id, newPassword, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(_id);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const encryptedNewPassword = yield authService.encryptPassword(newPassword);
        const user = yield dbUserRepository.updatePassword(_id, encryptedNewPassword);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to change password", 500);
    }
});
exports.handlePasswordChange2 = handlePasswordChange2;
const handlePasswordChange = (_id, currentPassword, newPassword, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(_id);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const isPasswordValid = yield authService.comparePassword(currentPassword, userExists.password);
        if (!isPasswordValid) {
            throw new ErrorInApplication_1.default("Invalid current password", 401);
        }
        const encryptedNewPassword = yield authService.encryptPassword(newPassword);
        const user = yield dbUserRepository.updatePassword(_id, encryptedNewPassword);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to change password", 500);
    }
});
exports.handlePasswordChange = handlePasswordChange;
const handleDeleteAccount = (userId, password, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const isPasswordValid = yield authService.comparePassword(password, userExists.password);
        if (!isPasswordValid) {
            throw new ErrorInApplication_1.default("Invalid current password", 401);
        }
        const user = yield dbUserRepository.deleteAccount(userId);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to delete account", 500);
    }
});
exports.handleDeleteAccount = handleDeleteAccount;
const handleSuspendAccount = (userId, password, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const isPasswordValid = yield authService.comparePassword(password, userExists.password);
        if (!isPasswordValid) {
            throw new ErrorInApplication_1.default("Invalid current password", 401);
        }
        const user = yield dbUserRepository.suspendAccount(userId);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to suspend account", 500);
    }
});
exports.handleSuspendAccount = handleSuspendAccount;
const handlePrivateAccount = (userId, password, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const isPasswordValid = yield authService.comparePassword(password, userExists.password);
        if (!isPasswordValid) {
            throw new ErrorInApplication_1.default("Invalid current password", 401);
        }
        const user = yield dbUserRepository.privateAccount(userId);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to change to private account", 500);
    }
});
exports.handlePrivateAccount = handlePrivateAccount;
const handlePublicAccount = (userId, password, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const isPasswordValid = yield authService.comparePassword(password, userExists.password);
        if (!isPasswordValid) {
            throw new ErrorInApplication_1.default("Invalid current password", 401);
        }
        const user = yield dbUserRepository.publicAccount(userId);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to change to private account", 500);
    }
});
exports.handlePublicAccount = handlePublicAccount;
const handleGetAllUsers = (id, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dbUserRepository.getAllUsers(id);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to get all users data", 401);
    }
});
exports.handleGetAllUsers = handleGetAllUsers;
const handleUserbyUsername = (username, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dbUserRepository.getUserByUsername(username);
        return user;
    }
    catch (err) {
        throw new Error(err);
        throw new ErrorInApplication_1.default("Failed to handleUserbyUsername", 500);
    }
});
exports.handleUserbyUsername = handleUserbyUsername;
const handleFollowUserRequest = (userId, targetUserId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainUser = yield dbUserRepository.getUserById(userId);
        const targetUser = yield dbUserRepository.getUserById(targetUserId);
        if (!mainUser || !targetUser) {
            throw new ErrorInApplication_1.default("User doesn't exist", 401);
        }
        let newResult = yield dbUserRepository.followUser(userId, targetUserId);
        return {
            message: newResult.message,
            user: targetUser,
        };
    }
    catch (err) {
        if (err instanceof ErrorInApplication_1.default) {
            throw err;
        }
        throw new ErrorInApplication_1.default("Failed to handle follow request", 401);
    }
});
exports.handleFollowUserRequest = handleFollowUserRequest;
const handleUnFollowUserRequest = (userId, targetUserId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainUser = yield dbUserRepository.getUserById(userId);
        const targetUser = yield dbUserRepository.getUserById(targetUserId);
        if (!mainUser || !targetUser) {
            throw new ErrorInApplication_1.default("User doesn't exist", 401);
        }
        let newResult = yield dbUserRepository.unfollowUser(userId, targetUserId);
        return {
            message: newResult.message,
            user: targetUser,
        };
    }
    catch (err) {
        if (err instanceof ErrorInApplication_1.default) {
            throw err;
        }
        throw new ErrorInApplication_1.default("Failed to handle unfollow request", 401);
    }
});
exports.handleUnFollowUserRequest = handleUnFollowUserRequest;
const handleCancelFollowUserRequest = (userId, targetUserId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainUser = yield dbUserRepository.getUserById(userId);
        const targetUser = yield dbUserRepository.getUserById(targetUserId);
        if (!mainUser || !targetUser) {
            throw new ErrorInApplication_1.default("User doesn't exist", 401);
        }
        let newResult = yield dbUserRepository.cancelSendFriendRequest(userId, targetUserId);
        return {
            message: newResult.message,
            user: targetUser,
        };
    }
    catch (err) {
        if (err instanceof ErrorInApplication_1.default) {
            throw err;
        }
        throw new ErrorInApplication_1.default("Failed to unsend friend request", 401);
    }
});
exports.handleCancelFollowUserRequest = handleCancelFollowUserRequest;
const handleAcceptFollowUserRequest = (userId, targetUserId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainUser = yield dbUserRepository.getUserById(userId);
        const targetUser = yield dbUserRepository.getUserById(targetUserId);
        if (!mainUser || !targetUser) {
            throw new ErrorInApplication_1.default("User doesn't exist", 401);
        }
        let newResult = yield dbUserRepository.acceptFriendRequest(userId, targetUserId);
        return {
            message: newResult.message,
            user: targetUser,
        };
    }
    catch (err) {
        if (err instanceof ErrorInApplication_1.default) {
            throw err;
        }
        throw new ErrorInApplication_1.default("Failed to unsend friend request", 401);
    }
});
exports.handleAcceptFollowUserRequest = handleAcceptFollowUserRequest;
const handleRejectFollowUserRequest = (userId, targetUserId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainUser = yield dbUserRepository.getUserById(userId);
        const targetUser = yield dbUserRepository.getUserById(targetUserId);
        if (!mainUser || !targetUser) {
            throw new ErrorInApplication_1.default("User doesn't exist", 401);
        }
        let newResult = yield dbUserRepository.rejectFriendRequest(userId, targetUserId);
        return {
            message: newResult.message,
            user: targetUser,
        };
    }
    catch (err) {
        if (err instanceof ErrorInApplication_1.default) {
            throw err;
        }
        throw new ErrorInApplication_1.default("Failed to reject friend request", 401);
    }
});
exports.handleRejectFollowUserRequest = handleRejectFollowUserRequest;
const handleBlockUser = (userId, blockUserId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainUser = yield dbUserRepository.getUserById(userId);
        const targetUser = yield dbUserRepository.getUserById(blockUserId);
        if (!mainUser || !targetUser) {
            throw new ErrorInApplication_1.default("User doesn't exist", 401);
        }
        let newResult = yield dbUserRepository.blockOtherUser(userId, blockUserId);
        return {
            message: newResult.message,
            user: targetUser,
        };
    }
    catch (err) {
        if (err instanceof ErrorInApplication_1.default) {
            throw err;
        }
        throw new ErrorInApplication_1.default("Failed to block user", 401);
    }
});
exports.handleBlockUser = handleBlockUser;
const handleUnBlockUser = (userId, unblockUserId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mainUser = yield dbUserRepository.getUserById(userId);
        const targetUser = yield dbUserRepository.getUserById(unblockUserId);
        if (!mainUser || !targetUser) {
            throw new ErrorInApplication_1.default("User doesn't exist", 401);
        }
        let newResult = yield dbUserRepository.unblockOtherUser(userId, unblockUserId);
        return {
            message: newResult.message,
            user: targetUser,
        };
    }
    catch (err) {
        if (err instanceof ErrorInApplication_1.default) {
            throw err;
        }
        throw new ErrorInApplication_1.default("Failed to block user", 401);
    }
});
exports.handleUnBlockUser = handleUnBlockUser;
const handleVerifyPassword = (userId, password, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        const isPasswordValid = yield authService.comparePassword(password, userExists === null || userExists === void 0 ? void 0 : userExists.password);
        if (!isPasswordValid) {
            throw new ErrorInApplication_1.default("Invalid current password", 401);
        }
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.handleVerifyPassword = handleVerifyPassword;
const handlePremiumAccountUserProgress = (userId, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        let premiumUsersProgress = yield dbUserRepository.premiumUsersProgress(userId);
        return premiumUsersProgress;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.handlePremiumAccountUserProgress = handlePremiumAccountUserProgress;
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
const handleVerifiedAccountPayment = (userId, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            amount: 50000, // 500 INR in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };
        const order = yield razorpay.orders.create(options);
        console.log("Razorpay order details : ", userId, order);
        if (!order) {
            throw new ErrorInApplication_1.default("Error completing the payment for verified account", 401);
        }
        return order;
    }
    catch (err) {
        console.error("Error creating Razorpay order:", err);
        throw new Error(err);
    }
});
exports.handleVerifiedAccountPayment = handleVerifiedAccountPayment;
const handleSetPremiumAccount = (userId, paymentId, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        console.log("Reached handleSetPremiumAccount:", userId, paymentId);
        let paymentDetailsUpdation = yield dbUserRepository.setPaymentDetails(userId, paymentId);
        console.log("paymentDetailsUpdation: ,", paymentDetailsUpdation);
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.handleSetPremiumAccount = handleSetPremiumAccount;
const handleverifydocspremium = (userId, documentType, images, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield dbUserRepository.getUserById(userId);
        if (!userExists) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        console.log("Reached handleDocumentSubmission:", userId, documentType, images);
        let handleDocumentSubmission = yield dbUserRepository.handleDocumentSubmission(userId, documentType, images);
        console.log("handleDocumentSubmission: ,", handleDocumentSubmission);
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.handleverifydocspremium = handleverifydocspremium;
