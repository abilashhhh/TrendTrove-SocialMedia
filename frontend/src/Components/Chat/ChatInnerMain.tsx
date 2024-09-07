import React, { useEffect } from "react";
import SendMessageInput from "./Components/SendMessageInput";
import ChatIndividualTopPortion from "./Components/ChatIndividualTopPortion";
import ChatCenter from "./ChatCenter";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../Redux/Store/reduxStore";
// import VoiceCall from "./CallComponents/VoiceCall";
// import VideoCall from "./CallComponents/VideoCall";
// import { useSocketContext } from "../../Context/SocketContext";
// import {
//   endCall,
//   setIncomingVideoCall,
//   setIncomingVoiceCall,
// } from "../../Redux/ChatAuthSlice/chatSlice";
// import IncomingVideoCall from "./CallComponents/IncomingVideoCall";
// import IncomingVoiceCall from "./CallComponents/IncomingVoiceCall";

const ChatInnerMain: React.FC = () => {
  // const dispatch = useDispatch();
  // const { socket } = useSocketContext();
  // const { videoCall, voiceCall, incomingVoiceCall, incomingVideoCall } =
  //   useSelector((state: RootState) => state.chat);

  // useEffect(() => {
  //   const handleIncomingVoiceCall = ({ from, roomId, callType }) => {
  //     dispatch(
  //       setIncomingVoiceCall({
  //         ...from,
  //         roomId,
  //         callType,
  //       })
  //     );
  //   };

  //   const handleIncomingVideoCall = ({ from, roomId, callType }) => {
  //     console.log("Incoming video call from:", from);
  //     dispatch(
  //       setIncomingVideoCall({
  //         ...from,
  //         roomId,
  //         callType,
  //       })
  //     );
  //   };

  //   const handleRejectVoiceCall = () => {
  //     dispatch(endCall());
  //   };

  //   const handleRejectVideoCall = () => {
  //     dispatch(endCall());
  //   };

  //   socket?.on("incoming-voice-call", handleIncomingVoiceCall);
  //   socket?.on("incoming-video-call", handleIncomingVideoCall);
  //   socket?.on("voice-call-rejected", handleRejectVoiceCall);
  //   socket?.on("video-call-rejected", handleRejectVideoCall);

  //   return () => {
  //     socket?.off("incoming-voice-call", handleIncomingVoiceCall);
  //     socket?.off("incoming-video-call", handleIncomingVideoCall);
  //     socket?.off("voice-call-rejected", handleRejectVoiceCall);
  //     socket?.off("video-call-rejected", handleRejectVideoCall);
  //   };
  // }, [socket, dispatch]);

  return (
    <>
      {/* {!videoCall && !voiceCall && incomingVideoCall && <IncomingVideoCall />}
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
      )} */}

      {/* {!videoCall && !voiceCall && ( */}
        <div className="flex-grow p-1 lg:p-2 h-full bg-gray-200 dark:bg-gray-800 rounded-lg flex flex-col">
          <ChatIndividualTopPortion />
          <ChatCenter />
          <SendMessageInput />
        </div>
      {/* )} */}
    </>
  );
};

export default ChatInnerMain;
