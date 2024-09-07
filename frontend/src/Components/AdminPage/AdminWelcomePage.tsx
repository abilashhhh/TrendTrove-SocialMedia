import React from "react";

function AdminHomePageContent() {
  return (
    <main className="flex-1  overflow-auto bg-gray-800 dark:bg-gray-700 text-black dark:text-white">
      <div className="p-4   bg-gray-100 dark:bg-gray-900 text-black dark:text-white h-full overflow-y-auto no-scrollbar flex flex-col items-center justify-center">
        <div className="text-center">Admin Home Page </div>
        <img
          src="/TrendTroveLogo2.jpg"
          className="w-60 mt-4 rounded-full mx-auto"
          alt="Trend Trove Logo"
        />
      </div>
    </main>
  );
}

export default AdminHomePageContent;
