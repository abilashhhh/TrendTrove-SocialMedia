import { MessagesRepositoryMongoDB } from "../../frameworks/database/mongodb/respositories/messageRepositoryDatabase";

export const messageDBRepository = (
  repository: ReturnType<MessagesRepositoryMongoDB>
) => {
  const sendMessage = async (
    senderId: string,
    receiverId: string,
    message: string,
    mediaUrl: string,
    fileType: string
  ) => {
    return await repository.sendMessage(
      senderId,
      receiverId,
      message,
      mediaUrl,
      fileType
    );
  };

  const sendMessageOnly = async (
    senderId: string,
    receiverId: string,
    message: string
  ) => {
    return await repository.sendMessageOnly(senderId, receiverId, message);
  };

  const editMessage = async (
    senderId: string,
    messageId: string,
    message: string
  ) => await repository.editMessage(senderId, messageId, message);

  const deleteMessage = async (senderId: string, messageId: string) =>
    await repository.deleteMessage(senderId, messageId);

  const getMessages = async (senderId: string, receiverId: string) => {
    return await repository.getMessages(senderId, receiverId);
  };

  const getAllConversations = async (senderId: string) => {
    return await repository.getAllConversations(senderId);
  };

  const getFriendsInfo = async (userId: string) => {
    return await repository.getFriendsInfo(userId);
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

export type MessageDBInterface = typeof messageDBRepository;
