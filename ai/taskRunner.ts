import { queryOpenRouter } from "./ai";
import { tokenSwap } from "./tasks/tokenSwap";
import { searchInjectiveNews } from "./tasks/searchInjectiveNews";
import { fetchBalance } from "./tasks/fetchBalance";
import { fetchPrice } from "./tasks/fetchPrice";
import { searchTxHash } from "./tasks/searchTxHash";
import { stakeInjective } from "./tasks/stakeInjective";
import { transferFunds } from "./tasks/transferFunds";
import { createChatMessage } from "@/app/utils";
import { getAuction, getLatestAuction } from "./tasks/fetchAuction";
import { tokenAnalysis } from "./tasks/tokenAnalysis";
import { jokeTool } from "./tasks/jokeTool";
import { fetchMetrics } from "./tasks/fetchMetrics";
import { fetchPortfolio } from "./tasks/fetchUserPortfolio";
import { unstakeInjective } from "./tasks/unstakeInjective";
import { fetchLastProposals } from "./tasks/fetchLastProposals";


export const executeTask = async (
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) => {
  switch (intent) {
    case "swap_token":
      await tokenSwap(intent, message, chatHistory, addToChat, address);
      return;
    case "search_injective_news":
      await searchInjectiveNews(intent, message, chatHistory, addToChat, address);
      return;
    case "fetch_my_portfolio":
      await fetchBalance(intent, message, chatHistory, addToChat, address);
      return;
    case "get_price":
      await fetchPrice(intent, message, chatHistory, addToChat, address);
      return;
    case "get_governance_proposals":
      await fetchLastProposals(intent, message, chatHistory, addToChat, address);
      return
    case "tx_search":
      await searchTxHash(intent, message, chatHistory, addToChat, address);
      return;
    case "stake_inj":
      await stakeInjective(intent, message, chatHistory, addToChat, address);
      return;
    case "unstake_inj":
      await unstakeInjective(intent, message, chatHistory, addToChat, address);
      return
    case "send_token":
      await transferFunds(intent, message, chatHistory, addToChat, address);
      return;
    case "get_latest_auction":
      await getLatestAuction(intent,message,chatHistory,addToChat,address);
      return
    case "fetch_user_portfolio":
      await fetchPortfolio(intent,message,chatHistory,addToChat,address);
      return
    case "get_auction":
      await getAuction(intent,message,chatHistory,addToChat,address);
      return
    case "analyze_token":
      await tokenAnalysis(intent,message,chatHistory,addToChat,address);
      return
    case "get_metrics":
      await fetchMetrics(intent,message,chatHistory,addToChat,address);
      return
    case "talk_between_agents":
      await jokeTool(intent,message,chatHistory,addToChat,address)
      return
    case "place_bid":
      await getLatestAuction(intent,message,chatHistory,addToChat,address);
      addToChat(
        createChatMessage({
          sender: "ai",
          text: "🔍 Please Enter your amount of INJ to bid",
          type: "place_bid_amount",
        })
      );
      return
    case "stake_inj_amount":
      addToChat(
        createChatMessage({
          sender: "ai",
          text: "🔍 Please Enter your amount of INJ to stake.",
          type: "stake_amount",
        })
      );
      return;
    case "forbidden_topics":
      const forbiddenAiResponse = await queryOpenRouter(message, chatHistory);
      addToChat(
        createChatMessage({ sender: "ai", text: forbiddenAiResponse, type: "text", intent: intent })
      );
      return;
    default:
      const aiResponse = await queryOpenRouter(message, chatHistory);
      addToChat(
        createChatMessage({ sender: "ai", text: aiResponse, type: "text", intent: "general" })
      );
      return;
  }
};
