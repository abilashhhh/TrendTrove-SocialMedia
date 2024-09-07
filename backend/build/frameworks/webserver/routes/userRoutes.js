"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authenticationServiceInterface_1 = require("../../../application/services/authenticationServiceInterface");
const authenticationService_1 = require("../../services/authenticationService");
const userRepositoryDatabase_1 = require("../../database/mongodb/respositories/userRepositoryDatabase");
const userDBRepository_1 = require("../../../application/repositories/userDBRepository");
const userController_1 = __importDefault(require("../../../adapters/userController/userController"));
const userRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, userController_1.default)(userRepositoryDatabase_1.userRepositoryMongoDB, userDBRepository_1.userDBRepository, authenticationService_1.authService, authenticationServiceInterface_1.authServiceInterface);
    router.get("/getallusers", authMiddleware_1.default, controller.getAllUsers);
    router.get("/getuserprofile/:username", authMiddleware_1.default, controller.getuserprofile);
    router.post("/followuser", authMiddleware_1.default, controller.followUserRequest);
    router.post("/unfollowuser", authMiddleware_1.default, controller.unfollowUserRequest);
    router.post("/cancelrequest", authMiddleware_1.default, controller.cancelfollowUserRequest);
    router.post("/acceptrequest", authMiddleware_1.default, controller.acceptfollowUserRequest);
    router.post("/rejectrequest", authMiddleware_1.default, controller.rejectfollowUserRequest);
    router.post("/blockuserbyuser", authMiddleware_1.default, controller.blockUser);
    router.post("/unblockuserbyuser", authMiddleware_1.default, controller.unblockUser);
    return router;
};
exports.default = userRouter;
