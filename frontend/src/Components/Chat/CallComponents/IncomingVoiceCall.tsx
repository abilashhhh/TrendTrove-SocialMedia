import React from "react";
import { RootState } from "../../../Redux/Store/reduxStore";
import { useDispatch, useSelector } from "react-redux";
import { endCall, setIncomingVoiceCall, setVoiceCall } from "../../../Redux/ChatAuthSlice/chatSlice";  
import { useSocketContext } from "../../../Context/SocketContext"; 
const IncomingVoiceCall = () => {
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const { incomingVoiceCall } = useSelector((state: RootState) => state.chat);

  
 
  const acceptCall = () => {
    dispatch(setVoiceCall({...incomingVoiceCall ,type:"in-coming" }))
    socket?.emit("accept-incoming-call", { id: incomingVoiceCall.id });
    dispatch(setIncomingVoiceCall({incomingVoiceCall:undefined}))
  };

  const rejectCall = () => {
    socket?.emit("reject-voice-call", { from: incomingVoiceCall.id });
    dispatch(endCall());
  };


  return (
    <div className="fixed bottom-28 right-6 z-50 flex items-center justify-start p-4 text-white bg-gray-800 rounded-lg shadow-lg border-2 border-gray-700">
      <img
        src={incomingVoiceCall.dp}
        alt="avatar"
        width={70}
        height={70}
        className="rounded-full mr-4"
      />
      <div className="flex-grow">
        <div className="font-bold">{incomingVoiceCall.username}</div>
        <div className="text-xs">Incoming Voice Call</div>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          className="bg-red-500 p-2 rounded-full focus:outline-none hover:bg-red-700"
          onClick={rejectCall}
        >
          Reject
        </button>
        <button
          className="bg-green-500 p-2 rounded-full focus:outline-none hover:bg-green-700"
          onClick={acceptCall}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default IncomingVoiceCall;
