import { createChatMessage } from "@/app/utils";
import { fetchTokenPrice } from "../tools/fetchTokenPrice";
import { fetchInjectiveData } from "../tools/injectiveMetrics";

export async function fetchMetrics(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
    addToChat(
        createChatMessage({
          sender: "ai",
          text: `Checking current Injective Protocol TVLs from DefiLlama...`,
          type: "loading",
          intent: intent,
        })
      );
    const metrics = await fetchInjectiveData();
    console.log(metrics)
    if(metrics == null){
        addToChat(
            createChatMessage({
              sender: "ai",
              text: `Hmm, maybe there is a problem with Defillama endpoints currently. Please try again later.`,
              type: "success",
              intent: intent,
            })
          );
    }
    addToChat(
        createChatMessage({
          sender: "ai",
          text: ``,
          llama:metrics,
          type: "llama",
          intent: intent,
        })
      );
  

  
}

