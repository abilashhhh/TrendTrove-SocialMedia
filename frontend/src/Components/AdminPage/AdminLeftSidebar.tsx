import React from "react";
import { FaHome, FaImages, FaUserFriends } from "react-icons/fa";

const AdminLeftSidebar = ({
  isLeftSidebarOpen,
  toggleDarkMode,
  isDarkMode,
  handleLogout,
  handleUsersList,
  handleUsersReports,
  handleHome,
  handlePremiumAccounts
}) => {
  return (
    <aside
      className={`w-52 ${
        isLeftSidebarOpen ? "block" : "hidden"
      } md:block`}>
      <div className=" bg-gray-200 border-r-2 border-slate-300 dark:border-slate-600 p-2 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleHome}
            className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white p-2 rounded ml-4 md:ml-0 font-bold hover:bg-slate-600 hover:dark:bg-slate-200 hover:dark:text-black hover:text-white">
            <FaHome className="inline-block mr-2" />
            Home
          </button>

          <button
            className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white p-2 rounded ml-4 md:ml-0 font-bold hover:bg-slate-600 hover:dark:bg-slate-200 hover:dark:text-black hover:text-white"
            onClick={handleUsersList}>
            <FaUserFriends className="inline-block mr-2" />
            Users
          </button>
          <button
            className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white p-2 rounded ml-4 md:ml-0 font-bold hover:bg-slate-600 hover:dark:bg-slate-200 hover:dark:text-black hover:text-white"
            onClick={handleUsersReports}>
            <FaImages className="inline-block mr-2" />
            Post Reports
          </button>
          <button
            className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white p-2 rounded ml-4 md:ml-0 font-bold hover:bg-slate-600 hover:dark:bg-slate-200 hover:dark:text-black hover:text-white"
            onClick={handlePremiumAccounts}>
         Premium Account
          </button>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-300 dark:bg-gray-800 text-black font-bold dark:text-white p-2 rounded ml-4 md:ml-0 hover:bg-slate-600 hover:dark:bg-slate-200 hover:dark:text-black hover:text-white">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-800 hover:text-white text-white p-2 rounded ml-4 font-bold md:ml-0">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminLeftSidebar;
