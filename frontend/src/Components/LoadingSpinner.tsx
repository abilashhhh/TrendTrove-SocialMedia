import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-white dark:text-white">TrendTrove</p>
      <p className="mt-2 text-lg  text-white">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
