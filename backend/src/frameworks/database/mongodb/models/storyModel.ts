import mongoose, { Schema, model, Document, Types } from "mongoose";

interface IReaction {
  userId: Types.ObjectId;
  type: "like" | "love" | "haha" | "sad" | "angry";
}

interface IStory extends Document {
  userId: Types.ObjectId;
  isHighlighted: boolean;
  isExpired: boolean;
  captions?: string;
  username?: string;
  dp?: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "text";
  viewers: Types.ObjectId[];
  viewCount: number;
  reactions: IReaction[];
  hiddenFrom: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const storySchema = new Schema<IStory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isHighlighted: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
    captions: { type: String },
    username: { type: String },
    dp: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video", "text"], required: true },
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    viewCount: { type: Number, default: 0 },
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["like", "love", "haha", "sad", "angry"] },
      },
    ],
    hiddenFrom: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Story = model<IStory>("Story", storySchema);

export default Story;
