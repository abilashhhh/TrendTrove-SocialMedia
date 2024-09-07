"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userModel_1 = __importDefault(require("./userModel"));
const messageModel_1 = __importDefault(require("./messageModel"));
const conversationSchema = new mongoose_1.Schema({
    participants: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: userModel_1.default.modelName, required: true },
    ],
    messages: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: messageModel_1.default.modelName, default: [] },
    ],
}, { timestamps: true });
const Conversation = (0, mongoose_1.model)("Conversation", conversationSchema);
exports.default = Conversation;
