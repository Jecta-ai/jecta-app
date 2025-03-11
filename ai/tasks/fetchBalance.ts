import { createChatMessage } from "@/app/utils";
import { queryOpenRouter } from "../ai";
import { fetchInjectiveBalance } from "../tools/fetchBalances";

export async function fetchBalance(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
  if (!address) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "Please connect your wallet first.",
        type: "text",
        intent: intent,
      })
    );
    return;
  }

  const balances = await fetchInjectiveBalance(address);

  addToChat(
    createChatMessage({
      sender: "ai",
      text: "🔍 Searching for your Bank Balances...",
      type: "text",
      intent: intent,
    })
  );

  if (!balances?.bank.length || !balances.bank) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ No balances found in your Bank Balance.",
        type: "text",
        intent: intent,
      })
    );
    return;
  }

  addToChat(
    createChatMessage({
      sender: "ai",
      type: "balance",
      balances: balances.bank
        .filter((token) => token !== undefined) 
        .map((token) => ({
          symbol: token.symbol,
          balance: token.balance.toString(),
          logo: token.logo,
          address: token.address,
        })),
      intent: intent,
    })
  );

  addToChat(
    createChatMessage({
      sender: "ai",
      text: "🔍 Searching for your CW20 Balances...",
      type: "text",
      intent: intent,
    })
  );

  if (!balances?.cw20.length || !balances.cw20) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ No balances found in your CW20 Balance.",
        type: "text",
        intent: intent,
      })
    );
    return;
  }

 

  addToChat(
    createChatMessage({
      sender: "ai",
      type: "balance", 
      balances: balances.cw20
        .filter((token) => token !== undefined)
        .map((token) => ({
          symbol: token.symbol,
          balance: token.balance.toString(),
          logo: token.logo,
          address: token.address, 
        })),
      intent: intent,
    })
  );

  const finalResponse = await queryOpenRouter(
    "Ask user what you can help more if needed.",
    chatHistory
  );
  addToChat(createChatMessage({ sender: "ai", text: finalResponse, type: "text", intent: intent }));
}
