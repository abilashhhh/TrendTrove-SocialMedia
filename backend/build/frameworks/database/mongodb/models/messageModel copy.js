"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userModel_1 = __importDefault(require("./userModel"));
const messageSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: userModel_1.default, required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: userModel_1.default, required: true },
    message: { type: String },
    fileType: {
        type: String,
        enum: ["image", "video", "audio"],
    },
    mediaUrl: { type: String },
}, {
    timestamps: true,
});
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.default = Message;
