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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userAuthApplication_1 = require("../../application/use-cases/auth/userAuthApplication");
const authController = (authServiceImplementation, authServiceInterface, userDBRepositoryImplementation, userDBRepositoryInterface, otpDBRepositoryImplementation, otpDbRepositoryInterface, mailSenderServiceImplementation, mailSenderServiceInterface) => {
    const authService = authServiceInterface(authServiceImplementation());
    const dbUserRepository = userDBRepositoryInterface(userDBRepositoryImplementation());
    const dbOtpRepository = otpDbRepositoryInterface(otpDBRepositoryImplementation());
    const mailSenderService = mailSenderServiceInterface(mailSenderServiceImplementation());
    const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.body;
        yield (0, userAuthApplication_1.userRegister)(user, dbUserRepository, authService);
        res.status(200).json({
            status: "success",
            message: "User registered successfully",
        });
    }));
    const usernameAvailability = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        const isAvailable = yield dbUserRepository.getUserByUsername(username);
        if (!isAvailable) {
            res.json({
                available: true,
                status: "Username is available",
            });
        }
        else {
            res.json({
                available: false,
                status: "Username not available",
            });
        }
    }));
    const emailAvailability = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.params;
        const isUsed = yield dbUserRepository.getUserByEmail(email);
        if (!isUsed) {
            res.json({
                available: true,
                status: "",
            });
        }
        else {
            res.json({
                available: false,
                status: "Email id already registered, Try logging in",
            });
        }
    }));
    const forgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, text } = req.body;
        const isUsed = yield dbUserRepository.getUserByEmail(email);
        if (isUsed) {
            yield (0, userAuthApplication_1.handleSendOtp)(email, text, dbOtpRepository, mailSenderService);
            res.json({
                status: "success",
                message: "OTP sent to the given mail id",
            });
        }
        else {
            res.json({
                status: "error",
                message: "Email id not registered, Try signing up",
            });
        }
    }));
    const forgotpasswordchange = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const isAvailable = yield dbUserRepository.getUserByEmail(email);
        if (isAvailable) {
            let userId = isAvailable._id.toString();
            yield (0, userAuthApplication_1.handleForgotPasswordChange)(userId, password, authService, dbUserRepository);
            res.json({
                status: "success",
                message: "Password changed successfully",
            });
        }
        else {
            res.json({
                status: "error",
                message: "Email id not registered, Try signing up",
            });
        }
    }));
    const sendOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, text } = req.body;
        yield (0, userAuthApplication_1.handleSendOtp)(email, text, dbOtpRepository, mailSenderService);
        res.json({
            status: "success",
            message: "OTP sent",
        });
    }));
    const verifyOtpForEmailVerification = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, otp } = req.body;
        const isOtpValid = yield (0, userAuthApplication_1.handleOtpVerification)(email, otp, dbOtpRepository);
        if (isOtpValid) {
            res.json({
                status: "success",
                message: "OTP verified",
            });
        }
        else {
            res.status(400).json({
                status: "failed",
                message: "Invalid OTP",
            });
        }
    }));
    const signIn = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const { userDetails, refreshToken, accessToken } = yield (0, userAuthApplication_1.login)(email, password, dbUserRepository, authService);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            status: "success",
            message: "user verified",
            user: userDetails,
            accessToken,
        });
    }));
    const loginOrSignUpUsingGoogle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.body;
        const { userDetails, refreshToken, accessToken } = yield (0, userAuthApplication_1.handleGoogleLoginOrSignup)(user, dbUserRepository, authService);
        // console.log(
        //   "UserDetails in loginOrSignUpUsingGoogle from adapterd: ",
        //   userDetails,
        //   refreshToken,
        //   accessToken
        // );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const _a = userDetails._doc, { password } = _a, userDetailsWithoutPassword = __rest(_a, ["password"]);
        // console.log("Returning user details: ", userDetailsWithoutPassword);
        res.json({
            status: "success",
            message: "User verified",
            user: userDetailsWithoutPassword,
            accessToken,
        });
    }));
    const refreshAccessToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cookies = req.cookies;
        // console.log("Consoling cookies from the refreshaccesstoken : ", cookies);
        const accessToken = yield (0, userAuthApplication_1.accessTokenRefresh)(cookies, dbUserRepository, authService);
        res.json({ accessToken });
    }));
    const logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)) {
            res.sendStatus(204);
            return;
        }
        yield (0, userAuthApplication_1.handleLogoutUser)(userId, dbUserRepository);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "none",
        });
        res.json({
            status: "success",
            message: "Cookie Cleared",
        });
    }));
    return {
        registerUser,
        usernameAvailability,
        sendOtp,
        verifyOtpForEmailVerification,
        emailAvailability,
        signIn,
        refreshAccessToken,
        logoutUser,
        loginOrSignUpUsingGoogle,
        forgotPassword,
        forgotpasswordchange,
    };
};
exports.default = authController;
