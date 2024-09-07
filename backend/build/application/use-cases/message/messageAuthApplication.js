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
exports.handleGenerateZegoToken = exports.handleGetFriendsInfo = exports.handleGetAllConverations = exports.handleGetMessage = exports.handleDeleteMessage = exports.handleEditMessage = exports.handleSendMessageOnly = exports.handleSendMessage = void 0;
const config_1 = __importDefault(require("../../../config"));
const ErrorInApplication_1 = __importDefault(require("../../../utils/ErrorInApplication"));
const zegoTokenGenerator_1 = require("../../../utils/zegoTokenGenerator");
const handleSendMessage = (senderId, receiverId, message, mediaUrl, fileType, dbMessageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sendMessage = yield dbMessageRepository.sendMessage(senderId, receiverId, message, mediaUrl, fileType);
        // console.log("sendMessage from msg auth app:" ,sendMessage)
        return sendMessage;
    }
    catch (error) {
        console.error("Error in handleSendMessage:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to send the message", 500);
    }
});
exports.handleSendMessage = handleSendMessage;
const handleSendMessageOnly = (senderId, receiverId, message, dbMessageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sendMessage = yield dbMessageRepository.sendMessageOnly(senderId, receiverId, message);
        // console.log("sendMessage from msg auth app:" ,sendMessage)
        return sendMessage;
    }
    catch (error) {
        console.error("Error in handleSendMessage:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to send the message", 500);
    }
});
exports.handleSendMessageOnly = handleSendMessageOnly;
const handleEditMessage = (senderId, 
// receiverId: string,
messageId, message, dbMessageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editMessage = yield dbMessageRepository.editMessage(senderId, 
        // receiverId,
        messageId, message);
        console.log("editMessage from msg auth app:", editMessage);
        return editMessage;
    }
    catch (error) {
        console.error("Error in handleEditMessage:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to edit the message", 500);
    }
});
exports.handleEditMessage = handleEditMessage;
const handleDeleteMessage = (senderId, messageId, dbMessageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteMessage = yield dbMessageRepository.deleteMessage(senderId, messageId);
        console.log("deleteMessage from msg auth app:", deleteMessage);
        return deleteMessage;
    }
    catch (error) {
        console.error("Error in handleDeleteMessage:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to delete the message", 500);
    }
});
exports.handleDeleteMessage = handleDeleteMessage;
const handleGetMessage = (senderId, receiverId, dbMessageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getMessage = yield dbMessageRepository.getMessages(senderId, receiverId);
        return getMessage;
    }
    catch (error) {
        console.error("Error in handleGetMessage:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get the messages", 500);
    }
});
exports.handleGetMessage = handleGetMessage;
const handleGetAllConverations = (senderId, dbMessageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getMessage = yield dbMessageRepository.getAllConversations(senderId);
        return getMessage;
    }
    catch (error) {
        console.error("Error in handleGetAllConverations:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get the conversations", 500);
    }
});
exports.handleGetAllConverations = handleGetAllConverations;
const handleGetFriendsInfo = (userId, dbMessageRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getMessage = yield dbMessageRepository.getFriendsInfo(userId);
        return getMessage;
    }
    catch (error) {
        console.error("Error in handleGetFriendsInfo:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to get the friends info", 500);
    }
});
exports.handleGetFriendsInfo = handleGetFriendsInfo;
const handleGenerateZegoToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appId = config_1.default.ZEGO_CLOUD_APP_ID;
        const serverSecret = config_1.default.ZEGO_CLOUD_SERVER_SECRET;
        const effectiveTime = 3600;
        const payload = "";
        if (appId && serverSecret && userId) {
            const token = (0, zegoTokenGenerator_1.generateToken04)(appId, userId, serverSecret, effectiveTime, payload);
            return token;
        }
    }
    catch (error) {
        console.error("Error in handleGenerateZegoToken:", error);
        if (error instanceof ErrorInApplication_1.default) {
            throw error;
        }
        throw new ErrorInApplication_1.default("Failed to handleGenerateZegoToken", 500);
    }
});
exports.handleGenerateZegoToken = handleGenerateZegoToken;
