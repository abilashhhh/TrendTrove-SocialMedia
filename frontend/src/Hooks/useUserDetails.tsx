import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserInfo } from "../Types/userProfile";
import { getUserInfo } from "../API/Profile/profile";
import { StoreType } from "../Redux/Store/reduxStore";

function useUserDetails() {
  const initialUserInfo: UserInfo = {
    // userId: "",
    name: "",
    username: "",
    email: "",
    phone: undefined,
    password: "",
    dp: undefined,
    coverPhoto: undefined,
    bio: undefined,
    gender: undefined,
    address: undefined,
    isBlocked: false,
    isPrivate: false,
    isVerifiedAccount: false,
    isGoogleSignedIn: false,
    isDarkMode: true,
    isLeftSidebarOpen: false,
    isRightSidebarOpen: false,
    isPremium: false,
    refreshToken: null,
    refreshTokenExpiresAt: null,
    posts: [],
    requestsForMe: [],
    requestedByMe: [],
    followers: [],
    following: [],
    savedPosts: [],
    taggedPosts: [],
    notifications: [],
    blockedUsers: [],
    createdAt: undefined,
    updatedAt: undefined,
  };

  const [userDetails, setUserDetails] = useState<UserInfo>(initialUserInfo);
  const currentUser = useSelector((state: StoreType) => state.userAuth.user);
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) return;
      try {
        // console.log("userId: ", userId);
        const userDetailsFromDB: any = await getUserInfo();  
        // console.log("userDetailsFromDB: ", userDetailsFromDB.user);
        setUserDetails(userDetailsFromDB.user);
      } catch (error) {
        console.error("Failed to fetch user info", error);
        toast.error("Failed to load user details");
      }
    };

    fetchUserInfo();
  }, [userId]);
// console.log("userDetails :", userDetails)
  return userDetails;
}

export default useUserDetails;
