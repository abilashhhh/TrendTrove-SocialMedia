"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dislikeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
}, {
    timestamps: true,
});
dislikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
const Dislike = (0, mongoose_1.model)("Dislike", dislikeSchema);
exports.default = Dislike;
