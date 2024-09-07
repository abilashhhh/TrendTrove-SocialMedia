import React from "react";
import { FaHome, FaUserFriends, FaPlusSquare, FaCog, FaCommentAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BottomNavBar = ({ toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();
  const navHeight = 40;

  return (
    <>
      <div className="block lg:hidden" style={{ height: navHeight }} />
      <nav
        className={`fixed bottom-0 left-0 right-0 shadow-lg flex justify-around lg:hidden ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
        }`}
        style={{ height: navHeight }}
      >
        <button
          onClick={() => navigate("/home")}
          className="p-2 flex flex-col items-center transition-transform transform hover:scale-110"
        >
          <FaHome className={`text-xl ${isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`} />
        </button>
        <button
          onClick={() => navigate("/friends")}
          className="p-2 flex flex-col items-center transition-transform transform hover:scale-110"
        >
          <FaUserFriends className={`text-xl ${isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`} />
        </button>
        <button
          onClick={() => navigate("/addpost")}
          className="p-2 flex flex-col items-center transition-transform transform hover:scale-110"
        >
          <FaPlusSquare className={`text-xl ${isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`} />
        </button>
        <button
          onClick={() => navigate("/chats")}
          className="p-2 flex flex-col items-center transition-transform transform hover:scale-110"
        >
          <FaCommentAlt className={`text-xl ${isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`} />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="p-2 flex flex-col items-center transition-transform transform hover:scale-110"
        >
          <FaCog className={`text-xl ${isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`} />
        </button>
      </nav>
    </>
  );
};

export default BottomNavBar;
