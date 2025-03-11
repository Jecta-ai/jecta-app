import { txSearch } from "../tools/txSearch";
import { createChatMessage } from "@/app/utils";

export async function searchTxHash(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
  const txHash = extractTxHashFromMessage(message);

  if (!txHash) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ No valid Injective transaction hash found in your message.",
        type: "error",
        intent: intent,
      })
    );
    return;
  }

  addToChat(
    createChatMessage({
      sender: "ai",
      text: `🔍 Searching for transaction ${txHash}...`,
      type: "loading",
      intent: intent,
    })
  );

  const txDetails = await txSearch.execute(txHash, chatHistory);

  addToChat(createChatMessage({ sender: "ai", text: txDetails, type: "success", intent: intent }));
}
export const extractTxHashFromMessage = (message: string) => {
  const txHashRegex = /\b[A-Fa-f0-9]{64}\b/; 
  const match = message.match(txHashRegex);
  return match ? match[0] : null;
};
