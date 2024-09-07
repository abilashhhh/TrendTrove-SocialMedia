import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import useConversation from "../../../Hooks/useConversations";
import { useSocketContext } from "../../../Context/SocketContext";
import { IoIosCall } from "react-icons/io";
import { RxDotsVertical } from "react-icons/rx";
import { MdVideoCall } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setVideoCall, setVoiceCall } from "../../../Redux/ChatAuthSlice/chatSlice";

const ChatIndividualTopPortion = () => {
  const dispatch = useDispatch()
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [displayOptions, setDisplayOptions] = useState(false);
  const optionsRef = useRef(null);

  const handleClickOutside = (event: { target: any }) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setDisplayOptions(false);
    }
  };

  useEffect(() => {
    if (displayOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayOptions]);

  const toggleDisplayOptions = () => {
    setDisplayOptions(!displayOptions);
  };

  const handleVoiceCall = () => {
    console.log("Handle voice call")

    dispatch(
      setVoiceCall({
        ...selectedConversation,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      })
    );
  };

  const handleVideoCall = () => {
    console.log("Handle video  call")
    dispatch(
      setVideoCall({
        ...selectedConversation,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      })
    );
  };
  
  const handleBackClick = () => {
    setSelectedConversation(null);
  };

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-400">
        No conversation selected
      </div>
    );
  }

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(selectedConversation._id);

  return (
    <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-sm flex items-center p-4 relative">
      <FaArrowLeft
        className="text-xl cursor-pointer mr-4 text-gray-900 dark:text-gray-100 md:hidden"
        onClick={handleBackClick}
      />
      <div className="flex-shrink-0 mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            alt={`${selectedConversation.username}'s avatar`}
            src={selectedConversation.dp}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {selectedConversation.username}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <IoIosCall onClick={handleVoiceCall}  className="text-2xl text-gray-900 dark:text-gray-100 cursor-pointer" />
        <MdVideoCall onClick={handleVideoCall} className="text-2xl text-gray-900 dark:text-gray-100 cursor-pointer" />
        <RxDotsVertical
          onClick={toggleDisplayOptions}
          className="text-2xl text-gray-900 dark:text-gray-100 cursor-pointer"
        />
      </div>

      {displayOptions && (
        <div
          ref={optionsRef}
          className="absolute right-2 top-16 z-30 mt-2 w-48 bg-slate-200 dark:bg-slate-700 p-2 rounded-lg shadow-lg">
          <div className="flex flex-col space-y-2">
            <div className="cursor-pointer p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">
              Clear Chat
            </div>

            <div className="cursor-pointer p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">
              Block User
            </div>
            <div className="cursor-pointer p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">
              Mute Notifications
            </div>
            <div className="cursor-pointer p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">
              Unmute Notifications
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIndividualTopPortion;
