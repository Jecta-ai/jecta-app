"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createChatIfNotExists, createMessage } from "../services/userMessage";
import type { Chat } from "../services/types";
import type { ChatMessage } from "../types";

type ChatContextType = {
  chat: Chat | null;
  createChat: (injectiveAddress: string, userMessage: ChatMessage) => Promise<Chat>;
  messageHistory: ChatMessage[];
  setMessageHistory: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addMessage: (message: ChatMessage, updatedChat?: Chat) => void;
  addMessages: (messages: ChatMessage[], updatedChat?: Chat) => void;
  setCurrentChat: (chat: Chat) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);

  const setCurrentChat = (chat: Chat) => {
    setChat(chat);
  };

  const createChat = async (injectiveAddress: string, userMessage: ChatMessage) => {
    try {
      const { id, title, ai_id, user_id } = await createChatIfNotExists(
        injectiveAddress,
        "system",
        userMessage.text
      );

      if (!id || !user_id) {
        throw new Error("Failed to create chat");
      }

      setChat({ id, title, ai_id, user_id });

      return { id: id, title: title, ai_id: ai_id, user_id: user_id };
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  };

  const addMessage = async (message: ChatMessage, updatedChat?: Chat) => {
    const chatToUse = updatedChat || chat;

    if (!chatToUse?.id || (!chatToUse.ai_id && !chatToUse.user_id)) {
      console.error("Chat or senderId not found", chatToUse);
      return;
    }

    if (message.sender === "ai" && chatToUse.ai_id) {
      await createMessage({ chatId: chatToUse.id, senderId: chatToUse.ai_id, message });
    } else if (message.sender === "user" && chatToUse.user_id) {
      await createMessage({ chatId: chatToUse.id, senderId: chatToUse.user_id, message });
    }

    setMessageHistory((prev) => [...prev, message]);
  };

  const addMessages = async (messages: ChatMessage[], updatedChat?: Chat) => {
    const chatToUse = updatedChat || chat;

    if (!chatToUse?.id || (!chatToUse.ai_id && !chatToUse.user_id)) {
      throw new Error("Chat or senderId not found");
    }

    if (Array.isArray(messages)) {
      for (const message of messages) {
        if (message.sender === "ai" && chatToUse.ai_id) {
          await addMessage(message, chatToUse); // Pass updated chat state
        } else if (message.sender === "user" && chatToUse.user_id) {
          await addMessage(message, chatToUse);
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
        setCurrentChat,
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
