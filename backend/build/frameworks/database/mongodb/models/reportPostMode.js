"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    reporterId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    reporterUsername: { type: String },
    comments: { type: String },
    reason: { type: String },
}, {
    timestamps: true,
});
const ReportPost = (0, mongoose_1.model)("ReportPost", reportSchema);
exports.default = ReportPost;
