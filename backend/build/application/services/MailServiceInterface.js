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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSenderServiceInterface = void 0;
const mailSenderServiceInterface = (service) => {
    const sendVerificationEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () { return service.sendVerificationEmail(email, otp); });
    const sendForgotPasswordEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () { return service.sendForgotPasswordEmail(email, otp); });
    return {
        sendVerificationEmail,
        sendForgotPasswordEmail,
    };
};
exports.mailSenderServiceInterface = mailSenderServiceInterface;
