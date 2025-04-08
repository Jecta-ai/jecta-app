"use client";
import { createContext, useContext, useState } from "react";
import { createChatIfNotExists, createMessage } from "../services/userMessage";
import type { Chat } from "../services/types";
import type { ChatMessage } from "../types";

type ChatContextType = {
  allChats: Chat[];
  setAllChats: (chats: Chat[]) => void;
  currentChat: Chat | null;
  createChat: (
    injectiveAddress: string,
    userMessage: ChatMessage,
    token: string,
    senderId: string
  ) => Promise<Chat>;
  messageHistory: ChatMessage[];
  setMessageHistory: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addMessage: (token: string, message: ChatMessage, updatedChat?: Chat) => void;
  addMessages: (token: string, messages: ChatMessage[], updatedChat?: Chat) => void;
  setCurrentChat: (chat: Chat | null) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);

  const createChat = async (
    injectiveAddress: string,
    userMessage: ChatMessage,
    token: string,
    senderId: string
  ) => {
    try {
      const { id, title, ai_id, user_id } = await createChatIfNotExists({
        injectiveAddress,
        senderId: senderId,
        userMessage: userMessage.text || "",
        token,
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

  const addMessage = async (token: string, message: ChatMessage, newChat?: Chat) => {
    const chatToUse = newChat ? newChat : currentChat;
    setMessageHistory((prev) => [...prev, message]);

    if (!chatToUse || (!chatToUse?.ai_id && !chatToUse?.user_id)) {
      console.error("Chat or senderId not found", newChat);
      return;
    }

    try {
      if (message.sender === "ai" && chatToUse.ai_id) {
        createMessage({ chatId: chatToUse.id, senderId: chatToUse.ai_id, message, token });
      } else if (message.sender === "sonia" && chatToUse.ai_id) {
        createMessage({ chatId: chatToUse.id, senderId: chatToUse.ai_id, message, token });
      } else if (message.sender === "venicia" && chatToUse.ai_id) {
        createMessage({ chatId: chatToUse.id, senderId: chatToUse.ai_id, message, token });
      } else if (message.sender === "user" && chatToUse.user_id) {
        createMessage({ chatId: chatToUse.id, senderId: chatToUse.user_id, message, token });
      }
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  const addMessages = async (token: string, messages: ChatMessage[], newChat?: Chat) => {
    const chatToUse = newChat ? newChat : currentChat;
    if (!chatToUse?.id || (!chatToUse.ai_id && !chatToUse.user_id)) {
      throw new Error("Chat or senderId not found");
    }

    if (Array.isArray(messages)) {
      for (const message of messages) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (message.sender === "ai" && chatToUse.ai_id) {
          addMessage(token, message, newChat);
        } else if (message.sender === "sonia" && chatToUse.ai_id) {
          addMessage(token, message, newChat);
        } else if (message.sender === "venicia" && chatToUse.ai_id) {
          addMessage(token, message, newChat);
        } else if (message.sender === "user" && chatToUse.user_id) {
          addMessage(token, message, newChat);
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
