"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const storyModel_1 = __importDefault(require("./storyModel"));
const userModel_1 = __importDefault(require("./userModel"));
const highlightsSchema = new mongoose_1.Schema({
    highlightName: { type: String, required: true },
    coverImage: { type: String, required: true },
    selectedStories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: storyModel_1.default, required: true }],
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: userModel_1.default, required: true },
}, {
    timestamps: true,
});
const Highlights = (0, mongoose_1.model)("Highlights", highlightsSchema);
exports.default = Highlights;
