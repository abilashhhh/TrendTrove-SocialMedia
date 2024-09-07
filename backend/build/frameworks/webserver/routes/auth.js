"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../../../adapters/authController/authController"));
const authService_1 = require("../../services/authService");
const authServiceInterface_1 = require("../../../application/services/authServiceInterface");
const userRepository_1 = require("../../database/mongodb/respositories/userRepository");
const userDBRepository_1 = require("../../../application/repositories/userDBRepository");
const otpRepositoryMongoDB_1 = require("../../database/mongodb/respositories/otpRepositoryMongoDB");
const OTPDBRepository_1 = require("../../../application/repositories/OTPDBRepository");
const mailSendService_1 = require("../../services/mailSendService");
const mailServiceInterface_1 = require("../../../application/services/mailServiceInterface");
const authRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, authController_1.default)(authService_1.authService, authServiceInterface_1.authServiceInterface, userRepository_1.userRepositoryMongoDB, userDBRepository_1.userDBRepository, otpRepositoryMongoDB_1.otpRepositoryMongoDB, OTPDBRepository_1.otpDbRepository, mailSendService_1.mailSenderService, mailServiceInterface_1.mailSenderServiceInterface);
    router.post('/signup', controller.registerUser);
    router.post('/signin', controller.signInUser);
    router.get('/usernameavailablity/:username', controller.usernameAvailability);
    router.get('/emailavailability/:email', controller.emailAvailability);
    router.post('/generateotp', controller.sendOtp); // generates otp and sent through mail
    router.post('/verifyotp', controller.verifyOtpForEmailVerification);
    return router;
};
exports.default = authRouter;
