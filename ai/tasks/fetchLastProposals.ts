import { createChatMessage } from "@/app/utils";
import { fetchTokenPrice } from "../tools/fetchTokenPrice";
import { fetchLast10Proposals } from "../tools/governanceTool";

export async function fetchLastProposals(
  intent: string,
  message: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) {
 

    addToChat(
      createChatMessage({
        sender: "ai",
        text: "Looking for the last 10 Proposals from Injective Hub...",
        type: "text",
        intent: intent,
      })
    );
    const latestProposals = await fetchLast10Proposals();
    if(latestProposals.length == 0){
        addToChat(
            createChatMessage({
              sender: "ai",
              text: `It seems there is an issue with endpoints right now. Please try again later.`,
              type: "text",
              intent: intent,
            })
          );
        return
    }
    addToChat(
        createChatMessage({
          sender: "ai",
          text: ``,
          type: "proposals",
          proposals:latestProposals,
          intent: intent,
        })
      );
}


