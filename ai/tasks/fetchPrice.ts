import { createChatMessage } from "@/app/utils";
import { fetchTokenPrice } from "../tools/fetchTokenPrice";

export async function fetchPrice(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
  const token = getTokenFromMessage(message);
  if (!token) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ Token couldn't be found. Please write the ticker as INJ or ATOM.",
        type: "error",
        intent: intent,
      })
    );
    return;
  }

  addToChat(
    createChatMessage({
      sender: "ai",
      text: `🔍 Fetching ${token} price from Coinhall...`,
      type: "loading",
      intent: intent,
    })
  );

  const priceInfo = await fetchTokenPrice(token);
  addToChat(createChatMessage({ sender: "ai", text: priceInfo, type: "success", intent: intent }));
}

export const getTokenFromMessage = (userMessage: string) => {
  const tokenRegex = /\b([A-Z]{2,10})\b/;
  const match = userMessage.match(tokenRegex);
  return match ? match[1] : null;
};
