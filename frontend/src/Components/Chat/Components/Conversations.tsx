import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../API/User/user";
import ConversationItem from "./ConversationItem";
import { getAllConversations } from "../../../API/Chat/chat";
import { Message } from "../../../Types/userProfile";
import useConversation from "../../../Hooks/useConversations";
import useGetMessages from "../../../Hooks/useGetMessages";
import useSendMessages from "../../../Hooks/useSendMessages";
import useListenMessages from "../../../Hooks/useListenMessages";
 
interface User {
  _id: string;
  username: string;
  name: string;
  dp: string;
}

interface Conversation {
  participants: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationsProps {
  searchQuery: string;
  setSelectedConversation: (user: User | null) => void;
  activeTab: string;
}

const Conversations: React.FC<ConversationsProps> = ({
  searchQuery,
  setSelectedConversation,
  activeTab,
}) => {
  const { selectedConversation } = useConversation(); 
  const { messages} = useGetMessages(); 
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);


  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response && response.user) {
          setAllUsers(response.user);
        }
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getAllConversations();
        if (response.data) {
          setConversations(response.data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [selectedConversation?._id,  messages ]); 

  const usersWithConversations = new Set(
    conversations.map(conv => conv.participants).flat()
  );

  const filteredUsers = allUsers
    .filter(user => {
      if (activeTab === "chats") {
        return usersWithConversations.has(user._id);
      } else if (activeTab === "newChat") {
        return !usersWithConversations.has(user._id);
      }
      return true;
    })
    .filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedConversations = filteredUsers
    .map(user => {
      const conversation = conversations.find(conv =>
        conv.participants.includes(user._id)
      );
      const lastMessage = conversation
        ? conversation.messages.reduce((latest, current) => {
            return new Date(latest.createdAt) > new Date(current.createdAt)
              ? latest
              : current;
          }, conversation.messages[0])
        : null;
      return {
        ...user,
        lastMessage: lastMessage
          ? { text: lastMessage.message, timestamp: lastMessage.createdAt }
          : null,
      };
    })
    .sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      }
      return 0;
    });

  return (
    <div className="pt-1 rounded-lg shadow-md flex-grow  overflow-auto no-scrollbar">
      {sortedConversations.length > 0 ? (
        sortedConversations.map(user => (
          <ConversationItem
            key={user._id}
            user={user}
            setSelectedConversation={setSelectedConversation}
            lastMessage={user.lastMessage}
          />
        ))
      ) : (
        <div className="text-gray-600 dark:text-gray-400">No users found</div>
      )}
    </div>
  );
};

export default Conversations;
