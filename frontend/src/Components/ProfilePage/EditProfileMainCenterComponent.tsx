import React from "react";
import Followers from "./ProfileCenter/Followers";
import Following from "./ProfileCenter/Following";
import { UserInfo } from "../../Types/userProfile";
import EditProfile from "./ProfileCenter/EditProfile";

interface ProfileMainCenterComponentProps {
  userDetails: UserInfo;
}

const ProfileMainCenterComponent: React.FC<ProfileMainCenterComponentProps> = ({ userDetails }) => {
  return (
    <main className="flex-1  overflow-auto bg-slate-100 dark:bg-gray-900 text-black dark:text-white flex">
 
      <div className="flex-1 w-full  overflow-y-auto no-scrollbar">
        <EditProfile userDetails={userDetails} />
      </div>

       
    </main>
  );
};

export default ProfileMainCenterComponent;
