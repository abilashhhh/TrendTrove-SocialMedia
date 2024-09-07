"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const replyCommentSchema = new mongoose_1.Schema({
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reply: { type: String, required: true },
    dp: { type: String, required: true },
    report: [{ type: String }],
    likes: [{ type: String }],
    isBlock: { type: Boolean, default: false },
}, { timestamps: true });
const commentSchema = new mongoose_1.Schema({
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    dp: { type: String, required: true },
    replies: [replyCommentSchema],
    report: [{ type: String }],
    likes: [{ type: String }],
    isBlock: { type: Boolean, default: false },
}, { timestamps: true });
const Comment = (0, mongoose_1.model)("Comment", commentSchema);
exports.default = Comment;
