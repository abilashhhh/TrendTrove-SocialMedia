import React from 'react';
import { ToastContainer } from 'react-toastify';
import IndividualNotifications from './IndividualNotifications';

const NotificationsMiddlePage = () => {
  return (
    <>
      <ToastContainer />
      <main className="flex-1 bg-gray-800 dark:bg-gray-700 text-black dark:text-white">
        <div className="p-2   bg-gray-100 dark:bg-gray-900 h-full">
          <div className="flex flex-col md:flex-row gap-1 h-full w-full overflow-auto no-scrollbar">
            <IndividualNotifications />
          </div>
        </div>
      </main>
    </>
  );
}

export default NotificationsMiddlePage;
