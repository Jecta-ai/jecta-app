"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createChatIfNotExists, createMessage } from "../services/userMessage";
import type { Chat } from "../services/types";
import type { ChatMessage } from "../types";

type ChatContextType = {
  chat: Chat | null;
  createChat: (injectiveAddress: string, userMessage: ChatMessage) => Promise<{ id: any; title: any; ai_id: any; user_id: any }>;
  messageHistory: ChatMessage[];
  setMessageHistory: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addMessage: (message: ChatMessage, updatedChat?: Chat) => void;
  addMessages: (messages: ChatMessage[], updatedChat?: Chat) => void;
  setCurrentChat: (id: any,title: any,aiId: any,userId: any) => void;
};


const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  const [chatVersion, setChatVersion] = useState(0);
  useEffect(() => {
    console.log("🚀 Chat state successfully updated:", chat);
  }, [chat]);
  const setCurrentChat = (id: any, title: any, ai_id: any, user_id: any) => {
    setChat({ id, title, ai_id, user_id });
  
    // 🚀 Force a re-render
    setChatVersion((prev) => prev + 1);
  };
  

  const createChat = async (injectiveAddress: string, userMessage: ChatMessage) => {
    try {
      const { id, title, ai_id, user_id } = await createChatIfNotExists(injectiveAddress, "system", userMessage.text);
  
      if (!id || !user_id) {
        throw new Error("Failed to create chat");
      }
      
      setChat({ id, title, ai_id, user_id });
      
      
  
      return { id:id, title:title, ai_id:ai_id, user_id:user_id }; 
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error; 
    }
  };
  

  const addMessage = async (message: ChatMessage, updatedChat?: Chat) => {
    console.log("addMessage -> message:", message);
    
    const chatToUse = updatedChat || chat;
    console.log("Updated chat state inside addMessage:", chatToUse);
  
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
    console.log("addMessages -> messages:", messages);
    
    const chatToUse = updatedChat || chat;
    console.log("Updated chat state inside addMessages:", chatToUse);
  
    if (!chatToUse?.id || (!chatToUse.ai_id && !chatToUse.user_id)) {
      console.error("addMessages --> Chat or senderId not found", chatToUse);
      return;
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
}

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};

export { ChatProvider, useChat };
