import { fetchInjectiveTweets } from "../tools/twitterSearch";
import { createChatMessage } from "@/app/chat/utils";
import type { ChatMessage } from "@/app/chat/types";

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
      text: `🔍 Fetching the latest 5 tweets from Injective's official Twitter...`,
      type: "loading",
      intent: intent,
    })
  );

  const summary = await fetchInjectiveTweets();

  addMessage(
    createChatMessage({
      sender: "ai",
      text: summary,
      type: "success",
      intent: intent,
    })
  );
}
