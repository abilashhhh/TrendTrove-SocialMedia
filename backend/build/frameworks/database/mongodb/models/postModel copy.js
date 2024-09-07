"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isArchived: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    captions: { type: String },
    username: { type: String },
    dp: { type: String },
    location: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    hashtags: [{ type: String }],
    mentions: [{ type: String }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    shares: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }],
}, {
    timestamps: true,
});
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
