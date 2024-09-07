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
const messageAuthApplication_1 = require("../../application/use-cases/message/messageAuthApplication");
const messageController = (userDBRepositoryImplementation, userDBRepositoryInterface, postDBRepositoryImplementation, postDBRepositoryInterface, authServiceImplementation, authenticationServiceInterface, messageDBRepositoryImplementation, messageDBRepositoryInterface) => {
    const dbUserRepository = userDBRepositoryInterface(userDBRepositoryImplementation());
    const dbPostRepository = postDBRepositoryInterface(postDBRepositoryImplementation());
    const authService = authenticationServiceInterface(authServiceImplementation());
    const dbMessageRepository = messageDBRepositoryInterface(messageDBRepositoryImplementation());
    const sendMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const message = req.body.message;
        const mediaUrl = req.body.mediaUrl;
        const fileType = req.body.fileType;
        const { receiverId } = req.params;
        const senderId = req.body.userId;
        const sendMessageResult = yield (0, messageAuthApplication_1.handleSendMessage)(senderId, receiverId, message, mediaUrl, fileType, dbMessageRepository);
        // console.log("sendMessagesResult:",sendMessageResult)
        res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: sendMessageResult,
        });
    }));
    const sendMessageOnly = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const message = req.body.message;
        const { receiverId } = req.params;
        const senderId = req.body.userId;
        const sendMessageResult = yield (0, messageAuthApplication_1.handleSendMessageOnly)(senderId, receiverId, message, dbMessageRepository);
        // console.log("sendMessagesResult:",sendMessageResult)
        res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: sendMessageResult,
        });
    }));
    const editMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const message = req.body.editedMessage;
        // const receiverId = req.body.receiverId;
        const { messageId } = req.params;
        const senderId = req.body.userId;
        console.log("message:", message);
        console.log("messageId:", messageId);
        console.log("senderId:", senderId);
        const editMessageResult = yield (0, messageAuthApplication_1.handleEditMessage)(senderId, 
        // receiverId,
        messageId, message, dbMessageRepository);
        console.log("editMessagesResult:", editMessageResult);
        res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: editMessageResult,
        });
    }));
    const deleteMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { messageId } = req.params;
        const senderId = req.body.userId;
        const deleteMessageResult = yield (0, messageAuthApplication_1.handleDeleteMessage)(senderId, messageId, dbMessageRepository);
        console.log("editMessagesResult:", deleteMessageResult);
        res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: deleteMessageResult,
        });
    }));
    const getMessages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { receiverId } = req.params;
        const senderId = req.body.userId;
        const getMessageResult = yield (0, messageAuthApplication_1.handleGetMessage)(senderId, receiverId, dbMessageRepository);
        res.status(200).json({
            status: "success", message: "Got messages  successfully",
            data: getMessageResult,
        });
    }));
    const getAllConverations = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const senderId = req.body.userId;
        const getAllConverationsResult = yield (0, messageAuthApplication_1.handleGetAllConverations)(senderId, dbMessageRepository);
        res.status(200).json({
            status: "success", message: "Got all converations successfully",
            data: getAllConverationsResult,
        });
    }));
    const getFriendsInfo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const getMessageResult = yield (0, messageAuthApplication_1.handleGetFriendsInfo)(userId, dbMessageRepository);
        res.status(200).json({
            status: "success", message: "Got friends info successfully",
            data: getMessageResult,
        });
    }));
    const generateZegoToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        const generateZegoTokenResult = yield (0, messageAuthApplication_1.handleGenerateZegoToken)(userId);
        res.status(200).json({ generateZegoTokenResult });
    }));
    return {
        sendMessage,
        sendMessageOnly,
        getMessages,
        getAllConverations,
        getFriendsInfo,
        editMessage,
        deleteMessage,
        generateZegoToken
    };
};
exports.default = messageController;
