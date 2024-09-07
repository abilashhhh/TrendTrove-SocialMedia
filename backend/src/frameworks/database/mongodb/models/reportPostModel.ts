import mongoose, { Schema, model } from "mongoose";

const reportSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reporterUsername: { type: String },
    comments: { type: String },
    reason: { type: String },
  },
  {
    timestamps: true,
  }
);

const ReportPost = model("ReportPost", reportSchema);
export default ReportPost;
