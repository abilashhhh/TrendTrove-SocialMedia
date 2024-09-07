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
exports.userRepositoryMongoDB = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const premiumAccount_1 = __importDefault(require("../models/premiumAccount"));
const reportPostModel_1 = __importDefault(require("../models/reportPostModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
//////////////////////////////////////////////////////////
const userRepositoryMongoDB = () => {
    //////////////////////////////////////////////////////////
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // // console.log("Add user tried to run, data : ", user);
            const newUser = new userModel_1.default(user);
            return yield newUser.save();
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error adding user!");
        }
    });
    //////////////////////////////////////////////////////////
    const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findOne({ email });
            // console.log("User from getUserByEmail : ", user)
            return user;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error getting user by email!");
        }
    });
    //////////////////////////////////////////////////////////
    const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            return user;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error getting user by userId!");
        }
    });
    //////////////////////////////////////////////////////////
    const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // // console.log("repo ;", username);
            const user = yield userModel_1.default.findOne({ username });
            return user;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error getting user by username!");
        }
    });
    //////////////////////////////////////////////////////////
    const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userModel_1.default.updateOne({
                _id: userId,
            }, { $unset: { refreshToken: 1, refreshTokenExpiresAt: 1 } });
        }
        catch (error) {
            throw new Error("Error logging out user");
        }
    });
    //////////////////////////////////////////////////////////
    const addRefreshTokenAndExpiry = (email, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("addRefreshTokenAndExpiry  email: ", email);
            console.log("addRefreshTokenAndExpiry  refreshToken: ", refreshToken);
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const user = yield userModel_1.default.findOneAndUpdate({ email }, { refreshToken, refreshTokenExpiresAt }, { new: true });
            return user;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error updating user refresh token and expiry!");
        }
    });
    //////////////////////////////////////////////////////////
    const updateProfile = (profileInfo) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndUpdate(profileInfo._id, profileInfo, {
                new: true,
            });
            updateFollowSchemaDps();
            return user;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error updating profile!");
        }
    });
    const updatePassword = (_id, encryptedNewPassword) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndUpdate(_id, { password: encryptedNewPassword }, { new: true });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        }
        catch (error) {
            console.error("Error updating password:", error);
            throw new Error("Error updating password!");
        }
    });
    const deleteAccount = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndDelete(_id);
            return user;
        }
        catch (error) {
            console.error("Error updating password:", error);
            throw new Error("Error updating password!");
        }
    });
    const suspendAccount = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndUpdate(_id, { isSuspended: true }, { new: true });
            return user;
        }
        catch (error) {
            console.error("Error suspending account:", error);
            throw new Error("Error suspending account!");
        }
    });
    const blockAccount = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndUpdate(_id, { isBlocked: true }, { new: true });
            return user;
        }
        catch (error) {
            console.error("Error blocking account:", error);
            throw new Error("Error blocking account!");
        }
    });
    const unblockAccount = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndUpdate(_id, { isBlocked: false }, { new: true });
            return user;
        }
        catch (error) {
            console.error("Error unblocking account:", error);
            throw new Error("Error unblocking account!");
        }
    });
    const privateAccount = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndUpdate(_id, { isPrivate: true }, { new: true });
            return user;
        }
        catch (error) {
            console.error("Error setting private account:", error);
            throw new Error("Error setting private account!");
        }
    });
    const publicAccount = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findByIdAndUpdate(_id, { isPrivate: false }, { new: true });
            return user;
        }
        catch (error) {
            console.error("Error setting public account:", error);
            throw new Error("Error setting public account!");
        }
    });
    const getAllUsers = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield userModel_1.default.find({
                _id: { $ne: id },
                isAdmin: { $ne: true },
                isBlocked: { $ne: true },
                isSuspended: { $ne: true },
            }, "username dp email name bio isPrivate isPremium followers following requestedByMe requestsForMe createdAt posts blockedUsers coverPhoto").exec();
            // console.log(users);
            return users;
        }
        catch (error) {
            console.error("Error getting all users", error);
            throw new Error("Error getting all users");
        }
    });
    const getAllUsersForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield userModel_1.default.find({
                isAdmin: { $ne: true },
            }, "username dp name email bio isPrivate   isSuspended isBlocked isGoogleSignedIn ").exec();
            // console.log(users);
            return users;
        }
        catch (error) {
            console.error("Error getting all users", error);
            throw new Error("Error getting all users");
        }
    });
    const getAllReportsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reports = yield reportPostModel_1.default.find().exec();
            const detailedReports = yield Promise.all(reports.map((report) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const post = yield postModel_1.default.findById(report.postId).exec();
                    if (post) {
                        return Object.assign(Object.assign({}, report.toObject()), { postDetails: post });
                    }
                    else {
                        // If post doesn't exist, return null or handle it as needed
                        return null;
                    }
                }
                catch (error) {
                    console.error("Error getting post details for report:", error);
                    throw new Error("Error getting post details for report");
                }
            })));
            const validReports = detailedReports.filter(report => report !== null);
            return validReports;
        }
        catch (error) {
            console.error("Error getting all reports:", error);
            throw new Error("Error getting all reports");
        }
    });
    const getAllPremiumRequestsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const premiumAccounts = yield premiumAccount_1.default.find().exec();
            return premiumAccounts;
        }
        catch (error) {
            console.error("Error getting all PremiumAccount:", error);
            throw new Error("Error getting all PremiumAccount");
        }
    });
    const changeIsAccountVerified = (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userModel_1.default.updateOne({ email }, {
                $set: {
                    isAccountVerified: true,
                },
            });
            return true;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error changing isAccountVerified field");
        }
    });
    const changeIsAccountUnverified = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userModel_1.default.updateOne({ _id: userId }, {
                $set: {
                    isAccountVerified: false,
                },
            });
            return true;
        }
        catch (error) {
            // console.log(error);
            throw new Error("Error changing isAccountVerified field");
        }
    });
    const followUser = (currentUserId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const targetUser = yield userModel_1.default.findById(targetUserId);
            if (!currentUser || !targetUser) {
                throw new Error("User not found");
            }
            if (targetUser.isPrivate) {
                if (!currentUser.requestedByMe.some(user => user.userId.equals(targetUserId))) {
                    currentUser.requestedByMe.push({
                        userId: targetUserId,
                        dp: targetUser.dp,
                        username: targetUser.username,
                    });
                    targetUser.requestsForMe.push({
                        userId: currentUserId,
                        username: currentUser.username,
                        dp: currentUser.dp,
                    });
                }
            }
            else {
                if (!currentUser.following.some(user => user.userId.equals(targetUserId))) {
                    currentUser.following.push({
                        userId: targetUserId,
                        username: targetUser.username,
                        dp: targetUser.dp,
                    });
                    targetUser.followers.push({
                        userId: currentUserId,
                        username: currentUser.username,
                        dp: currentUser.dp,
                    });
                }
            }
            yield currentUser.save();
            yield targetUser.save();
            return { message: "You are now following this user" };
        }
        catch (error) {
            console.error("Error in makeUserAFollower", error);
            throw new Error("Error in makeUserAFollower");
        }
    });
    const unfollowUser = (currentUserId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const targetUser = yield userModel_1.default.findById(targetUserId);
            if (!currentUser || !targetUser) {
                throw new Error("User not found");
            }
            currentUser.following = currentUser.following.filter(user => !user.userId.equals(targetUserId));
            targetUser.followers = targetUser.followers.filter(user => !user.userId.equals(currentUserId));
            yield currentUser.save();
            yield targetUser.save();
            // console.log("Unfollow successful");
            return { message: "You have unfollowed this user" };
        }
        catch (error) {
            console.error("Error in unfollowUser", error);
            throw new Error("Error in unfollowing the user");
        }
    });
    const cancelSendFriendRequest = (currentUserId, requesterUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const requesterUser = yield userModel_1.default.findById(requesterUserId);
            if (!currentUser || !requesterUser) {
                throw new Error("User not found");
            }
            currentUser.requestsForMe = currentUser.requestsForMe.filter(user => !user.userId.equals(requesterUserId));
            requesterUser.requestedByMe = requesterUser.requestedByMe.filter(user => !user.userId.equals(currentUserId));
            yield currentUser.save();
            yield requesterUser.save();
            // console.log("Unfollow successful");
            return { message: "You have cancelled the friend request sent" };
        }
        catch (error) {
            console.error("Error in cancelSendFriendRequest", error);
            throw new Error("Error in cancelling the send friend request");
        }
    });
    const acceptFriendRequest = (currentUserId, requesterUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const requesterUser = yield userModel_1.default.findById(requesterUserId);
            if (!currentUser || !requesterUser) {
                throw new Error("User not found");
            }
            currentUser.requestsForMe = currentUser.requestsForMe.filter(user => !user.userId.equals(requesterUserId));
            requesterUser.requestedByMe = requesterUser.requestedByMe.filter(user => !user.userId.equals(currentUserId));
            currentUser.followers.push({
                userId: requesterUserId,
                username: requesterUser.username,
                dp: requesterUser.dp,
            });
            requesterUser.following.push({
                userId: currentUserId,
                username: currentUser.username,
                dp: currentUser.dp,
            });
            yield currentUser.save();
            yield requesterUser.save();
            // console.log("Follow request accepted");
            return { message: "Follow request accepted" };
        }
        catch (error) {
            console.error("Error in acceptFriendRequest", error);
            throw new Error("Error in accepting the friend request");
        }
    });
    const rejectFriendRequest = (currentUserId, requesterUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const requesterUser = yield userModel_1.default.findById(requesterUserId);
            if (!currentUser || !requesterUser) {
                throw new Error("User not found");
            }
            currentUser.requestsForMe = currentUser.requestsForMe.filter(user => !user.userId.equals(requesterUserId));
            requesterUser.requestedByMe = requesterUser.requestedByMe.filter(user => !user.userId.equals(currentUserId));
            yield currentUser.save();
            yield requesterUser.save();
            // console.log("Follow request rejected");
            return { message: "Follow request rejected" };
        }
        catch (error) {
            console.error("Error in rejectFriendRequest", error);
            throw new Error("Error in rejecting the friend request");
        }
    });
    const setPaymentDetails = (userId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(userId);
            if (!currentUser) {
                throw new Error("User not found");
            }
            let premiumAccount = yield premiumAccount_1.default.findOne({ userId });
            if (!premiumAccount) {
                premiumAccount = new premiumAccount_1.default({
                    userId,
                    paymentDetails: paymentId,
                    premiumRequest: {
                        isRequested: true,
                        documents: [],
                    },
                });
            }
            else {
                premiumAccount.paymentDetails = paymentId;
            }
            yield premiumAccount.save();
            return {
                status: "success",
                message: "Payment details updated successfully",
            };
        }
        catch (error) {
            console.error("Error in setPaymentDetails", error);
            throw new Error("Error in updating payment details");
        }
    });
    const handleDocumentSubmission = (userId, documentType, images) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const premiumAccount = yield premiumAccount_1.default.findOne({ userId });
            if (!premiumAccount) {
                throw new Error("Premium account not found");
            }
            (_a = premiumAccount === null || premiumAccount === void 0 ? void 0 : premiumAccount.premiumRequest) === null || _a === void 0 ? void 0 : _a.documents.push({
                type: documentType,
                image: images,
            });
            if (((_c = (_b = premiumAccount === null || premiumAccount === void 0 ? void 0 : premiumAccount.premiumRequest) === null || _b === void 0 ? void 0 : _b.documents) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                (_d = premiumAccount === null || premiumAccount === void 0 ? void 0 : premiumAccount.premiumRequest) === null || _d === void 0 ? void 0 : _d.isRequested = true;
            }
            yield premiumAccount.save();
            return { status: "success", message: "Documents submitted successfully" };
        }
        catch (error) {
            console.error("Error in handleDocumentSubmission", error);
            throw new Error("Error in submitting documents");
        }
    });
    const premiumUsersProgress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const premiumAccount = yield premiumAccount_1.default.findOne({ userId });
            if (!premiumAccount) {
                throw new Error("Premium account not found");
            }
            return premiumAccount;
        }
        catch (error) {
            console.error("Error in handleDocumentSubmission", error);
            throw new Error("Error in submitting documents");
        }
    });
    const blockOtherUser = (currentUserId, blockUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const blockUser = yield userModel_1.default.findById(blockUserId);
            if (!currentUser || !blockUser) {
                throw new Error("User not found");
            }
            if (currentUser.blockedUsers.includes(blockUserId)) {
                return { message: "User is already blocked" };
            }
            currentUser.blockedUsers.push(blockUserId);
            yield currentUser.save();
            return { message: "You have blocked the user" };
        }
        catch (error) {
            console.error("Error in blockOtherUser", error);
            throw new Error("Error in blocking the user");
        }
    });
    const unblockOtherUser = (currentUserId, unblockUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentUser = yield userModel_1.default.findById(currentUserId);
            const blockUser = yield userModel_1.default.findById(unblockUserId);
            if (!currentUser || !blockUser) {
                throw new Error("User not found");
            }
            if (!currentUser.blockedUsers.includes(unblockUserId)) {
                return { message: "User is not blocked" };
            }
            currentUser.blockedUsers.pull(unblockUserId);
            yield currentUser.save();
            return { message: "You have unblocked the user" };
        }
        catch (error) {
            console.error("Error in unblockOtherUser", error);
            throw new Error("Error in unblocking the user");
        }
    });
    const updateFollowSchemaDps = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield userModel_1.default.find({});
            for (const user of users) {
                const updateDpInArray = (arrayName) => __awaiter(void 0, void 0, void 0, function* () {
                    for (const followEntry of user[arrayName]) {
                        const followedUser = yield userModel_1.default.findById(followEntry.userId, 'dp');
                        if (followedUser) {
                            followEntry.dp = followedUser.dp;
                        }
                    }
                });
                yield updateDpInArray('requestsForMe');
                yield updateDpInArray('requestedByMe');
                yield updateDpInArray('followers');
                yield updateDpInArray('following');
                yield user.save();
            }
            console.log('Profile pictures updated successfully.');
        }
        catch (error) {
            console.error('Error updating profile pictures:', error);
        }
    });
    // updateFollowSchemaDps(); //
    const clearAll = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield userModel_1.default.updateMany({}, {
                $set: {
                    requestsForMe: [],
                    requestedByMe: [],
                    followers: [],
                    following: [],
                },
            });
            // console.log(`Cleared data for  users.`);
        }
        catch (error) {
            console.error("Error clearing data:", error);
        }
    });
    // clearAll();
    ////////////////////////////////////////////////
    return {
        addUser,
        getUserByEmail,
        getUserById,
        getUserByUsername,
        addRefreshTokenAndExpiry,
        logoutUser,
        updateProfile,
        updatePassword,
        changeIsAccountVerified,
        changeIsAccountUnverified,
        deleteAccount,
        suspendAccount,
        privateAccount,
        publicAccount,
        getAllUsers,
        getAllUsersForAdmin,
        getAllReportsForAdmin,
        getAllPremiumRequestsForAdmin,
        blockAccount,
        unblockAccount,
        followUser,
        unfollowUser,
        cancelSendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        setPaymentDetails,
        handleDocumentSubmission,
        premiumUsersProgress,
        blockOtherUser,
        unblockOtherUser,
    };
};
exports.userRepositoryMongoDB = userRepositoryMongoDB;
