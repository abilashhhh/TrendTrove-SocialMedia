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
const profileController = (userDBRepositoryImplementation, userDBRepositoryInterface, authServiceImplementation, authServiceInterface) => {
    const dbUserRepository = userDBRepositoryInterface(userDBRepositoryImplementation());
    const authService = authServiceInterface(authServiceImplementation());
    const getUserInfo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        // console.log("Get user info2 ran : ", userId);
        const user = yield (0, profileAuthApplication_1.handleUserInfo)(userId, dbUserRepository);
        res.json({
            status: "success",
            message: "User info fetched",
            user,
        });
    }));
    const editProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const profileInfo = req.body;
        const userData = yield (0, profileAuthApplication_1.handleEditProfile)(profileInfo, dbUserRepository);
        res.json({
            status: "success",
            message: "User edited successfully",
            userData,
        });
    }));
    const changePassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id, currentPassword, newPassword } = req.body;
        const userData = yield (0, profileAuthApplication_1.handlePasswordChange)(_id, currentPassword, newPassword, dbUserRepository, authService);
        res.json({
            status: "success",
            message: "Password changed successfully",
            userData,
        });
    }));
    const changePassword2 = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id, newPassword } = req.body;
        const userData = yield (0, profileAuthApplication_1.handlePasswordChange2)(_id, newPassword, dbUserRepository, authService);
        res.json({
            status: "success",
            message: "Password changed successfully",
            userData,
        });
    }));
    const deleteAccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, password } = req.params;
        const result = yield (0, profileAuthApplication_1.handleDeleteAccount)(id, password, dbUserRepository, authService);
        res.json({
            status: "success",
            message: "Account deleted successfully",
            result,
        });
    }));
    const suspendAccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, password } = req.params;
        const result = yield (0, profileAuthApplication_1.handleSuspendAccount)(id, password, dbUserRepository, authService);
        res.json({
            status: "success",
            message: "Account suspended successfully",
            result,
        });
    }));
    const privateAccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, password } = req.params;
        const result = yield (0, profileAuthApplication_1.handlePrivateAccount)(id, password, dbUserRepository, authService);
        res.json({
            status: "success",
            message: "Account set to private successfully",
            result,
        });
    }));
    const publicaccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, password } = req.params;
        const result = yield (0, profileAuthApplication_1.handlePublicAccount)(id, password, dbUserRepository, authService);
        res.json({
            status: "success",
            message: "Account set to public successfully",
            result,
        });
    }));
    const verifyPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, password } = req.params;
        try {
            const result = yield (0, profileAuthApplication_1.handleVerifyPassword)(id, password, dbUserRepository, authService);
            res.json({
                status: "success",
                message: "Password verified successfully",
                result,
            });
        }
        catch (error) {
            console.log("error in verify pass");
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message || "Failed to verify password",
            });
        }
    }));
    const premiumaccountuserprogress = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const result = yield (0, profileAuthApplication_1.handlePremiumAccountUserProgress)(userId, dbUserRepository, authService);
            res.json({
                status: "success",
                message: "premiumaccountuserprogress receivec successfully",
                result,
            });
        }
        catch (error) {
            console.log("error in handlePremiumAccountUserProgress");
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message || "Failed to get premium account userr progress",
            });
        }
    }));
    const makeVerifiedAccountPayment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const order = yield (0, profileAuthApplication_1.handleVerifiedAccountPayment)(userId, dbUserRepository, authService);
            res.json({
                status: "success",
                message: "Premium account payment completed successfully",
                order,
            });
        }
        catch (error) {
            console.log("error in completing payment");
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message || "Failed to completing payment",
            });
        }
    }));
    const setPremiumAccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, paymentId } = req.body;
        try {
            console.log("setPremiumAccount reached, ", userId, paymentId);
            const order = yield (0, profileAuthApplication_1.handleSetPremiumAccount)(userId, paymentId, dbUserRepository, authService);
            res.json({
                status: "success",
                message: "Premium account payment completed  and submitted   successfully",
                order,
            });
        }
        catch (error) {
            console.log("error in completing payment");
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message || "Failed  account payment and  submission ",
            });
        }
    }));
    const toverifydocspremium = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, documentType, images } = req.body;
        try {
            console.log("toverifydocspremium reached, ", userId, documentType, images);
            const order = yield (0, profileAuthApplication_1.handleverifydocspremium)(userId, documentType, images, dbUserRepository, authService);
            res.json({
                status: "success",
                message: "Premium account payment completed  and submitted for verification successfully",
                order,
            });
        }
        catch (error) {
            console.log("error in completing payment");
            res.status(error.statusCode || 500).json({
                status: "error",
                message: error.message || "Failed  account payment and  verification ",
            });
        }
    }));
    return {
        getUserInfo,
        editProfile,
        changePassword,
        changePassword2,
        deleteAccount,
        suspendAccount,
        privateAccount,
        verifyPassword,
        makeVerifiedAccountPayment,
        setPremiumAccount,
        toverifydocspremium,
        publicaccount,
        premiumaccountuserprogress
    };
};
exports.default = profileController;
