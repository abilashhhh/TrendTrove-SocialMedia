import React from "react";

const MessageSkeleton = () => {
  return (
    <div className="flex-grow overflow-auto">
      <div className="chat chat-start mb-4">
        <div className="chat-image avatar">
          <div className="w-10  opacity-40 h-10 rounded-full skeleton"></div>
        </div>

        <div className="chat-bubble bg-blue-100 opacity-10 text-white skeleton h-8 w-full m-2"></div>
        <div className="chat-footer  opacity-30 text-xs mt-1 skeleton h-4 w-16"></div>
      </div>

      <div className="chat chat-end mb-4">
        <div className="chat-image avatar">
          <div className="w-10 h-10   opacity-40 rounded-full skeleton"></div>
        </div>

        <div className="chat-bubble bg-green-500 opacity-10 text-white skeleton h-8 w-full m-2"></div>
        <div className="chat-footer opacity-30 text-xs mt-1 skeleton h-4 w-24"></div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
