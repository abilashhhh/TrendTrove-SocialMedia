import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faImage, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {
  cancelFollowRequest,
  followUser,
  unfollowUser,
  acceptFollowRequests,
  rejectFollowRequests,
} from "../../utils/userRequestsHelper";
import Modal from "../../utils/Modal";
import { useNavigate } from "react-router-dom";
import { getPostsLengthOfTheUser } from "../../API/Post/post";

interface UserInfo {
  coverPhoto: string;
  _id: string;
  username: string;
  name: string;
  dp: string;
  isPrivate: boolean;
  isPremium: boolean;
  bio: string;
  createdAt?: string;
  posts?: any[];
  followers: { userId: string; username: string; followedAt: string }[];
  following?: { userId: string; username: string; followedAt: string }[];
  requestsForMe?: { userId: string; username: string; followedAt: string }[];
  requestedByMe?: { userId: string; username: string; followedAt: string }[];
}

interface ProfileProps {
  userDetails: UserInfo;
  currentUser: UserInfo;
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

const ProfileSectionFriendsPage: React.FC<ProfileProps> = ({
  userDetails,
  currentUser,
}) => {
  const navigate = useNavigate();
  console.log(
    "User details reeceived in ProfileSectionFriendsPage : ",
    userDetails
  );

  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [iRequestedHim, setRequestsIMade] = useState<boolean>(false);
  const [heRequestedMe, setHeRequestedMe] = useState<boolean>(false);
  const [isMutualFollower, setIsMutualFollower] = useState<boolean>(false);
  const [followDate, setFollowDate] = useState<string | undefined>("");

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

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
    const youAreFollowingHim = userDetails.followers.find(
      f => f.userId === currentUser._id
    );

    const heIsFollowingYou = userDetails?.following?.find(
      f => f.userId === currentUser._id
    );

    const requestedByMe = userDetails.requestsForMe?.find(
      r => r.userId === currentUser._id
    );

    const requestsForMe = userDetails.requestedByMe?.find(
      r => r.userId === currentUser._id
    );

    const mutualFollower =
      userDetails.followers?.find(f => f.userId === currentUser._id) &&
      userDetails.following?.find(r => r.userId === currentUser._id);

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

  const [postCount, setPostCount] = useState(0);

  const fetchPostCount = async () => {
    try {
      let username;
      console.log("userDetails.username : ", userDetails.username);
      if (userDetails && userDetails.username) {
        username = userDetails.username;
      }
      const count = await getPostsLengthOfTheUser(username);
      // console.log(count.data)
      setPostCount(count.data);
    } catch (error) {
      console.error("Error fetching post count:", error);
    }
  };

  useEffect(() => {
    fetchPostCount();
  });

  return (
    <div className="mx-auto h-screen rounded-lg shadow-lg bg-slate-200 dark:bg-slate-800 overflow-auto no-scrollbar">
      <div className="bg-cover bg-center h-72">
        <img
          src={userDetails?.coverPhoto || "/"}
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
              {userDetails.username} {userDetails.isPremium ?    <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-blue-500"
              /> :""}
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
                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-600" />
                <span
                  onClick={handleOpenFollowersModal}
                  className="text-gray-800 dark:text-gray-200 cursor-pointer">
                  {userDetails.followers.length} Followers
                </span>
              </div>
              <div className="inline-flex items-center ml-4">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-600" />
                <span
                  onClick={handleOpenFollowingModal}
                  className="text-gray-800 dark:text-gray-200 cursor-pointer">
                  {userDetails.following?.length || 0} Following
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center align-middle justify-center">
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
                    handleOnCancelRequest(userDetails._id, userDetails.username)
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
          <button
            type="button"
            onClick={() => navigate(`/profiles/${userDetails.username}`)}
            className="bg-blue-500 hover:bg-blue-700 ml-5 text-white font-bold py-2 px-4   rounded focus:outline-none focus:shadow-outline ">
            View Full Profile
          </button>
        </div>
      </div>

      <Modal
        isOpen={showFollowersModal}
        onClose={handleCloseFollowersModal}
        title="Followers"
        users={userDetails.followers || []}
      />
      <Modal
        isOpen={showFollowingModal}
        onClose={handleCloseFollowingModal}
        title="Following"
        users={userDetails.following || []}
      />
    </div>
  );
};

export default ProfileSectionFriendsPage;
