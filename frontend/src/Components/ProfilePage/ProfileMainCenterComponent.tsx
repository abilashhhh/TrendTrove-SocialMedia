import React from "react";
import Followers from "./ProfileCenter/Followers";
import Following from "./ProfileCenter/Following";
import Profile from "./ProfileCenter/Profile";
import { UserInfo } from "../../Types/userProfile";

interface ProfileMainCenterComponentProps {
  userDetails: UserInfo;
}

const ProfileMainCenterComponent: React.FC<ProfileMainCenterComponentProps> = ({
  userDetails,
}) => {
  return (
    <main className="flex-1 p-2 overflow-auto bg-slate-100 dark:bg-gray-900 text-black dark:text-white flex">
      <div className="flex-1 w-full overflow-y-auto no-scrollbar">
        <Profile userDetails={userDetails} />
      </div>

      <div className="md:flex flex-col gap-2 overflow-hidden">
        <div className="no-scrollbar overflow-y-auto flex-1">
          <Followers userDetails={userDetails} />
        </div>
        <div className="border-t-2  border-slate-300 dark:border-slate-800 "></div>
        <div className="no-scrollbar overflow-y-auto flex-1">
          <Following userDetails={userDetails} />
        </div>
      </div>
    </main>
  );
};

export default ProfileMainCenterComponent;
