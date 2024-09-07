import { Document, Schema, model } from "mongoose";
interface CommentInterface extends Document {
  postId: string;
  userId: string;
  username: string;
  comment: string;
  dp: string;
  replies: ReplyCommentInterface[];
  report: string[];
  likes: string[];
  isBlock: boolean;
}

interface ReplyCommentInterface extends Document {
  postId: string;
  userId: string;
  username: string;
  reply: string;
  dp: string;
  report: string[];
  likes: string[];
  isBlock: boolean;
}

const replyCommentSchema = new Schema<ReplyCommentInterface>(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reply: { type: String, required: true },
    dp: { type: String, required: true },
    report: [{ type: String }],
    likes: [{ type: String }],
    isBlock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const commentSchema = new Schema<CommentInterface>(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    dp: { type: String, required: true },
    replies: [replyCommentSchema],
    report: [{ type: String }],
    likes: [{ type: String }],
    isBlock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Comment = model<CommentInterface>("Comment", commentSchema);
export default Comment;
