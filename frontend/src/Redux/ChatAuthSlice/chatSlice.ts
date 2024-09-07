import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  voiceCall?: any;
  videoCall?: any;
  incomingVideoCall?: any;
  incomingVoiceCall?: any;
}

const initialState: ChatState = {
  voiceCall: undefined,
  videoCall: undefined,
  incomingVideoCall: undefined,
  incomingVoiceCall: undefined,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setVideoCall: (state, action: PayloadAction<any>) => {
      state.videoCall = action.payload;
    },
    setVoiceCall: (state, action: PayloadAction<any>) => {
      state.voiceCall = action.payload;
    },
    setIncomingVoiceCall: (state, action: PayloadAction<any>) => {
      state.incomingVoiceCall = action.payload;
    },
    setIncomingVideoCall: (state, action: PayloadAction<any>) => {
      state.incomingVideoCall = action.payload;
    },
    endCall: state => {
      state.voiceCall = undefined;
      state.videoCall = undefined;
      state.incomingVideoCall = undefined;
      state.incomingVoiceCall = undefined;
    },
  },
});

export const {
  setVideoCall,
  setVoiceCall,
  setIncomingVoiceCall,
  setIncomingVideoCall,
  endCall,
} = chatSlice.actions;
export default chatSlice.reducer;
