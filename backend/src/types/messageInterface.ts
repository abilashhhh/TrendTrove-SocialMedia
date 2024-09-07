import { Types } from "mongoose";
import { UserInterface } from "./userInterface";

export interface ConversationInterface {
  participants: Types.ObjectId[] | UserInterface[];
  messages: Types.ObjectId[] | MessageInterface[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageInterface {
  senderId: Types.ObjectId | UserInterface;
  receiverId: Types.ObjectId | UserInterface;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}
