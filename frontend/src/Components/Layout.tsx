import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/UserAuthSlice/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./HomePage/HomePageHeaderComponent";
import LeftSidebar from "./HomePage/HomePageLeftSidebar";
import BottomNavBar from "./HomePage/HomePageLeftSidebarMobileView";
import LoadingSpinner from "./LoadingSpinner";
import useUserDetails from "../Hooks/useUserDetails";
import LoggingOut from "./LoggingOut";
import { darkMode } from "../API/Profile/profile";
import { RootState } from "../Redux/Store/reduxStore";
import { useSocketContext } from "../Context/SocketContext";
import {
  endCall,
  setIncomingVideoCall,
  setIncomingVoiceCall,
} from "../Redux/ChatAuthSlice/chatSlice";
import IncomingVideoCall from "./Chat/CallComponents/IncomingVideoCall";
import IncomingVoiceCall from "./Chat/CallComponents/IncomingVoiceCall";
import VideoCall from "./Chat/CallComponents/VideoCall";
import VoiceCall from "./Chat/CallComponents/VoiceCall";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const currentUser = useUserDetails();
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const { videoCall, voiceCall, incomingVoiceCall, incomingVideoCall } =
    useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (currentUser.isDarkMode !== undefined) {
      setDarkMode(currentUser.isDarkMode);
    }
  }, [currentUser.isDarkMode]);

  const toggleDarkMode = async () => {
    setDarkMode(prevMode => !prevMode);
    await darkMode();
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(prevState => !prevState);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      toast.error("Logging Out");
      setTimeout(() => {
        dispatch(logout());
        setLoggingOut(false);
      }, 1000);
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Log out failed");
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleIncomingVoiceCall = ({ from, roomId, callType }) => {
      dispatch(
        setIncomingVoiceCall({
          ...from,
          roomId,
          callType,
        })
      );
    };

    const handleIncomingVideoCall = ({ from, roomId, callType }) => {
      dispatch(
        setIncomingVideoCall({
          ...from,
          roomId,
          callType,
        })
      );
    };

    const handleRejectVoiceCall = () => {
      dispatch(endCall());
    };

    const handleRejectVideoCall = () => {
      dispatch(endCall());
    };

    socket?.on("incoming-voice-call", handleIncomingVoiceCall);
    socket?.on("incoming-video-call", handleIncomingVideoCall);
    socket?.on("voice-call-rejected", handleRejectVoiceCall);
    socket?.on("video-call-rejected", handleRejectVideoCall);

    return () => {
      socket?.off("incoming-voice-call", handleIncomingVoiceCall);
      socket?.off("incoming-video-call", handleIncomingVideoCall);
      socket?.off("voice-call-rejected", handleRejectVoiceCall);
      socket?.off("video-call-rejected", handleRejectVideoCall);
    };
  }, [socket, dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (loggingOut) {
    return <LoggingOut />;
  }

  return (
    <>
      {!videoCall && !voiceCall && incomingVideoCall && <IncomingVideoCall />}
      {!voiceCall && !videoCall && incomingVoiceCall && <IncomingVoiceCall />}

      {videoCall && (
        <div className="h-full w-full max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}

      {voiceCall && (
        <div className="h-full w-full max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}

      {/* <ToastContainer /> */}
      <div className={`flex flex-col h-screen ${isDarkMode ? "dark" : ""}`}>
        <Header
          toggleLeftSidebar={toggleLeftSidebar}
          userDetails={currentUser}
        />
        <div className="flex flex-1 overflow-hidden ">
          <LeftSidebar
            isLeftSidebarOpen={isLeftSidebarOpen}
            toggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
            handleLogout={handleLogout}
          />
          {children}
        </div>
        <BottomNavBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      </div>
    </>
  );
};

export default Layout;
