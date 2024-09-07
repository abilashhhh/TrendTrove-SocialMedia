import React, { useState, useEffect } from "react";
import { useSocketContext } from "../../../Context/SocketContext";
import { useDispatch } from "react-redux";
import { MdOutlineCallEnd } from "react-icons/md";
import { endCall } from "../../../Redux/ChatAuthSlice/chatSlice";
import { generateZegoToken } from "../../../API/Chat/chat";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import useUserDetails from "../../../Hooks/useUserDetails";

interface ContainerProps {
  data: {
    roomId: any;
    type: string;
    _id: string;
    id: string;
    username: string;
    dp: string;
    callType: "video" | "voice";
  };
}

const Container: React.FC<ContainerProps> = ({ data }) => {
  const dispatch = useDispatch();
  const currentUser = useUserDetails();
  const { socket } = useSocketContext();
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [zgVar, setZgVar] = useState<ZegoExpressEngine | undefined>(undefined);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(undefined);
  const [publishStream, setPublishStream] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.type === "out-going") {
      socket?.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data, socket]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const result = await generateZegoToken();
        const returnedToken = result?.generateZegoTokenResult;
        setToken(returnedToken);
      } catch (error) {
        console.error("Error in getToken:", error);
        alert("Failed to generate token");
      }
    };
    if (callAccepted) {
      getToken();
    }
  }, [callAccepted]);

  useEffect(() => {
    const appId = parseInt(import.meta.env.VITE_ZEGO_CLOUD_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_CLOUD_SERVER_SECRET;

    const startCall = async () => {
      setLoading(true);
      try {
        const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
        const zg = new ZegoExpressEngine(appId, serverSecret);
        setZgVar(zg);

        zg?.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
          if (updateType === "ADD") {
            const rmVideo = document.getElementById("remote-video");
            const vd = document.createElement(data.callType === "video" ? "video" : "audio");
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;
            rmVideo?.appendChild(vd);
            const stream = await zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
              video: data.callType === "video",
            });
            vd.srcObject = stream;
          } else if (updateType === "DELETE" && localStream) {
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(data.roomId.toString());
            dispatch(endCall());
          }
        });

        await zg.loginRoom(data.roomId.toString(), token, {
          userID: currentUser._id.toString(),
          userName: currentUser.username,
        });

        const stream = await zg.createStream({
          camera: {
            audio: true,
            video: data.callType === "video",
          },
        });

        setLocalStream(stream);

        const localVideo = document.getElementById("local-video");
        const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
        videoElement.id = "video-local-zego";
        videoElement.className = "h-28 w-32";
        videoElement.muted = true;
        videoElement.autoplay = true;
        videoElement.playsInline = true;

        localVideo?.appendChild(videoElement);
        const td = document.getElementById("video-local-zego") as HTMLVideoElement;
        td.srcObject = stream;

        const streamID = `123${Date.now()}`;
        setPublishStream(streamID);
        zg.startPublishingStream(streamID, stream);
      } catch (error) {
        console.error("Error in startCall:", error);
        alert("Failed to start call");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      startCall();
    }
  }, [token, currentUser, data, dispatch]);

  const endCallFun = () => {
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }
    dispatch(endCall());

    if (data.callType === "video") {
      socket?.emit("reject-video-call", { from: data?._id });
      socket?.emit("reject-video-call", { from: data?.id });
    } else {
      socket?.emit("reject-voice-call", { from: data?._id });
      socket?.emit("reject-voice-call", { from: data?.id });
    }
  };

  return (
<div className="p-2 w-full bg-slate-800 flex flex-col h-screen overflow-hidden items-center justify-center text-white">
  <div className="flex flex-col gap-3 items-center">
    <span className="text-5xl">{data.username}</span>
    <span className="text-lg">
      {callAccepted ? (data.callType === "video" ? "Ongoing video call" : "Ongoing voice call") : "Calling"}
    </span>
  </div>

  {(!callAccepted || data.callType === "voice") && (
    <div className="my-24">
      <img
        src={data.dp}
        alt="avatar"
        className="rounded-full"
        height={300}
        width={300}
      />
    </div>
  )}

      {loading && (
        <div className="text-lg text-center mt-5">
      <p className="mt-4 text-lg font-semibold text-white">Loading..</p>
        </div>
      )}

      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-video"></div>
      </div>

      <div
        onClick={endCallFun}
        className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full cursor-pointer mt-5"
      >
        <MdOutlineCallEnd className="text-3xl" />
      </div>
    </div>
  );
};

export default Container;
