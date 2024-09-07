import mongoose from "mongoose";
import ErrorInApplication from "../../../../utils/ErrorInApplication";
import Conversation from "../models/conversationModel";
import Message from "../models/messageModel";
import User from "../models/userModel";
import { getReceiverSocketId } from "../../../websocket/socket";
import { io } from "../../../../app";

export const messageRepositoryMongoDB = () => {
  const sendMessage = async (
    senderId: string,
    receiverId: string,
    message: string,
    mediaUrl: string,
    fileType: string
  ) => {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        mediaUrl,
        fileType,
      });

      conversation.messages.push(newMessage._id);

      await Promise.all([conversation.save(), newMessage.save()]);
      
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      // console.log("newMessage", newMessage);

      return newMessage;
    } catch (error: any) {
      console.error("Error in sendMessage:", error.message);
      throw new ErrorInApplication("Error in sending message!", error);
    }
  };

  const sendMessageOnly = async (
    senderId: string,
    receiverId: string,
    message: string
  ) => {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });

      conversation.messages.push(newMessage._id);

      await Promise.all([conversation.save(), newMessage.save()]);

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      // console.log("newMessage", newMessage);

      return newMessage;
    } catch (error: any) {
      console.error("Error in sendMessage:", error.message);
      throw new ErrorInApplication("Error in sending message!", error);
    }
  };

  const editMessage = async (
    senderId: string,
    messageId: string,
    newContent: string
  ) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error("Message not found");
      }

      if (message.senderId.toString() !== senderId) {
        throw new Error("Unauthorized to edit this message");
      }

      message.message = newContent;
      await message.save();

      const receiverSocketId = getReceiverSocketId(message?.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("updateMessage", message);
      }

      console.log("Updated Message", message);

      return message;
    } catch (error: any) {
      console.error("Error in editMessage:", error.message);
      throw new ErrorInApplication("Error in editing message!", error);
    }
  };

  const deleteMessage = async (senderId: string, messageId: string) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error("Message not found");
      }

      if (message.senderId.toString() !== senderId) {
        throw new Error("Unauthorized to delete this message");
      }

      message.message = null;
      message.fileType = null;
      message.mediaUrl = null;
      await message.save();

      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("deleteMessage", message);
      }

      console.log("Updated Message", message);

      return message;
    } catch (error: any) {
      console.error("Error in deleteMessage:", error.message);
      throw new ErrorInApplication("Error in deleting message!", error);
    }
  };

  const getMessages = async (senderId: string, receiverId: string) => {
    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate("messages");

      if (!conversation) {
        return [];
      }

      // console.log(conversation.messages);

      return conversation.messages;
    } catch (error: any) {
      console.error("Error in getMessages:", error.message);
      throw new ErrorInApplication("Error in getting messages!", error);
    }
  };

  const getAllConversations = async (senderId: string) => {
    try {
      const conversations = await Conversation.find({
        participants: senderId,
      }).populate("messages");

      if (!conversations || conversations.length === 0) {
        return [];
      }

      // console.log("getAllConversations: ", conversations);
      return conversations;
    } catch (error: any) {
      console.error("Error in getAllConversations:", error.message);
      throw new Error(error);
    }
  };

  const getFriendsInfo = async (userId: string) => {
    try {
      const user = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        {
          $project: {
            following: 1,
            followers: 1,
          },
        },
        {
          $addFields: {
            mutualFriends: {
              $setIntersection: ["$following.userId", "$followers.userId"],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "mutualFriends",
            foreignField: "_id",
            as: "mutualFriendsInfo",
          },
        },
        {
          $project: {
            _id: 0,
            mutualFriends: "$mutualFriendsInfo",
          },
        },
      ]);

      if (!user.length) {
        throw new Error("User not found");
      }
      return user[0].mutualFriends;
    } catch (error: any) {
      console.error("Error in getFriendsInfo:", error.message);
      throw new ErrorInApplication("Error in getting friends info!", error);
    }
  };

  return {
    sendMessage,
    sendMessageOnly,
    getMessages,
    getAllConversations,
    getFriendsInfo,
    editMessage,
    deleteMessage,
  };
};

export type MessagesRepositoryMongoDB = typeof messageRepositoryMongoDB;
