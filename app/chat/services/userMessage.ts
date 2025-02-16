"use server";
import type { ChatMessage } from "../types";
import type { Chat } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Default to localhost if not set

export const fetchResponse = async (
  userMessage: string,
  chatHistory: ChatMessage[],
  injectiveAddress: string | null
) => {
  console.log("userMessage:", userMessage);
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userMessage,
      chatHistory: chatHistory,
      address: injectiveAddress,
    }),
  });

  if (!res.ok) throw new Error(`Server Error: ${res.status}`);

  const data = await res.json();
  if (data.error) throw new Error(data.error);

  return data;
};

export const createChatIfNotExists = async (injectiveAddress: string, senderId: string) => {
  console.log("createChatIfNotExists -> senderId:", senderId);
  console.log("createChatIfNotExists -> injectiveAddress:", injectiveAddress);
  const res = await fetch(`${baseUrl}/api/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ injectiveAddress, senderId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create chat: ${res.statusText}`);
  }

  const { data } = await res.json();

  return { id: data.id, user1Id: data.user1_id, user2Id: data.user2_id };
};

export const crateInjectiveIfNotExists = async (injectiveAddress: string) => {
  const res = await fetch(`${baseUrl}/api/db/createInjectiveIfNotExists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ injectiveAddress }),
  });
  const data = await res.json();
  return data;
};

export const createMessage = async (chatId: string, senderId: string, message: object) => {
  const res = await fetch(`${baseUrl}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, senderId, message }),
  });
  const data = await res.json();
  return data;
};
