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
const adminAuthApplication_1 = require("../../application/use-cases/admin/adminAuthApplication");
const adminController = (userDBRepositoryImplementation, userDBRepositoryInterface, postDBRepositoryImplementation, postDBRepositoryInterface, authServiceImplementation, authServiceInterface) => {
    const dbUserRepository = userDBRepositoryInterface(userDBRepositoryImplementation());
    const dbPostRepository = postDBRepositoryInterface(postDBRepositoryImplementation());
    const authService = authServiceInterface(authServiceImplementation());
    const logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.clearCookie("refreshToken");
        res.json({ status: "success", message: "Admin logged out successfully" });
    }));
    const getAllUsersForAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, adminAuthApplication_1.handleGetAllUsersForAdmin)(dbUserRepository);
        res.json({
            status: "success",
            message: "All users info fetched",
            users,
        });
    }));
    const getallpostreports = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const reports = yield (0, adminAuthApplication_1.handkeGetallpostreports)(dbUserRepository);
        res.json({
            status: "success",
            message: "All reports info fetched",
            reports,
        });
    }));
    const getpremiumaccountrequests = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const premiumAccountRequests = yield (0, adminAuthApplication_1.handkeGetPremiumRequests)(dbUserRepository);
        res.json({
            status: "success",
            message: "All premiumAccountRequests info fetched",
            premiumAccountRequests,
        });
    }));
    const blockAccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const result = yield (0, adminAuthApplication_1.handleBlockAccount)(id, dbUserRepository);
        res.json({
            status: "success",
            message: "Account blocked successfully",
            result,
        });
    }));
    const unblockAccount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const result = yield (0, adminAuthApplication_1.handleUnBlockAccount)(id, dbUserRepository);
        res.json({
            status: "success",
            message: "Account unblocked successfully",
            result,
        });
    }));
    const blockPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = req.params;
        const result = yield (0, adminAuthApplication_1.handleBlockPost)(postId, dbPostRepository);
        res.json({
            status: "success",
            message: "Post blocked successfully",
            result,
        });
    }));
    const unblockPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = req.params;
        const result = yield (0, adminAuthApplication_1.handleUnblockPost)(postId, dbPostRepository);
        res.json({
            status: "success",
            message: "Post unblocked successfully",
            result,
        });
    }));
    const approvepremium = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const result = yield (0, adminAuthApplication_1.handleApprovePremium)(userId, dbPostRepository);
        res.json({
            status: "success",
            message: "Premium approved successfully",
            result,
        });
    }));
    const removepremium = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const result = yield (0, adminAuthApplication_1.handleRejectPremium)(userId, dbPostRepository);
        res.json({
            status: "success",
            message: "Premium approval rejected",
            result,
        });
    }));
    return {
        logout,
        getAllUsersForAdmin,
        getallpostreports,
        blockAccount,
        unblockAccount,
        blockPost,
        unblockPost,
        getpremiumaccountrequests,
        removepremium,
        approvepremium
    };
};
exports.default = adminController;
