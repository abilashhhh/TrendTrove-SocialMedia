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
exports.messageDBRepository = void 0;
const messageDBRepository = (repository) => {
    const sendMessage = (senderId, receiverId, message, mediaUrl, fileType) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.sendMessage(senderId, receiverId, message, mediaUrl, fileType);
    });
    const sendMessageOnly = (senderId, receiverId, message) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.sendMessageOnly(senderId, receiverId, message);
    });
    const editMessage = (senderId, messageId, message) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.editMessage(senderId, messageId, message); });
    const deleteMessage = (senderId, messageId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteMessage(senderId, messageId); });
    const getMessages = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getMessages(senderId, receiverId);
    });
    const getAllConversations = (senderId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getAllConversations(senderId);
    });
    const getFriendsInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.getFriendsInfo(userId);
    });
    return {
        sendMessage,
        sendMessageOnly,
        getMessages,
        getAllConversations,
        getFriendsInfo,
        editMessage,
        deleteMessage,
    };
};
exports.messageDBRepository = messageDBRepository;
