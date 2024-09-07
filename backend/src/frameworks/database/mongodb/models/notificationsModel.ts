import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userId: string;
  message: string;
  image: string;
  read: boolean;
}

const notificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
    image: { type: String },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
