import mongoose, { Schema, model } from "mongoose";
import Story from "./storyModel";
import User from "./userModel";

const highlightsSchema = new Schema(
  {
    highlightName: { type: String, required: true },
    coverImage: { type: String, required: true },
    selectedStories: [{ type: Schema.Types.ObjectId, ref: Story, required: true }],
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
  },
  {
    timestamps: true,
  }
);

const Highlights = model("Highlights", highlightsSchema);

export default Highlights;

