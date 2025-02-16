"use client";
import { createContext, useContext, useState } from "react";
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

  const createChat = async (injectiveAddress: string) => {
    const { id, aiId, userId } = await createChatIfNotExists(injectiveAddress, "system");

    setChat({ id, aiId, userId });
  };

  const addMessage = async (message: ChatMessage) => {
    console.log("addMessage -> chat:", message);

    if (!chat?.id || (!chat.aiId && !chat.userId)) {
      console.error("Chat or senderId not found");
      return;
    }
    if (message.sender === "ai" && chat.aiId) {
      await createMessage({ chatId: chat.id, senderId: chat.aiId, message });
    } else if (message.sender === "user" && chat.userId) {
      await createMessage({ chatId: chat.id, senderId: chat.userId, message });
    }
    setMessageHistory((prev) => [...prev, message]);
  };

  const addMessages = async (messages: ChatMessage[]) => {
    console.log("addMessages -> messages:", messages);
    if (!chat?.id || (!chat.aiId && !chat.userId)) {
      console.error("addMessages --> Chat or senderId not found");
      return;
    }
    if (Array.isArray(messages)) {
      for (const message of messages) {
        if (message.sender === "ai" && chat.aiId) {
          await addMessage(message);
        } else if (message.sender === "user" && chat.userId) {
          await addMessage(message);
        }
      }
    }
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
