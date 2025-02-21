"use client";
import { createContext, useContext, useState } from "react";
import { createChatIfNotExists, createMessage } from "../services/userMessage";
import type { Chat } from "../services/types";
import type { ChatMessage } from "../types";

type ChatContextType = {
  allChats: Chat[];
  setAllChats: (chats: Chat[]) => void;
  currentChat: Chat | null;
  createChat: (injectiveAddress: string, userMessage: ChatMessage) => Promise<Chat>;
  messageHistory: ChatMessage[];
  setMessageHistory: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addMessage: (message: ChatMessage, updatedChat?: Chat) => void;
  addMessages: (messages: ChatMessage[], updatedChat?: Chat) => void;
  setCurrentChat: (chat: Chat | null) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);

  const createChat = async (injectiveAddress: string, userMessage: ChatMessage) => {
    try {
      const { id, title, ai_id, user_id } = await createChatIfNotExists({
        injectiveAddress,
        senderId: "system",
        userMessage: userMessage.text,
      });

      if (!id || !user_id) {
        throw new Error("Failed to create chat");
      }

      setCurrentChat({ id, title, ai_id, user_id });

      return { id: id, title: title, ai_id: ai_id, user_id: user_id };
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  };

  const addMessage = async (message: ChatMessage, newChat?: Chat) => {
    const chatToUse = newChat ? newChat : currentChat;
    if (!chatToUse || (!chatToUse?.ai_id && !chatToUse?.user_id)) {
      console.error("Chat or senderId not found", newChat);
      return;
    }

    if (message.sender === "ai" && chatToUse.ai_id) {
      await createMessage({ chatId: chatToUse.id, senderId: chatToUse.ai_id, message });
    } else if (message.sender === "user" && chatToUse.user_id) {
      await createMessage({ chatId: chatToUse.id, senderId: chatToUse.user_id, message });
    }

    setMessageHistory((prev) => [...prev, message]);
  };

  const addMessages = async (messages: ChatMessage[], newChat?: Chat) => {
    const chatToUse = newChat ? newChat : currentChat;
    if (!chatToUse?.id || (!chatToUse.ai_id && !chatToUse.user_id)) {
      throw new Error("Chat or senderId not found");
    }

    if (Array.isArray(messages)) {
      for (const message of messages) {
        if (message.sender === "ai" && chatToUse.ai_id) {
          await addMessage(message, newChat); // Pass updated chat state
        } else if (message.sender === "user" && chatToUse.user_id) {
          await addMessage(message, newChat);
        }
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        allChats,
        setAllChats,
        currentChat,
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
