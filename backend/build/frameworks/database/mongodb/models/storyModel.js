"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const storySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isHighlighted: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
    captions: { type: String },
    username: { type: String },
    dp: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video", "text"], required: true },
    viewers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    viewCount: { type: Number, default: 0 },
    reactions: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            type: { type: String, enum: ["like", "love", "haha", "sad", "angry"] },
        },
    ],
    hiddenFrom: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true,
});
const Story = (0, mongoose_1.model)("Story", storySchema);
exports.default = Story;
