import type { ChatMessage } from "../types";

export const fetchResponse = async (
  userMessage: string,
  chatHistory: ChatMessage[],
  injectiveAddress: string | null
) => {
  const res = await fetch("/api/chat", {
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
