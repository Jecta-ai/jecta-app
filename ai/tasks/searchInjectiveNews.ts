import { createChatMessage } from "@/app/utils";
import type { ChatMessage } from "@/app/types";
import { fetchInjectiveUpdates } from "../venice";

export async function searchInjectiveNews(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
  const addMessage = (msg: ChatMessage) => {
    addToChat(msg);
  };
  addMessage(
    createChatMessage({
      sender: "ai",
      text: `🔍 Fetching the latest news from Web using Venice API...`,
      type: "loading",
      intent: intent,
    })
  );

  const summary = await fetchInjectiveUpdates(message);
  console.log(summary)

  addMessage(
    createChatMessage({
      sender: "ai",
      text: summary,
      type: "success",
      intent: intent,
    })
  );
}
