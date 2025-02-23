"use server";
import { createTitleFromMessage } from "@/ai/titleManager";
import type { ChatMessage } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Default to localhost if not set

export const fetchResponse = async (
  userMessage: string,
  chatHistory: ChatMessage[],
  injectiveAddress: string | null
) => {
  console.log("userMessage:", userMessage);
  const res = await fetch(`${baseUrl}/api/chats`, {
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

export const createChatIfNotExists = async ({
  injectiveAddress,
  senderId,
  userMessage,
}: {
  injectiveAddress: string;
  senderId: string;
  userMessage: string;
}) => {
  const title = await createTitleFromMessage(userMessage);
  console.log(" title:", title);
  const res = await fetch(`${baseUrl}/api/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, injectiveAddress, senderId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create chat: ${res.statusText}`);
  }

  const { data } = await res.json();

  return { id: data.id, title: data.title, ai_id: data.ai_id, user_id: data.user_id };
};

export const crateInjectiveIfNotExists = async (injectiveAddress: string) => {
  const res = await fetch(`${baseUrl}/api/db`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "createInjective", injectiveAddress }),
  });
  console.log(" crateInjectiveIfNotExists -> res:", res);
  const data = await res.json();
  return data;
};

export const createMessage = async ({
  chatId,
  senderId,
  message,
}: {
  chatId: string;
  senderId: string;
  message: object;
}) => {
  const res = await fetch(`${baseUrl}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, senderId, message }),
  });
  console.log(" res:", res);
  const data = await res.json();
  return data;
};
