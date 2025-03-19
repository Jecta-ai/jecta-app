import { createChatMessage } from "@/app/utils";
import { queryOpenRouter } from "../ai";
import { fetchInjectiveBalance } from "../tools/fetchBalances";

export async function fetchPortfolio(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
    const injectiveAddress = extractInjectiveAddress(message)
  if (!injectiveAddress) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "Please provide the injective address better",
        type: "text",
        intent: intent,
      })
    );
    return;
  }

  const balances = await fetchInjectiveBalance(injectiveAddress);

  addToChat(
    createChatMessage({
      sender: "ai",
      text: "🔍 Searching for users Bank Balances...",
      type: "text",
      intent: intent,
    })
  );

  if (!balances?.bank.length || !balances.bank) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ No balances found in user Bank Balance.",
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
          amount: token.amount.toString(),
          balance:token.balance,
          logo: token.logo,
          address: token.address,
        })),
      intent: intent,
    })
  );

  addToChat(
    createChatMessage({
      sender: "ai",
      text: "🔍 Searching for users CW20 Balances...",
      type: "text",
      intent: intent,
    })
  );

  if (!balances?.cw20.length || !balances.cw20) {
    addToChat(
      createChatMessage({
        sender: "ai",
        text: "❌ No balances found in user CW20 Balance.",
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
          amount: token.amount.toString(),
          balance:token.balance,
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

const extractInjectiveAddress = (input: string): string | null => {
    const regex = /inj1[a-z0-9]{38}/i; // Matches 'inj1' followed by 38 alphanumeric chars
    const match = input.match(regex);
    return match ? match[0] : null; // Return the matched address or null if not found
};
