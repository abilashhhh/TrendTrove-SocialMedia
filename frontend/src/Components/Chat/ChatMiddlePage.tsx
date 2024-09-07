import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatLeftSidebar from "./ChatLeftSidebar";
import { FaComments } from "react-icons/fa";
import useConversation from "../../Hooks/useConversations";
import ChatInnerMain from "./ChatInnerMain";
 
const ChatMiddlePage: React.FC = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  const showChatInnerMain = isSmallScreen && selectedConversation;

  return (
    <>
      <ToastContainer />
      <main className="flex-1 pt-2 pr-2 lg:pl-2 lg:pb-2 pb-1 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 h-full">
          <div className="flex flex-col md:flex-row gap-1 h-full overflow-auto no-scrollbar">
            <div
              className={`w-full md:w-1/3 lg:w-1/4 ${
                showChatInnerMain && "hidden md:block"
              }`}>
              <ChatLeftSidebar />
            </div>
            <div
              className={`w-full md:w-2/3 lg:w-3/4 flex-grow ${
                !showChatInnerMain && "hidden md:block"
              }`}>
              {!selectedConversation ? <NoChatSelected /> : <ChatInnerMain />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ChatMiddlePage;

const NoChatSelected: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
      <FaComments className="text-6xl mb-4 text-blue-500" />
      <div className="text-2xl font-semibold mb-2">No Chat Selected</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Please select a chat to start messaging.
      </div>
    </div>
  );
};
