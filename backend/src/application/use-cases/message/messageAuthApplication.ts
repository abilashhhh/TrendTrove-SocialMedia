import configurationKeys from "../../../config";
import ErrorInApplication from "../../../utils/ErrorInApplication";
import { generateToken04 } from "../../../utils/zegoTokenGenerator";
import { MessageDBInterface } from "../../repositories/MessageDBRepository";

export const handleSendMessage = async (
  senderId: string,
  receiverId: string,
  message: string,
  mediaUrl: string,
  fileType: string,
  dbMessageRepository: ReturnType<MessageDBInterface>
) => {
  try {
    const sendMessage = await dbMessageRepository.sendMessage(
      senderId,
      receiverId,
      message,
      mediaUrl,
      fileType,
    );
// console.log("sendMessage from msg auth app:" ,sendMessage)

    return sendMessage;
  } catch (error) {
    console.error("Error in handleSendMessage:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to send the message", 500);
  }
};

export const handleSendMessageOnly = async (
  senderId: string,
  receiverId: string,
  message: string,
  dbMessageRepository: ReturnType<MessageDBInterface>
) => {
  try {
    const sendMessage = await dbMessageRepository.sendMessageOnly(
      senderId,
      receiverId,
      message,
    );
// console.log("sendMessage from msg auth app:" ,sendMessage)

    return sendMessage;
  } catch (error) {
    console.error("Error in handleSendMessage:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to send the message", 500);
  }
};

export const handleEditMessage = async (
  senderId: string,
  // receiverId: string,
  messageId: string,
  message: string,
  dbMessageRepository: ReturnType<MessageDBInterface>
) => {
  try {
    const editMessage = await dbMessageRepository.editMessage(
      senderId,
      // receiverId,
      messageId,
      message
    );
console.log("editMessage from msg auth app:" ,editMessage)

    return editMessage;
  } catch (error) {
    console.error("Error in handleEditMessage:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to edit the message", 500);
  }
};

export const handleDeleteMessage = async (
  senderId: string,
  messageId: string,
  dbMessageRepository: ReturnType<MessageDBInterface>
) => {
  try {
    const deleteMessage = await dbMessageRepository.deleteMessage(
      senderId,
      messageId,
    );
console.log("deleteMessage from msg auth app:" ,deleteMessage)

    return deleteMessage;
  } catch (error) {
    console.error("Error in handleDeleteMessage:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to delete the message", 500);
  }
};

export const handleGetMessage = async (
  senderId: string,
  receiverId: string,
  dbMessageRepository: ReturnType<MessageDBInterface>
) => {
  try {
    const getMessage = await dbMessageRepository.getMessages(
      senderId,
      receiverId
    );
    return getMessage;
  } catch (error) {
    console.error("Error in handleGetMessage:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to get the messages", 500);
  }
};


export const handleGetAllConverations = async (
  senderId: string,
  dbMessageRepository: ReturnType<MessageDBInterface>
) => {
  try {
    const getMessage = await dbMessageRepository.getAllConversations(
      senderId,
    );
    return getMessage;
  } catch (error) {
    console.error("Error in handleGetAllConverations:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to get the conversations", 500);
  }
};



export const handleGetFriendsInfo = async (
  userId: string,
  dbMessageRepository: ReturnType<MessageDBInterface>
) => {
  try {
    const getMessage = await dbMessageRepository.getFriendsInfo(
      userId
    );
    return getMessage;
  } catch (error) {
    console.error("Error in handleGetFriendsInfo:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to get the friends info", 500);
  }
};


export const handleGenerateZegoToken = async (userId: string) => {
  try {
    const appId = configurationKeys.ZEGO_CLOUD_APP_ID
    const serverSecret = configurationKeys.ZEGO_CLOUD_SERVER_SECRET
    const effectiveTime = 3600
    const payload =""
    if(appId && serverSecret && userId){
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      )
      return token
    }
    
 
  } catch (error) {
    console.error("Error in handleGenerateZegoToken:", error);
    if (error instanceof ErrorInApplication) {
      throw error;
    }
    throw new ErrorInApplication("Failed to handleGenerateZegoToken", 500);
  }
};


