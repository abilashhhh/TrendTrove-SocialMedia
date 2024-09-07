import mongoose, { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = model("Like", likeSchema);

export default Like;
