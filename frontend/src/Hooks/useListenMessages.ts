import { useEffect } from "react";
import { useSocketContext } from "../Context/SocketContext";
import useConversation from "./useConversations";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages } = useConversation();

  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      newMessage.shouldShake = true;
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const handleUpdateMessage = (updatedMessage: any) => {
      updatedMessage.shouldShake = true;
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === updatedMessage._id ? updatedMessage : message
        )
      );
    };

    const handleDeleteMessage = (deleteMessage: any) => {
      deleteMessage.shouldShake = true;
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === deleteMessage._id ? deleteMessage : message
        )
      );
    };

    socket?.on("newMessage", handleNewMessage);
    socket?.on("updateMessage", handleUpdateMessage);
    socket?.on("deleteMessage", handleDeleteMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("updateMessage", handleUpdateMessage);
      socket?.off("deleteMessage", handleDeleteMessage);
    };
  }, [socket, setMessages]);
};

export default useListenMessages;
