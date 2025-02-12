import { queryOpenRouter } from "./ai";
import { tokenSwap } from "./tasks/tokenSwap";
import { searchInjectiveNews } from "./tasks/searchInjectiveNews";
import { fetchBalance } from "./tasks/fetchBalance";
import { fetchPrice } from "./tasks/fetchPrice";
import { searchTxHash } from "./tasks/searchTxHash";
import { stakeInjective } from "./tasks/stakeInjective";
import { transferFunds } from "./tasks/transferFunds";

export const executeTask = async (
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address:string |null
) => {

  switch (intent) {
    case "swap_token":
      await tokenSwap(intent,message,chatHistory,addToChat,address);
      return
    case "search_injective_news":
      await searchInjectiveNews(intent,message,chatHistory,addToChat,address)
      return;
    case "fetch_balance":
      await fetchBalance(intent,message,chatHistory,addToChat,address);
      return;
    case "get_price":
      await fetchPrice(intent,message,chatHistory,addToChat,address)
      return;
    case "tx_search":   
      await searchTxHash(intent,message,chatHistory,addToChat,address)
      return;
    case "stake_inj":
      await stakeInjective(intent,message,chatHistory,addToChat,address);
      return;
    case "send_token":
      await transferFunds(intent,message,chatHistory,addToChat,address);
      return
    case "stake_inj_amount":
      addToChat({ sender: "ai", text: "🔍 Please Enter your amount of INJ to stake.", type: "stake_amount" });
      return
    case "forbidden_topics":
        const forbiddenAiResponse = await queryOpenRouter(message, chatHistory);
        addToChat({ sender: "ai", text: forbiddenAiResponse, type: "text", intent: intent });
        return; 
    default:
      const aiResponse = await queryOpenRouter(message, chatHistory);
      addToChat({ sender: "ai", text: aiResponse, type: "text", intent: "general" });
      return; 
  }
};
