 
import React from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store/reduxStore";

interface HeaderProps {
  toggleLeftSidebar: () => void;
}

const AdminHeader: React.FC<HeaderProps> = ({ toggleLeftSidebar }) => {
  const currentUser: any = useSelector((state: StoreType) => state.userAuth.user);


  return (
    <div className="bg-gray-800 dark:bg-gray-700 ">
      <div className="bg-gray-200 dark:bg-gray-900 text-black dark:text-white p-2 flex justify-between items-center  border-b-2 border-slate-300 dark:border-slate-600">
       <div className="flex gap-3">
       <div className="space-x-4 md:hidden flex">
          <button onClick={toggleLeftSidebar}>☰</button>
        </div>
        <h1 className="text-2xl flex items-center">
          <span className="text-gray-500 dark:text-slate-300 text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            Trend
          </span>
          <span className="ml-1 text-black dark:text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            Trove
          </span>
          -
          <span className="text-gray-500 dark:text-slate-300 text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            Admin
          </span>
        </h1>
       </div>

        <div className="flex items-center space-x-2">
          {currentUser && currentUser.dp ? (
              <img
                className="rounded-full h-8 w-8 object-cover"
                src={currentUser.dp}
                alt="User Profile"
              />
          ) : (
            <span className="text-white">
                <img
                  className="rounded-full h-8 w-8 object-cover"
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  alt="User Profile"
                />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
