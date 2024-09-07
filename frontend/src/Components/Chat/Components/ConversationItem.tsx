import React from "react";
import useConversation from "../../../Hooks/useConversations";
import { useSocketContext } from "../../../Context/SocketContext";
import { getTimeDifference } from "../../../utils/timeAgo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";

interface User {
  isPrivate: string;
  isPremium: string;
  _id: string;
  username: string;
  name: string;
  dp: string;
}

interface LastMessage {
  text: string;
  timestamp: string;
}

interface ConversationItemProps {
  user: User;
  setSelectedConversation: (user: User) => void;
  lastMessage: LastMessage | null;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  user,
  setSelectedConversation,
  lastMessage,
}) => {
  const { selectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;

  const { onlineUsers, notifications } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);

  const isReadFalseNotifications = notifications.filter(
    (notification) => !notification.isRead && notification.senderId === user._id
  );
  const numberOfIsReadFalse = isReadFalseNotifications.length;

  return (
    <div
      key={user._id}
      className={`flex items-center p-2 gap-2 hover:bg-slate-400 cursor-pointer dark:hover:bg-slate-700 bg-slate-200 dark:bg-slate-800 mt-2 rounded-md ${
        isSelected
          ? "bg-slate-400 text-black dark:text-white dark:bg-slate-900 border"
          : ""
      }`}
      onClick={() => {
        setSelectedConversation(user);
      }}
    >
      <div className={`avatar ${isOnline ? "online" : ""}`}>
        <div className="w-10 rounded-full">
          <img
            src={user.dp}
            alt={user.username}
            className="w-10 h-10 rounded-full mr-2"
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-row items-center justify-between">
          <div
            className={`font-bold text-sm ${
              isSelected
                ? "text-black dark:text-white"
                : "text-gray-900 dark:text-gray-300"
            } flex gap-1 items-center`}
          >
            {user.username}
            {user.isPremium && (
              <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />
            )}
            {user.isPrivate && (
              <FontAwesomeIcon icon={faLock} className="text-green-500" />
            )}
          </div>
        </div>

        <div
          className={`text-sm break-all ${
            isSelected
              ? "text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {lastMessage ? lastMessage.text : ""}
        </div>
      </div>

      {numberOfIsReadFalse > 0 && (
        <div
          className={`font-bold text-sm ${
            isSelected
              ? "text-black dark:text-white"
              : "text-gray-900 dark:text-gray-300"
          } flex gap-1 items-center bg-blue-800 p-2 rounded-full`}
        >
          {numberOfIsReadFalse}
        </div>
      )}

      <div>
        <div
          className={`text-xs ${
            isSelected
              ? "text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {lastMessage
            ? getTimeDifference(new Date(lastMessage.timestamp))
            : ""}
        </div>
        <div
          className={`text-xs ${
            isSelected
              ? "text-black dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {isOnline ? <p className="text-green-500 text-center">Online</p> : ""}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
