import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaPlusCircle,
  FaCommentAlt,
  FaPhoneAlt,
  FaUserFriends,
  FaCog,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa6";
import { BsExposure } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { leftSidebar } from "../../API/Profile/profile";
import useUserDetails from "../../Hooks/useUserDetails";

const LeftSidebar = ({
  isLeftSidebarOpen,
  toggleDarkMode,
  isDarkMode,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useUserDetails();
  const [isOpen, setIsOpen] = useState(true);

  const home = () => navigate("/home");
  const profile = () => navigate("/profile");
  const settings = () => navigate("/settings");
  const findFriends = () => navigate("/friends");
  const addPost = () => navigate("/addpost");
  const explore = () => navigate("/explore");
  const chats = () => navigate("/chats");
  const feeds = () => navigate("/feeds");

  useEffect(() => {
    if (currentUser.isLeftSidebarOpen !== undefined) {
      setIsOpen(currentUser.isLeftSidebarOpen);
    }
  }, [currentUser.isLeftSidebarOpen]);

  const toggleCollapse = async () => {
    setIsOpen(!isOpen);
    await leftSidebar();
  };

  const buttonClasses =
    "flex items-center justify-center w-full p-2 rounded transition-colors duration-300 text-gray-800 dark:text-gray-200";
  const buttonHoverClasses =
    "hover:bg-slate-400 hover:text-white dark:hover:bg-slate-500 dark:hover:text-gray-200";
  const activeButtonClasses =
    "bg-slate-500   text-white dark:bg-slate-700 dark:text-gray-100 shadow-md";

  const isActive = path =>
    location.pathname === path ? activeButtonClasses : "";

  return (
    <aside className="h-full flex border-r-2 border-gray-300 dark:border-gray-800 shadow-lg ">
      <div
        className={`bg-gray-800  dark:bg-slate-800 ${
          isOpen ? "w-44" : "w-16"
        } ${
          isLeftSidebarOpen ? "block" : "hidden"
        } lg:block transition-all duration-300`}>
        <div className="p-2   bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto font-semibold no-scrollbar flex flex-col items-center">
          <button
            onClick={toggleCollapse}
            className="mb-2 p-2 bg-gray-700 text-white rounded-full">
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <div className="flex flex-col gap-2 w-full items-center">
            <button
              onClick={home}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/home"
              )}`}>
              <FaHome className="inline-block mr-2" />
              {isOpen && "Home"}
            </button>
            <button
              onClick={explore}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/explore"
              )}`}>
              <BsExposure className="inline-block mr-2" />
              {isOpen && "Explore"}
            </button>
            <button
              onClick={addPost}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/addpost"
              )}`}>
              <FaPlusCircle className="inline-block mr-2" />
              {isOpen && "Add Post"}
            </button>
            <button
              onClick={chats}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/chats"
              )}`}>
              <FaCommentAlt className="inline-block mr-2" />
              {isOpen && "Chats"}
            </button>
            <button
              onClick={feeds}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/feeds"
              )}`}>
              <FaNewspaper className="inline-block mr-2" />
              {isOpen && "Feeds"}
            </button>
       
            <button
              onClick={findFriends}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/friends"
              )}`}>
              <FaUserFriends className="inline-block mr-2" />
              {isOpen && "Friends"}
            </button>
            <button
              onClick={profile}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/profile"
              )}`}>
              <FaUser className="inline-block mr-2" />
              {isOpen && "Profile"}
            </button>
            <button
              onClick={settings}
              className={`${buttonClasses} ${buttonHoverClasses} ${isActive(
                "/settings"
              )}`}>
              <FaCog className="inline-block mr-2" />
              {isOpen && "Settings"}
            </button>
            <button
              onClick={toggleDarkMode}
              className={`${buttonClasses} ${buttonHoverClasses}`}>
              {isOpen
                ? isDarkMode
                  ? "Light Mode"
                  : "Dark Mode"
                : isDarkMode
                ? "🌙"
                : "☀️"}
            </button>
            <button
              onClick={handleLogout}
              className={`${buttonClasses} bg-red-600 hover:bg-red-700`}>
              <FaSignOutAlt className="inline-block mr-2" />
              {isOpen && "Logout"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
