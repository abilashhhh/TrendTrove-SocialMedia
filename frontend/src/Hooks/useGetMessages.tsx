 
import { useEffect, useState } from "react";
import useConversation from "./useConversations";
import { getMessagesFromUser } from "../API/Chat/chat";
import { toast } from "react-toastify";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const getMessages = async () => {
    if (!selectedConversation?._id) return;
    setLoading(true);
    try {
      const { data } = await getMessagesFromUser(selectedConversation._id);
      if (data.error) throw new Error(data.error);
      setMessages(data);
    } catch (error) {
      toast.error(`Error loading messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id , setMessages]);

  return { messages, loading, getMessages };
};

export default useGetMessages;
