import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faImage } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {
  cancelFollowRequest,
  followUser,
  unfollowUser,
  acceptFollowRequests,
  rejectFollowRequests,
} from "../../utils/userRequestsHelper";
import Modal from "../../utils/Modal";
import {
  blockOtherUser,
  getUserProfile,
  unblockOtherUser,
} from "../../API/User/user";
import { getPostsLengthOfTheUser } from "../../API/Post/post";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FiMoreVertical } from "react-icons/fi";

import useUserDetails from "../../Hooks/useUserDetails";
import FriendsPagePost from "./FriendsPageComponents/FriendsPagePost";
// import TaggedPostComponent from "../Post/TaggedPostComponent";
import FriendsTaggedPosts from "./FriendsPageComponents/FriendsTaggedPosts";
import HighlightsDisplay from "./FriendsPageComponents/HighlightsDisplay";

interface UserInfo {
  coverPhoto: string;
  _id: string;
  username: string;
  name: string;
  dp: string;
  isPrivate: boolean;
  bio: string;
  createdAt?: string;
  posts?: any[];
  followers: { userId: string; username: string; followedAt: string }[];
  following?: { userId: string; username: string; followedAt: string }[];
  requestsForMe?: { userId: string; username: string; followedAt: string }[];
  requestedByMe?: { userId: string; username: string; followedAt: string }[];
}

