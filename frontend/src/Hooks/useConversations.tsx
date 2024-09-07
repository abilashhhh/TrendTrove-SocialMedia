 
import { create } from "zustand";
import { Message } from "../Types/userProfile";
import { User } from "firebase/auth";

interface ConversationState {
  selectedConversation: User | null;
  setSelectedConversation: (selectedConversation: User | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
