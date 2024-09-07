import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
  FaUsers,
  FaUserMinus,
  FaPhoneSlash,
} from "react-icons/fa";
import { useSocketContext } from "../../Context/SocketContext";
import unReadNotificationsFunction from "../../utils/unReadNotificationsFunction";
import { getAllUsers } from "../../API/User/user";
import { formatDateTime } from "../../utils/timeAgo";

const getNotificationIcon = type => {
  switch (type) {
    case "message":
      return <FaEnvelope className="text-blue-500" />;
    case "like":
      return <FaThumbsUp className="text-green-500" />;
    case "dislike":
      return <FaThumbsDown className="text-red-500" />;
    case "comment":
      return <FaComment className="text-purple-500" />;
    case "follow":
      return <FaUserPlus className="text-yellow-500" />;
    case "accept":
      return <FaUserCheck className="text-green-500" />;
    case "reject":
      return <FaUserTimes className="text-red-500" />;
    case "groupAdd":
      return <FaUsers className="text-blue-500" />;
    case "groupRemove":
      return <FaUserMinus className="text-red-500" />;
    case "missedCall":
      return <FaPhoneSlash className="text-orange-500" />;
    default:
      return null;
  }
};

const getNotificationMsg = msg => {
  switch (msg) {
    case "message":
      return "sent you a message";
    case "like":
      return "liked your post";
    case "dislike":
      return "disliked your post";
    case "comment":
      return "commented on your post";
    case "follow":
      return "sent you a follow request";
    case "accept":
      return "accepted your friend request";
    case "reject":
      return "rejected your follow request";
    case "groupAdd":
      return "added you to the group";
    case "groupRemove":
      return "removed you from the group";
    case "missedCall":
      return "tried calling you earlier.";
    default:
      return null;
  }
};

const IndividualNotifications = () => {
  const [allUsers, setAllUsers] = useState(null);
  const { notifications, markAllNotificationAsRead } = useSocketContext();

  useEffect(() => {
    getAllUsersData();
  }, []);

  const getAllUsersData = async () => {
    const allUsersData = await getAllUsers();
    if (allUsersData) {
      setAllUsers(allUsersData.user);
    }
  };

  const unreadNotifications = unReadNotificationsFunction(notifications);

  const modifiedNotifications = unreadNotifications.map(n => {
    const sender = allUsers?.find(user => user._id === n.senderId);
    return {
      ...n,
      senderName: sender?.username,
      userDp: sender?.dp,
      type: "message",
      msg: "message",
      time: formatDateTime(new Date()),
    };
  });

  const markAllAsViewed = () => {
    markAllNotificationAsRead(notifications);
  };

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <button
        onClick={markAllAsViewed}
        className="p-2  bg-slate-700 text-white rounded-lg mb-4">
        Mark all as viewed
      </button>

      {modifiedNotifications &&
        modifiedNotifications.map(notification => (
          <div
            key={notification._id}
            className={`flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg `}>
            <img
              src={notification.userDp}
              alt="User DP"
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="mr-4">{getNotificationIcon(notification.type)}</div>
            <div>
              <span className="font-bold">{notification.senderName}</span>{" "}
              {getNotificationMsg(notification.msg)}
              <div className="text-xs text-gray-500">
                {notification?.message.message}
              </div>
              <div className="text-xs text-gray-500">{notification.time}</div>
            </div>
          </div>
        ))}

      {modifiedNotifications?.length <= 0 && (
        <>
          <p>No notifications</p>
        </>
      )}
    </div>
  );
};

export default IndividualNotifications;
