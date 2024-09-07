import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900">
      <div className="p-3 animate-spin bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 w-32 h-32 rounded-full flex items-center justify-center">
        <div className="rounded-full h-full w-full bg-slate-800 dark:bg-zinc-900 flex items-center justify-center">
          <img
            src="/TrendTroveLogo2.jpg" 
            alt="TrendTrove Logo"
            className="w-28 h-28 md:w-40 md:h-40 rounded-full"
          />
        </div>
      </div>
      <p className="mt-8 text-lg font-semibold  text-white">TrendTrove</p>
      <p className="mt-2 text-lg  text-white">Logging out...</p>
    </div>
  );
};

export default LoadingSpinner;
