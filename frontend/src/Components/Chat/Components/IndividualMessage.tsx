import React, { useState } from "react";
import useConversation from "../../../Hooks/useConversations";
import useUserDetails from "../../../Hooks/useUserDetails";
import { Message } from "../../../Types/userProfile";
import { FaInfoCircle, FaPen, FaTimes, FaTrash } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { toast } from "react-toastify";
import { deleteMessage, updateMessage } from "../../../API/Chat/chat";

interface IndividualMessageProps {
  message: Message;
}

const formatDateTime = (dateString: string | number): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};

const IndividualMessage: React.FC<IndividualMessageProps> = ({ message }) => {
  const { selectedConversation } = useConversation();
  const currentUser = useUserDetails();
  const fromMe = message.senderId === currentUser._id;
  const [showTime, setShowTime] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? currentUser.dp : selectedConversation?.dp;
  const bubbleColor = fromMe
    ? "bg-blue-300 dark:bg-blue-700"
    : "bg-slate-300 dark:bg-slate-700";

  const handleInfoClick = () => {
    setShowTime(!showTime);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!editedMessage.trim()) {
      toast.error("Message cannot be empty or just whitespace");
      return;
    }

    try {
      const response = await updateMessage(message._id, editedMessage);
      if (response.error) throw new Error(response.error);
      setIsEditing(false);
      message.message = editedMessage;
      toast.success("Message updated successfully");
    } catch (error: any) {
      toast.error(`Error updating message: ${error.message}`);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await deleteMessage(message._id);
      if (response.error) throw new Error(response.error);
      message.message = null;
      message.mediaUrl = null;
      message.fileType = null;
      toast.success("Message deleted successfully");
      setShowConfirmDelete(false);
    } catch (error: any) {
      toast.error(`Error deleting message: ${error.message}`);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedMessage(message.message);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const createdWithin15Mins = (message : Message) => {
    const createdAt = new Date(message.createdAt);
    const currentTime = new Date();
    const timeDifference = (currentTime - createdAt) / (1000 * 60);

    return timeDifference <= 15;
  };

  return (
    <div className={`chat mb-5 ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-6 rounded-full">
          <img alt="User avatar" src={profilePic} />
        </div>
      </div>

      <div
        className={`chat-bubble text-black dark:text-white break-all ${bubbleColor} p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg`}>
        {message.mediaUrl !== null && (
          <div className="mt-2">
            {message.fileType === "image" && (
              <img
                src={message.mediaUrl}
                alt="Attached media"
                className="rounded-lg max-w-full h-auto"
              />
            )}
            {message.fileType === "video" && (
              <video
                controls
                className="rounded-lg max-w-full h-auto"
                src={message.mediaUrl}></video>
            )}
            {message.fileType === "audio" && (
              <audio
                controls
                className="rounded-lg max-w-full h-auto"
                src={message.mediaUrl}></audio>
            )}
          </div>
        )}
        {isEditing ? (
          <input
            type="text"
            value={editedMessage ?? ""}
            onChange={e => setEditedMessage(e.target.value)}
            className="bg-transparent border-b border-gray-500 outline-none w-full p-1 text-black dark:text-white"
            autoFocus
          />
        ) : message.message ? (
          message.message
        ) : (
          <span className="w-full h-full text-red-300 italic font-bold">
            Message has been deleted
          </span>
        )}
      </div>
      <div className="chat-footer text-xs mt-1 flex gap-2 items-center">
        <FaInfoCircle
          className="cursor-pointer opacity-35 text-xs"
          onClick={handleInfoClick}
        />
        {showTime && (
          <div className="chat-timestamp text-xs mt-1 opacity-50">
            {formatDateTime(message.createdAt)}
          </div>
        )}
        {fromMe &&
          message.message &&
          (isEditing ? (
            <>
              <TiTick
                className="cursor-pointer text-2xl bg-green-700 rounded-full"
                onClick={handleSaveClick}
              />
              <FaTimes
                className="cursor-pointer text-2xl bg-red-500 rounded-full"
                onClick={handleCancelClick}
              />
            </>
          ) : (
            <>
              {createdWithin15Mins(message) && (
                <FaPen
                  className="cursor-pointer opacity-35 text-xs"
                  onClick={handleEditClick}
                />
              )}

            {createdWithin15Mins(message) &&  <FaTrash
                className="cursor-pointer opacity-35 text-xs"
                onClick={handleConfirmDelete}
              />}
            </>
          ))}
        {message.createdAt !== message.updatedAt && message.message && (
          <p className="opacity-35">Edited</p>
        )}
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto">
            <p className="text-center mb-4 text-black dark:text-white">
              Are you sure you want to delete this message?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualMessage;
