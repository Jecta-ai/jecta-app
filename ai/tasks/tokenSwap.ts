import { createChatMessage } from "@/app/utils";
import { extractSwapDetails, fetchSwapDetails } from "../tools/executeSwap";

export async function tokenSwap(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
  const currentIntent = intent;
  if (!address) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ Please connect your wallet first.",
        type: "text",
      })
    );
    return;
  }
  addToChat(
    createChatMessage({
      sender: "ai",
      text: "🔍 Reading your prompt for Swap analysis...",
      type: "loading",
      intent: currentIntent,
    })
  );
  const { from, from_metadata, to, to_metadata, amount, status } = await extractSwapDetails(
    message
  );
  if (status == "failed") {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ Prompt details are unclear. Please send me an info with basic prompt like this. Example : 'I want to swap 10 INJ to USDT' ",
        type: "error",
        intent: currentIntent,
      })
    );
    return;
  } else if (status == "failed_from") {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: `❌ Failed to get token metadata : ${from} . Please ensure that this token is available on Injective.`,
        type: "error",
        intent: currentIntent,
      })
    );
    return;
  } else if (status == "failed_to") {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: `❌ Failed to get token metadata : ${to} . Please ensure that this token is available on Injective.`,
        type: "error",
        intent: currentIntent,
      })
    );
    return;
  } else if (status == "success") {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: `🔍 Searching for the best route on Coinhall for ${from}/${to}...`,
        type: "text",
        intent: currentIntent,
      })
    );
    const { msg, contract_input } = await fetchSwapDetails(from_metadata, amount, to_metadata);
    addToChat(
      createChatMessage({
        sender: "ai",
        text: msg,
        type: "swap",
        intent: currentIntent,
        contractInput: contract_input,
      })
    );
  }
}
