import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserFriends } from 'react-icons/fa';  

const Followers = ({ userDetails }) => {
  const currentUser = userDetails;
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <aside className="hidden lg:block bg-gray-800 dark:bg-gray-700 h-full w-64">
      <div className="p-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-semibold mb-4 text-center underline">
          Followers
        </h2>

        {currentUser?.followers.length > 0 ? (
          currentUser.followers.map((follower, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 mb-2 bg-gray-200 dark:bg-gray-800 rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center">
                <img
                  src={follower.dp}
                  alt={follower.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h1
                    className="text-base font-semibold cursor-pointer"
                    onClick={() => navigate(`/profiles/${follower.username}`)}>
                    {follower.username}
                  </h1>
                  <p className="text-sm text-gray-400">
                    Since {formatDate(follower.followedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FaUserFriends className="text-2xl text-gray-500 mb-4" />
            <p className="text-md text-gray-700 dark:text-gray-300">
              No followers available
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Followers;
