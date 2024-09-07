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
exports.mailSenderService = void 0;
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const mailSenderService = () => {
    const sendVerificationEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mailResponse = yield (0, sendEmail_1.default)(email, "TRENDTROVE - Email Verification", `
                <h1>Welcome to TRENDTROVE</h1>
                <p>Thank you for signing up! Please use the OTP below to verify your email:</p>
                <p>OTP: ${otp}</p>
                <img src="https://drive.google.com/file/d/1xzC1olo3SsdPElRIeeCoQRYrqCRFAhLE/view?usp=sharing" alt="TRENDTROVE Logo" style="width: 100px; height: auto;">
                `);
            // console.log("Verification email sent successfully: ", mailResponse);
            console.log("Verification email sent successfully: ");
        }
        catch (err) {
            console.log("Error in sending verification email: ", err);
            throw err;
        }
    });
    const sendForgotPasswordEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mailResponse = yield (0, sendEmail_1.default)(email, "TRENDTROVE - Forgot Password", `
                <h1>Password Reset Request</h1>
                <p>We received a request to reset your password. Please use the OTP below to reset your password:</p>
                <p>OTP: ${otp}</p>
                <img src="https://drive.google.com/file/d/1xzC1olo3SsdPElRIeeCoQRYrqCRFAhLE/view?usp=sharing" alt="TRENDTROVE Logo" style="width: 100px; height: auto;">
                `);
            // console.log("Forgot Password Email sent successfully: ", mailResponse);
            console.log("Forgot Password Email sent successfully: ");
        }
        catch (err) {
            console.log("Error in sending verification email: ", err);
            throw err;
        }
    });
    return {
        sendVerificationEmail,
        sendForgotPasswordEmail,
    };
};
exports.mailSenderService = mailSenderService;