const formatDate = (date: string | undefined) => {
  if (!date) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

const ProfilePageIndividualComponent: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const currentUser = useUserDetails();
  let navigate = useNavigate(); 

  if (username === currentUser?.username) {
    navigate("/profile");
  }
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const toggleMoreOptions = () => {
    setShowMoreOptions(prevState => !prevState);
  };

  const [userDetails, setUserDetails] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [iRequestedHim, setRequestsIMade] = useState<boolean>(false);
  const [heRequestedMe, setHeRequestedMe] = useState<boolean>(false);
  const [isMutualFollower, setIsMutualFollower] = useState<boolean>(false);
  const [followDate, setFollowDate] = useState<string | undefined>("");

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const [postCount, setPostCount] = useState(0);
  const [activeSection, setActiveSection] = useState("POSTS");
  const sections = ["POSTS", "TAGGED POSTS"];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "POSTS":
        return <FriendsPagePost username={username} />;
      case "TAGGED POSTS":
        return <FriendsTaggedPosts username={username} />;
      default:
        return null;
    }
  };

  const handleOpenFollowersModal = () => {
    setShowFollowersModal(true);
  };

  const handleCloseFollowersModal = () => {
    setShowFollowersModal(false);
  };

  const handleOpenFollowingModal = () => {
    setShowFollowingModal(true);
  };

  const handleCloseFollowingModal = () => {
    setShowFollowingModal(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(username);
        setUserDetails(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    const youAreFollowingHim = userDetails?.followers.find(
      f => f.userId === currentUser?._id
    );

    const heIsFollowingYou = userDetails?.following?.find(
      f => f.userId === currentUser?._id
    );

    const requestedByMe = userDetails?.requestsForMe?.find(
      r => r.userId === currentUser?._id
    );

    const requestsForMe = userDetails?.requestedByMe?.find(
      r => r.userId === currentUser?._id
    );

    const mutualFollower =
      userDetails?.followers?.find(f => f.userId === currentUser?._id) &&
      userDetails?.following?.find(r => r.userId === currentUser?._id);

    setIsFollower(!!youAreFollowingHim);
    setIsFollowing(!!heIsFollowingYou);
    setRequestsIMade(!!requestedByMe);
    setHeRequestedMe(!!requestsForMe);
    setIsMutualFollower(!!mutualFollower);

    if (youAreFollowingHim) {
      setFollowDate(youAreFollowingHim.followedAt);
    }
  }, [userDetails, currentUser]);

  const handleFollowUser = async (
    targetUserId: string,
    targetUserUserName: string
  ) => {
    const res = await followUser(
      currentUser._id,
      targetUserId,
      targetUserUserName
    );
    if (res) {
      if (userDetails.isPrivate) {
        setRequestsIMade(true);
      } else {
        setIsFollower(true);
      }
    }
  };

  const handleOnUnfollowUser = async (
    targetUserId: string,
    targetUserUserName: string
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to unfollow ${targetUserUserName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Unfollow",
    }).then(async result => {
      if (result.isConfirmed) {
        const res = await unfollowUser(
          currentUser._id,
          targetUserId,
          targetUserUserName
        );
        if (res) {
          setIsFollower(false);
          setIsMutualFollower(false);
        }
      }
    });
  };

  const handleOnCancelRequest = async (
    targetUserId: string,
    targetUserUserName: string
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to cancel the follow request to ${targetUserUserName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Cancel Request",
    }).then(async result => {
      if (result.isConfirmed) {
        const res = await cancelFollowRequest(
          currentUser._id,
          targetUserId,
          targetUserUserName
        );
        if (res) {
          setRequestsIMade(false);
        }
      }
    });
  };

  const handleAcceptUserRequest = async (
    targetUserId: string,
    targetUserUserName: string
  ) => {
    const res = await acceptFollowRequests(
      currentUser._id,
      targetUserId,
      targetUserUserName
    );
    if (res) {
      setHeRequestedMe(false);
      setIsMutualFollower(true);
    }
  };

  const handleRejectUserRequest = async (
    targetUserId: string,
    targetUserUserName: string
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to reject the follow request from ${targetUserUserName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Reject Request",
    }).then(async result => {
      if (result.isConfirmed) {
        const res = await rejectFollowRequests(
          currentUser._id,
          targetUserId,
          targetUserUserName
        );
        if (res) {
          setHeRequestedMe(false);
        }
      }
    });
  };

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const count = await getPostsLengthOfTheUser(username);
        setPostCount(count.data);
      } catch (error) {
        console.error("Error fetching post count:", error);
      }
    };
    fetchPostCount();
  }, [username]);

  const handleBlockUser = async (userId: string) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You want to block this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, block it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const block = await blockOtherUser(currentUser._id, userId);
        console.log("User blocked successfully:", block);
        Swal.fire({
          icon: "success",
          title: "User Blocked!",
          text: "You have successfully blocked the user.",
        });
        window.location.reload();
      } catch (error) {
        console.error("Error blocking user:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to block user. Please try again later.",
        });
      }
    }
  };

  const handleUnBlockUser = async (userId: string) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You want to unblock this user.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const unblock = await unblockOtherUser(currentUser._id, userId);
        console.log("User unblocked successfully:", unblock);
        Swal.fire({
          icon: "success",
          title: "User Unblocked!",
          text: "You have successfully unblocked the user.",
        });
        window.location.reload();
      } catch (error) {
        console.error("Error unblocking user:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to unblock user. Please try again later.",
        });
      }
    }
  };

  useEffect(() => {
    const youAreFollowingHim = userDetails?.followers.find(
      f => f.userId === currentUser?._id
    );

    const heIsFollowingYou = userDetails?.following?.find(
      f => f.userId === currentUser?._id
    );

    const requestedByMe = userDetails?.requestsForMe?.find(
      r => r.userId === currentUser?._id
    );

    const requestsForMe = userDetails?.requestedByMe?.find(
      r => r.userId === currentUser?._id
    );

    const mutualFollower =
      userDetails?.followers?.find(f => f.userId === currentUser?._id) &&
      userDetails?.following?.find(r => r.userId === currentUser?._id);

    setIsFollower(!!youAreFollowingHim);
    setIsFollowing(!!heIsFollowingYou);
    setRequestsIMade(!!requestedByMe);
    setHeRequestedMe(!!requestsForMe);
    setIsMutualFollower(!!mutualFollower);

    if (youAreFollowingHim) {
      setFollowDate(youAreFollowingHim.followedAt);
    }
  }, [userDetails, currentUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userDetails) {
    return (
      <main className="flex-1 pt-2 overflow-auto no-scrollbar bg-gray-800 dark:bg-gray-700 text-white p-10">
        <div className="mx-auto h-screen rounded-lg shadow-lg bg-slate-200 dark:bg-slate-800 overflow-auto p-5 no-scrollbar">
          User not found
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto no-scrollbar bg-gray-800 dark:bg-gray-700 text-white">
      <ToastContainer />
      <div className="mx-auto h-screen rounded-lg shadow-lg bg-slate-200 dark:bg-slate-900 overflow-auto no-scrollbar">
        <div className="bg-cover bg-center h-72">
          <img
            src={userDetails.coverPhoto || "/"}
            alt={`${userDetails.username}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center flex-col">
            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-slate-600 -mt-16">
              <img
                src={userDetails.dp || "/default-profile.jpg"}
                alt={userDetails.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {userDetails.username}
                {userDetails.isPrivate && (
                  <FontAwesomeIcon
                    icon={faLock}
                    className="ml-2 text-green-500"
                    title="Private Account"
                  />
                )}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {userDetails.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Joined on: {formatDate(userDetails.createdAt)}
              </p>
              {userDetails.bio && (
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Bio: {userDetails.bio}
                </p>
              )}
              <div className="mt-4">
                <div className="inline-flex items-center mr-4">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="mr-2 text-gray-600"
                  />
                  <span className="text-gray-800 dark:text-gray-200">
                    {(postCount && postCount) || 0} Posts
                  </span>
                </div>
                <div className="inline-flex items-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-gray-600"
                  />
                  <span
                    onClick={handleOpenFollowersModal}
                    className="text-gray-800 dark:text-gray-200 cursor-pointer">
                    {userDetails.followers.length} Followers
                  </span>
                </div>
                <div className="inline-flex items-center ml-4">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-gray-600"
                  />
                  <span
                    onClick={handleOpenFollowingModal}
                    className="text-gray-800 dark:text-gray-200 cursor-pointer">
                    {userDetails.following?.length || 0} Following
                  </span>
                </div>
              </div>
              <div className="mt-4  flex items-center text-center align-middle justify-center ">
                {isMutualFollower ? (
                  <p className="text-green-500">
                    Following each other since {formatDate(followDate)}
                  </p>
                ) : isFollower ? (
                  <p className="text-green-500">You are following</p>
                ) : isFollowing ? (
                  <p className="text-green-500">Following you</p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-4 items-center align-middle justify-center">
            {userDetails.isPrivate ? (
              <>
                {!isFollower && !iRequestedHim && (
                  <button
                    onClick={() =>
                      handleFollowUser(userDetails._id, userDetails.username)
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Send Follow Request
                  </button>
                )}
                {!isFollower && iRequestedHim && (
                  <button
                    onClick={() =>
                      handleOnCancelRequest(
                        userDetails._id,
                        userDetails.username
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel Request
                  </button>
                )}
                {heRequestedMe && !iRequestedHim && (
                  <>
                    <button
                      onClick={() =>
                        handleAcceptUserRequest(
                          userDetails._id,
                          userDetails.username
                        )
                      }
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Accept Request
                    </button>
                    <button
                      onClick={() =>
                        handleRejectUserRequest(
                          userDetails._id,
                          userDetails.username
                        )
                      }
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Reject Request
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {!isFollower && (
                  <button
                    onClick={() =>
                      handleFollowUser(userDetails._id, userDetails.username)
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Follow
                  </button>
                )}
              </>
            )}
            {isFollower && (
              <button
                onClick={() =>
                  handleOnUnfollowUser(userDetails._id, userDetails.username)
                }
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Unfollow
              </button>
            )}
            <div className="relative">
              <button
                onClick={toggleMoreOptions}
                className="bg-slate-800 p-2 rounded-lg text-white font-bold relative">
                <FiMoreVertical />
              </button>
              {showMoreOptions && (
                <div className="absolute mt-4 right-0 p-1 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg z-10">
                  {currentUser.blockedUsers?.includes(userDetails._id) ? (
                    <button
                      onClick={() => handleUnBlockUser(userDetails._id)}
                      className="block w-full text-left py-2 px-4 rounded-lg bg-slate-300 dark:bg-slate-900 text-black dark:text-white mb-2">
                      Unblock User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(userDetails._id)}
                      className="block w-full text-left py-2 px-4 rounded-lg bg-slate-300 dark:bg-slate-900 text-black dark:text-white mb-2">
                      Block User
                    </button>
                  )}

                  <button className="block w-full text-left py-2 px-4 rounded-lg bg-slate-300 dark:bg-slate-900 text-black dark:text-white mb-2">
                    Share Profile
                  </button>
                  <button className="block w-full text-left py-2 px-4 rounded-lg  bg-slate-300 dark:bg-slate-900 text-black dark:text-white">
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!currentUser.blockedUsers?.includes(userDetails._id) ? (
          <div className="p-2">
            {!userDetails.isPrivate ||
            (userDetails.followers &&
              userDetails.followers.some(
                follower => follower.userId === currentUser._id
              )) ? (
              <div>
                <div>
                  <HighlightsDisplay username={username} />
                </div>

                <div className="flex flex-col md:flex-row justify-center px-8 py-2 mt-2 rounded-lg shadow-lg gap-4">
                  {sections.map(section => (
                    <button
                      key={section}
                      className={`p-3 rounded-lg border-2 font-bold ${
                        activeSection === section
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-slate-300 text-black dark:text-white dark:bg-slate-900 border-red-500"
                      }`}
                      onClick={() => setActiveSection(section)}>
                      {section}
                    </button>
                  ))}
                </div>
                <div>{renderActiveSection()}</div>
              </div>
            ) : (
              <div className=" bg-slate-700 p-2 dark:bg-slate-900 font-bold text-lg rounded-lg  flex items-center text-center align-middle justify-center">
                Can't view profile, please send friend request to view full
                profile
              </div>
            )}
          </div>
        ) : (
          <h1 className="p-3 text-center">
            You have blocked the user, Unblock to view profile
          </h1>
        )}
        <Modal
          isOpen={showFollowersModal}
          onClose={handleCloseFollowersModal}
          title="Followers"
          users={userDetails.followers}
        />
        <Modal
          isOpen={showFollowingModal}
          onClose={handleCloseFollowingModal}
          title="Following"
          users={userDetails.following}
        />
      </div>
    </main>
  );
};

export default ProfilePageIndividualComponent;
