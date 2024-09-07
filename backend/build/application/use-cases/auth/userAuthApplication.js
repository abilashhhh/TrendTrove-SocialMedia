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
exports.userLoginUsingGoogle = exports.userRegisterUsingGoogle = exports.handleGoogleLoginOrSignup = exports.handleLogoutUser = exports.tokenVerification = exports.accessTokenRefresh = exports.login = exports.handleResendOtp = exports.handleOtpVerification = exports.handleForgotPasswordChange = exports.handleSendOtp = exports.userRegister = void 0;
const ErrorInApplication_1 = __importDefault(require("../../../utils/ErrorInApplication"));
const otpGenerator = require("otp-generator");
const userRegister = (user, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEmail = yield dbUserRepository.getUserByEmail(user.email);
    if (existingEmail) {
        throw new ErrorInApplication_1.default("Email already exists", 401);
    }
    const existingUsername = yield dbUserRepository.getUserByUsername(user.username);
    if (existingUsername) {
        throw new ErrorInApplication_1.default("Username already exists!", 401);
    }
    user.password = yield authService.encryptPassword(user.password);
    user.dp = `https://api.dicebear.com/8.x/thumbs/svg?seed=${user.username}`;
    yield dbUserRepository.addUser(user);
});
exports.userRegister = userRegister;
// Handle OTP Sending
const handleSendOtp = (email, text, dbOtpRepository, mailSenderService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        yield dbOtpRepository.saveNewOtp({ email, otp });
        if (text === "email-verification") {
            yield mailSenderService.sendVerificationEmail(email, Number(otp));
        }
        else if (text === "forgot-password") {
            yield mailSenderService.sendForgotPasswordEmail(email, Number(otp));
        }
    }
    catch (error) {
        throw new ErrorInApplication_1.default("Error in handleSendOtp", 401);
    }
});
exports.handleSendOtp = handleSendOtp;
// Handle Forgot Password Change
const handleForgotPasswordChange = (userId, newPassword, authService, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encryptedNewPassword = yield authService.encryptPassword(newPassword);
        const user = yield dbUserRepository.updatePassword(userId, encryptedNewPassword);
        return user;
    }
    catch (err) {
        throw new ErrorInApplication_1.default("Failed to change password", 401);
    }
});
exports.handleForgotPasswordChange = handleForgotPasswordChange;
// Handle OTP Verification
const handleOtpVerification = (email, otp, dbOtpRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestOtp = yield dbOtpRepository.getLatestOtp(email);
        if (!latestOtp || latestOtp.otp !== otp) {
            return false;
        }
        return true; // OTP verification successful
    }
    catch (error) {
        throw new ErrorInApplication_1.default("Error in handleOtpVerification", 401);
    }
});
exports.handleOtpVerification = handleOtpVerification;
// Handle Resending OTP
const handleResendOtp = (email, text, dbOtpRepository, mailSenderService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        yield dbOtpRepository.saveNewOtp({ email, otp });
        if (text === "email-verification") {
            yield mailSenderService.sendVerificationEmail(email, Number(otp));
        }
        else if (text === "forgot-password") {
            yield mailSenderService.sendForgotPasswordEmail(email, Number(otp));
        }
    }
    catch (error) {
        throw new ErrorInApplication_1.default("Error in handleResendOtp", 401);
    }
});
exports.handleResendOtp = handleResendOtp;
// User Login
const login = (email, password, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield dbUserRepository.getUserByEmail(email);
    if (!user) {
        throw new ErrorInApplication_1.default("Invalid email or password!", 401);
    }
    if (user.isBlocked) {
        throw new ErrorInApplication_1.default("Your account has been blocked!", 401);
    }
    const isPasswordCorrect = yield authService.comparePassword(password, ((_a = user === null || user === void 0 ? void 0 : user.password) === null || _a === void 0 ? void 0 : _a.toString()) || "");
    if (!isPasswordCorrect) {
        throw new ErrorInApplication_1.default("Invalid email or password!", 401);
    }
    const userDetails = {
        _id: user === null || user === void 0 ? void 0 : user._id.toString(),
        name: user === null || user === void 0 ? void 0 : user.name,
        username: user === null || user === void 0 ? void 0 : user.username,
        email: user === null || user === void 0 ? void 0 : user.email,
        phone: user === null || user === void 0 ? void 0 : user.phone,
        address: user === null || user === void 0 ? void 0 : user.address,
        password: user === null || user === void 0 ? void 0 : user.password,
        dp: user === null || user === void 0 ? void 0 : user.dp,
        coverPhoto: user === null || user === void 0 ? void 0 : user.coverPhoto,
        bio: user === null || user === void 0 ? void 0 : user.bio,
        gender: user === null || user === void 0 ? void 0 : user.gender,
        isBlocked: user === null || user === void 0 ? void 0 : user.isBlocked,
        isPrivate: user === null || user === void 0 ? void 0 : user.isPrivate,
        isVerifiedAccount: user === null || user === void 0 ? void 0 : user.isVerifiedAccount,
        isGoogleSignedIn: user === null || user === void 0 ? void 0 : user.isGoogleSignedIn,
        isPremium: user === null || user === void 0 ? void 0 : user.isPremium,
        isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
        isSuspended: user === null || user === void 0 ? void 0 : user.isSuspended,
        posts: user === null || user === void 0 ? void 0 : user.posts,
        requestsForMe: user === null || user === void 0 ? void 0 : user.requestsForMe,
        requestedByMe: user === null || user === void 0 ? void 0 : user.requestedByMe,
        followers: user === null || user === void 0 ? void 0 : user.followers,
        following: user === null || user === void 0 ? void 0 : user.following,
        savedPosts: user === null || user === void 0 ? void 0 : user.savedPosts,
        taggedPosts: user === null || user === void 0 ? void 0 : user.taggedPosts,
        notifications: user === null || user === void 0 ? void 0 : user.notifications,
        blockedUsers: user === null || user === void 0 ? void 0 : user.blockedUsers,
        createdAt: user === null || user === void 0 ? void 0 : user.createdAt,
        updatedAt: user === null || user === void 0 ? void 0 : user.updatedAt,
    };
    const role = user.isAdmin ? "admin" : "user";
    const refreshToken = authService.generateRefreshToken({
        userId: user._id.toString(),
        role,
    });
    const accessToken = authService.generateAccessToken({
        userId: user._id.toString(),
        role,
    });
    yield dbUserRepository.addRefreshTokenAndExpiry(email, refreshToken);
    return { userDetails, refreshToken, accessToken };
});
exports.login = login;
// Access Token Refresh
const accessTokenRefresh = (cookies, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)) {
        throw new ErrorInApplication_1.default("Invalid token 1", 401);
    }
    const refreshToken = cookies.refreshToken;
    const { userId, role } = authService.verifyRefreshToken(refreshToken.toString());
    if (!userId || role !== "user") {
        throw new ErrorInApplication_1.default("Invalid token 2", 401);
    }
    const user = yield dbUserRepository.getUserById(userId);
    // console.log("user: ", user);
    // console.log("user?.refreshToken: ", user?.refreshToken);
    // console.log("user?.refreshTokenExpiresAt: ", user?.refreshTokenExpiresAt);
    if (!(user === null || user === void 0 ? void 0 : user.refreshToken) || !(user === null || user === void 0 ? void 0 : user.refreshTokenExpiresAt)) {
        throw new ErrorInApplication_1.default("Invalid token 3", 401);
    }
    if (user) {
        const expiresAt = (_b = user.refreshTokenExpiresAt) === null || _b === void 0 ? void 0 : _b.getTime();
        if (Date.now() > expiresAt) {
            throw new ErrorInApplication_1.default("Invalid token 4", 401);
        }
    }
    const newAccessToken = authService.generateAccessToken({
        userId,
        role: "user",
    });
    return newAccessToken;
});
exports.accessTokenRefresh = accessTokenRefresh;
// Token Verification
const tokenVerification = (token, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = authService.verifyAccessToken(token);
    if (!decodedToken) {
        throw new ErrorInApplication_1.default("Invalid token 5", 401);
    }
    else {
        return decodedToken;
    }
});
exports.tokenVerification = tokenVerification;
const handleLogoutUser = (userId, dbUserRepository) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbUserRepository.logoutUser(userId);
});
exports.handleLogoutUser = handleLogoutUser;
//GOOGLE
const handleGoogleLoginOrSignup = (user, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    let userDetails;
    let refreshToken;
    let accessToken;
    const existingUser = yield dbUserRepository.getUserByEmail(user.email);
    if (existingUser) {
        const result = yield (0, exports.userLoginUsingGoogle)(user, dbUserRepository, authService);
        userDetails = Object.assign(Object.assign({}, result.userDetails), { password: undefined });
        refreshToken = result.refreshToken;
        accessToken = result.accessToken;
    }
    else {
        const result = yield (0, exports.userRegisterUsingGoogle)(user, dbUserRepository, authService);
        userDetails = Object.assign(Object.assign({}, result.userDetails), { password: undefined });
        refreshToken = result.refreshToken;
        accessToken = result.accessToken;
    }
    return {
        userDetails,
        refreshToken,
        accessToken,
    };
});
exports.handleGoogleLoginOrSignup = handleGoogleLoginOrSignup;
// User Registration Using Google
const userRegisterUsingGoogle = (user, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = user.name.toLocaleLowerCase().replace(/\s/g, "") +
            Math.floor(Math.random() * 100);
        const generatedPassword = Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
        const newPassword = yield authService.encryptPassword(generatedPassword);
        const userData = {
            name: user.name,
            email: user.email,
            username,
            password: newPassword,
            dp: user.dp,
            isGoogleSignedIn: true,
        };
        const savedUser = yield dbUserRepository.addUser(userData);
        const role = "user";
        const refreshToken = authService.generateRefreshToken({
            userId: savedUser._id.toString(),
            role,
        });
        const accessToken = authService.generateAccessToken({
            userId: savedUser._id.toString(),
            role,
        });
        yield dbUserRepository.addRefreshTokenAndExpiry(userData === null || userData === void 0 ? void 0 : userData.email, refreshToken);
        return {
            userDetails: savedUser,
            refreshToken,
            accessToken,
        };
    }
    catch (error) {
        throw new ErrorInApplication_1.default("Failed to register user with Google", 500);
    }
});
exports.userRegisterUsingGoogle = userRegisterUsingGoogle;
// User Login Using Google
const userLoginUsingGoogle = (user, dbUserRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield dbUserRepository.getUserByEmail(user.email);
        if (!existingUser) {
            throw new ErrorInApplication_1.default("User not found", 404);
        }
        if (existingUser.isBlocked) {
            throw new ErrorInApplication_1.default("Your account has been blocked", 404);
        }
        const role = existingUser.isAdmin ? "admin" : "user";
        const refreshToken = authService.generateRefreshToken({
            userId: existingUser._id.toString(),
            role,
        });
        const accessToken = authService.generateAccessToken({
            userId: existingUser._id.toString(),
            role,
        });
        yield dbUserRepository.addRefreshTokenAndExpiry(user === null || user === void 0 ? void 0 : user.email, refreshToken);
        return {
            userDetails: existingUser,
            refreshToken,
            accessToken,
        };
    }
    catch (error) {
        throw new ErrorInApplication_1.default("Failed to log in user with Google", 500);
    }
});
exports.userLoginUsingGoogle = userLoginUsingGoogle;
