import mongoose, { Schema, model } from "mongoose";

const dislikeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  }
);

dislikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Dislike = model("Dislike", dislikeSchema);

export default Dislike;
