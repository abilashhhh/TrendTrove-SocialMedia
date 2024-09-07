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
exports.messageRepositoryMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorInApplication_1 = __importDefault(require("../../../../utils/ErrorInApplication"));
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const socket_1 = require("../../../websocket/socket");
const app_1 = require("../../../../app");
const messageRepositoryMongoDB = () => {
    const sendMessage = (senderId, receiverId, message, mediaUrl, fileType) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let conversation = yield conversationModel_1.default.findOne({
                participants: { $all: [senderId, receiverId] },
            });
            if (!conversation) {
                conversation = new conversationModel_1.default({
                    participants: [senderId, receiverId],
                });
            }
            const newMessage = new messageModel_1.default({
                senderId,
                receiverId,
                message,
                mediaUrl,
                fileType,
            });
            conversation.messages.push(newMessage._id);
            yield Promise.all([conversation.save(), newMessage.save()]);
            const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
            if (receiverSocketId) {
                app_1.io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            // console.log("newMessage", newMessage);
            return newMessage;
        }
        catch (error) {
            console.error("Error in sendMessage:", error.message);
            throw new ErrorInApplication_1.default("Error in sending message!", error);
        }
    });
    const sendMessageOnly = (senderId, receiverId, message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let conversation = yield conversationModel_1.default.findOne({
                participants: { $all: [senderId, receiverId] },
            });
            if (!conversation) {
                conversation = new conversationModel_1.default({
                    participants: [senderId, receiverId],
                });
            }
            const newMessage = new messageModel_1.default({
                senderId,
                receiverId,
                message,
            });
            conversation.messages.push(newMessage._id);
            yield Promise.all([conversation.save(), newMessage.save()]);
            const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
            if (receiverSocketId) {
                app_1.io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            // console.log("newMessage", newMessage);
            return newMessage;
        }
        catch (error) {
            console.error("Error in sendMessage:", error.message);
            throw new ErrorInApplication_1.default("Error in sending message!", error);
        }
    });
    const editMessage = (senderId, messageId, newContent) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = yield messageModel_1.default.findById(messageId);
            if (!message) {
                throw new Error("Message not found");
            }
            if (message.senderId.toString() !== senderId) {
                throw new Error("Unauthorized to edit this message");
            }
            message.message = newContent;
            yield message.save();
            const receiverSocketId = (0, socket_1.getReceiverSocketId)(message === null || message === void 0 ? void 0 : message.receiverId);
            if (receiverSocketId) {
                app_1.io.to(receiverSocketId).emit("updateMessage", message);
            }
            console.log("Updated Message", message);
            return message;
        }
        catch (error) {
            console.error("Error in editMessage:", error.message);
            throw new ErrorInApplication_1.default("Error in editing message!", error);
        }
    });
    const deleteMessage = (senderId, messageId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = yield messageModel_1.default.findById(messageId);
            if (!message) {
                throw new Error("Message not found");
            }
            if (message.senderId.toString() !== senderId) {
                throw new Error("Unauthorized to delete this message");
            }
            message.message = null;
            message.fileType = null;
            message.mediaUrl = null;
            yield message.save();
            const receiverSocketId = (0, socket_1.getReceiverSocketId)(message.receiverId);
            if (receiverSocketId) {
                app_1.io.to(receiverSocketId).emit("deleteMessage", message);
            }
            console.log("Updated Message", message);
            return message;
        }
        catch (error) {
            console.error("Error in deleteMessage:", error.message);
            throw new ErrorInApplication_1.default("Error in deleting message!", error);
        }
    });
    const getMessages = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversation = yield conversationModel_1.default.findOne({
                participants: { $all: [senderId, receiverId] },
            }).populate("messages");
            if (!conversation) {
                return [];
            }
            // console.log(conversation.messages);
            return conversation.messages;
        }
        catch (error) {
            console.error("Error in getMessages:", error.message);
            throw new ErrorInApplication_1.default("Error in getting messages!", error);
        }
    });
    const getAllConversations = (senderId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversations = yield conversationModel_1.default.find({
                participants: senderId,
            }).populate("messages");
            if (!conversations || conversations.length === 0) {
                return [];
            }
            // console.log("getAllConversations: ", conversations);
            return conversations;
        }
        catch (error) {
            console.error("Error in getAllConversations:", error.message);
            throw new Error(error);
        }
    });
    const getFriendsInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.aggregate([
                { $match: { _id: new mongoose_1.default.Types.ObjectId(userId) } },
                {
                    $project: {
                        following: 1,
                        followers: 1,
                    },
                },
                {
                    $addFields: {
                        mutualFriends: {
                            $setIntersection: ["$following.userId", "$followers.userId"],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "mutualFriends",
                        foreignField: "_id",
                        as: "mutualFriendsInfo",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        mutualFriends: "$mutualFriendsInfo",
                    },
                },
            ]);
            if (!user.length) {
                throw new Error("User not found");
            }
            return user[0].mutualFriends;
        }
        catch (error) {
            console.error("Error in getFriendsInfo:", error.message);
            throw new ErrorInApplication_1.default("Error in getting friends info!", error);
        }
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
exports.messageRepositoryMongoDB = messageRepositoryMongoDB;
