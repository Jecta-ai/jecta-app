
"use server"
import type { ChatMessage } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const fetchResponse = async (
  userMessage: string,
  chatHistory: ChatMessage[],
  injectiveAddress: string | null,
  token:string
) => {
  

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Attach the token if available
    },
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
