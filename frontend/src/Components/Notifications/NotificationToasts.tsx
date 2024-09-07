import React, { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../../Context/SocketContext";
import { getAllUsers } from "../../API/User/user";
import unReadNotificationsFunction from "../../utils/unReadNotificationsFunction";
import { ToastContainer, toast } from "react-toastify";
import { User } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";

const NotificationToasts: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const { notifications } = useSocketContext();
  const shownNotifications = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const allUsersData = await getAllUsers();
        if (allUsersData) {
          setAllUsers(allUsersData.user);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (allUsers && notifications.length > 0) {
      const unreadNotifications = unReadNotificationsFunction(notifications);
      unreadNotifications.forEach(n => {
        if (!shownNotifications.current.has(n.message.message)) {
          toast.info("You have some new messages");
          shownNotifications.current.add(n.message.message);
        }
      });
    }
  }, [notifications, allUsers]);

  return <>
  {/* <ToastContainer  className="tex-blue-400"/> */}
  </>;
};

export default NotificationToasts;
