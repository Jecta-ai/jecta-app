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
      text: `Calling Venicia for making research on web...`,
      type: "loading",
      intent: intent,
    })
  );

  const summary = await fetchInjectiveUpdates(message);

  addMessage(
    createChatMessage({
      sender: "venicia",
      text: "Looking for the various blogs & socials for Injective news research with Venice API ...",
      type: "loading",
      intent: intent,
    })
  );

  addMessage(
    createChatMessage({
      sender: "venicia",
      text: summary,
      type: "success",
      intent: intent,
    })
  );
}
