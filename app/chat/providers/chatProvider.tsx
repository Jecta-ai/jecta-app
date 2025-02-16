"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createChatIfNotExists, createMessage } from "../services/userMessage";
import type { Chat } from "../services/types";
import type { ChatMessage } from "../types";

type ChatContextType = {
  chat: Chat | null;
  createChat: (injectiveAddress: string) => Promise<void>;
  messageHistory: ChatMessage[];
  setMessageHistory: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  const [senderId, setSenderId] = useState<string | null>(null);

  const createChat = async (injectiveAddress: string) => {
    const { id, user1Id, user2Id } = await createChatIfNotExists(injectiveAddress, "system");

    setChat({ id, user1Id, user2Id });
    setSenderId(user1Id);
  };

  const addMessage = async (message: ChatMessage) => {
    console.log("addMessage -> senderId:", senderId);
    console.log("addMessage -> chat:", chat);
    if (!chat?.id || !senderId) {
      console.error("Chat or senderId not found");
      return;
    }
    const res = await createMessage(chat.id, senderId, message);
    console.log("addMessage -> res:", res);
    setMessageHistory((prev) => [...prev, message]);
  };

  const addMessages = (messages: ChatMessage[]) => {
    setMessageHistory((prev) => [...prev, ...messages]);
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        createChat,
        messageHistory,
        setMessageHistory,
        addMessage,
        addMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};

export { ChatProvider, useChat };
