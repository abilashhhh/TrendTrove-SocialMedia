import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  FaPaperPlane,
  FaSmile,
  FaImage,
  FaVideo,
  FaFileAudio,
  FaTimes,
} from "react-icons/fa";
import { FiPaperclip } from "react-icons/fi";
import useSendMessages from "../../../Hooks/useSendMessages";
import useConversation from "../../../Hooks/useConversations";
import useUserDetails from "../../../Hooks/useUserDetails";
import upload from "../../../utils/cloudinary";
import { useSocketContext } from "../../../Context/SocketContext";

const SendMessageInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileIcons, setShowFileIcons] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { sendMessage, sendMessageOnly } = useSendMessages();
  const { selectedConversation } = useConversation();
  const currentUser = useUserDetails();

  const {
    markSpecificUserNotificationAsRead,
    notifications,
    typingHandler,
    isTyping,
  } = useSocketContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markSpecificUserNotificationAsRead(
      notifications,
      selectedConversation?._id
    );

    if (!message.trim() && !selectedFile) {
      toast.error("Message or file cannot be empty.");
      return;
    }
    setLoading(true);

    try {
      let mediaUrl = "";
      if (selectedFile) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(selectedFile);
        fileReader.onloadend = async () => {
          const fileType = selectedFile.type.startsWith("image")
            ? "image"
            : selectedFile.type.startsWith("video")
            ? "video"
            : "audio";
          const response = await upload(
            fileReader.result as string,
            err => toast.error(err),
            "chatMessages",
            fileType
          );
          if (response?.url) {
            mediaUrl = response.url;
          }
          const messageToSend = message.trim() || selectedFile.name;
          await sendMessage(messageToSend, mediaUrl, fileType);
          toast.success("Message sent successfully!");
          setMessage("");
          setSelectedFile(null);
          setLoading(false);
        };
      } else {
        await sendMessageOnly(message.trim());
        toast.success("Message sent successfully!");
        setMessage("");
        setSelectedFile(null);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(`Error sending message: ${error.message}`);
      setLoading(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prevMessage => prevMessage + emojiData.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const toggleFileIcons = () => {
    setShowFileIcons(prev => !prev);
  };

  const handleFileInputClick = (fileType: string) => {
    const input = document.getElementById(`${fileType}Input`);
    if (input) {
      (input as HTMLInputElement).click();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const canChat =
    !selectedConversation?.isPrivate ||
    selectedConversation?.followers.some(
      (follower: { userId: string }) => follower.userId === currentUser._id
    ); 

    const isUserInBlockedList = currentUser?.blockedUsers.includes(selectedConversation._id) 
    

    return (
    <div className="bg-gray-100 dark:bg-gray-800 shadow-sm sticky bottom-0 ml-1 mr-1">
      {canChat && !isUserInBlockedList && (
        <>
          {selectedFile && (
            <div className="mt-2 text-gray-700 dark:text-gray-300 flex items-center">
              <span>Selected file: {selectedFile.name}</span>
              <button
                className="ml-2 text-red-500"
                onClick={removeSelectedFile}
                aria-label="Remove selected file"
                title="Remove file">
                <FaTimes />
              </button>
            </div>
          )}
          <form className="flex items-center w-full" onSubmit={handleSubmit}>
            {isTyping && (
              <div className="typing-indicator-container bg-green-700 text-white p-2 rounded-lg mr-1 animate-bounce transition-all duration-300 ease-in-out transform-gpu">
                Typing..
              </div>
            )}
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={e => {
                setMessage(e.target.value);
                typingHandler(e);
              }}
              className="flex-grow p-2 mr-2 rounded-lg border border-gray-700 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              aria-label="Toggle Emoji Picker"
              className="p-2 bg-gray-300 dark:bg-gray-700 text-yellow-500 rounded-lg mr-2"
              onClick={() => setShowEmojiPicker(prev => !prev)}>
              <FaSmile />
            </button>
            <button
              type="button"
              aria-label="Attach File"
              className="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg mr-2"
              onClick={toggleFileIcons}>
              <FiPaperclip />
            </button>
            <button
              type="submit"
              aria-label="Send Message"
              className="p-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}>
              {loading ? (
                <div className="loading loading-spinner"></div>
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </form>

          {showEmojiPicker && (
            <div className="absolute bottom-16 right-4">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          {showFileIcons && (
            <div className="absolute bottom-12 right-0 flex rounded-lg">
              <div
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg cursor-pointer"
                onClick={() => handleFileInputClick("image")}>
                <FaImage />
              </div>
              <div
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg cursor-pointer ml-2"
                onClick={() => handleFileInputClick("video")}>
                <FaVideo />
              </div>
              <div
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg cursor-pointer ml-2"
                onClick={() => handleFileInputClick("audio")}>
                <FaFileAudio />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="imageInput"
              />
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="videoInput"
              />
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audioInput"
              />
            </div>
          )}
        </>
      )}
      <style jsx>{`
        @media (max-width: 640px) {
          .typing-indicator-container {
            font-size: 0.75rem;
            padding: 0.5rem;
          }
        }
        .typing-indicator-container {
          display: inline-block;
          transition: transform 0.3s ease-in-out;
        }
        .typing-indicator-container:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default SendMessageInput;
