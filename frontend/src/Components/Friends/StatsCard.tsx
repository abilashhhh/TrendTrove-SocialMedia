import React from "react";

interface StatsCardProps {
  posts: number;
  followers: number;
  following: number;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ posts, followers, following, onFollowersClick, onFollowingClick }) => {
  return (
    <div className="flex justify-between px-8 py-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg gap-6">
      <div className="text-center md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Posts
        </h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {posts}
        </p>
      </div>

      <div className="text-center md:w-1/3" onClick={onFollowersClick} style={{cursor: 'pointer'}}>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Followers
        </h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {followers}
        </p>
      </div>

      <div className="text-center md:w-1/3" onClick={onFollowingClick} style={{cursor: 'pointer'}}>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Following
        </h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {following}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
