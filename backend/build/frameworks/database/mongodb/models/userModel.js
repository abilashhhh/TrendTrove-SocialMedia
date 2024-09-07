"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const followSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    username: { type: String },
    dp: { type: String },
    followedAt: { type: Date, default: Date.now },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String },
    email: { type: String, required: true },
    address: { type: String },
    phone: { type: Number },
    password: { type: String, minlength: 6 },
    dp: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    coverPhoto: {
        type: String,
        default: "http://res.cloudinary.com/ddiqmcmxy/image/upload/v1719983391/cover/pkgs68nko6bhagnzjvih.jpg",
    },
    bio: { type: String },
    gender: { type: String },
    isBlocked: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    isVerifiedAccount: { type: Boolean, default: false },
    isGoogleSignedIn: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isDarkMode: { type: Boolean, default: true },
    isLeftSidebarOpen: { type: Boolean, default: true },
    isRightSidebarOpen: { type: Boolean, default: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isSuspended: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },
    posts: [],
    requestsForMe: [followSchema],
    requestedByMe: [followSchema],
    followers: [followSchema],
    following: [followSchema],
    savedPosts: [{ type: mongoose_1.default.Types.ObjectId, ref: "Post" }],
    taggedPosts: [{ type: mongoose_1.default.Types.ObjectId, ref: "Post" }],
    notifications: [{ type: mongoose_1.default.Types.ObjectId, ref: "Message" }],
    blockedUsers: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
