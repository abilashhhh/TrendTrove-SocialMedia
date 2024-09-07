import React, { useState } from "react";
import SearchInput from "./Components/SearchInput";
import Conversations from "./Components/Conversations";
import useConversation from "../../Hooks/useConversations";

const ChatLeftSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");  
  const { setSelectedConversation } = useConversation();

  return (
    <div className="bg-slate-100 rounded-lg  dark:bg-slate-900 w-full p-4 h-full flex flex-col overflow-auto no-scrollbar">
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex-1 mt-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`flex-1 p-2 rounded-lg text-center ${activeTab === "chats" ? "bg-blue-500 dark:bg-blue-900" : "bg-slate-300 dark:bg-slate-700"} text-slate-900 dark:text-white`}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>
          <button
            className={`flex-1 p-2 rounded-lg text-center ${activeTab === "newChat" ? "bg-blue-400 dark:bg-blue-900" : "bg-slate-300 dark:bg-slate-700"} text-slate-900 dark:text-white`}
            onClick={() => setActiveTab("newChat")}
          >
            New Chat
          </button>
          {/* <button
            className={`flex-1 p-2 rounded-lg text-center ${activeTab === "groupChat" ? "bg-blue-400 dark:bg-blue-900" : "bg-slate-300 dark:bg-slate-700"} text-slate-900 dark:text-white`}
            onClick={() => setActiveTab("groupChat")}
          >
            Group Chat
          </button> */}
        </div>
        <Conversations
          searchQuery={searchQuery}
          setSelectedConversation={setSelectedConversation}
          activeTab={activeTab} 
        />
      </div>
    </div>
  );
};

export default ChatLeftSidebar;
