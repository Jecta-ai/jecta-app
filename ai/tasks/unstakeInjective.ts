import { fetchInjectiveStakingInfo } from "../tools/stakingInformation";
import { createChatMessage } from "@/app/utils";

export async function unstakeInjective(
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
  addToChat(
    createChatMessage({
      sender: "ai",
      text: "Checking to all validators for your staking Informations...",
      type: "text",
      intent: intent,
    })
  );
  const stakingInformation = await fetchInjectiveStakingInfo(address);
  if(stakingInformation.length == 0){
    addToChat(
        createChatMessage({
          sender: "ai",
          text: "You have no staked INJ on any validators currently.",
          type: "text",
          intent: intent,
        })
      );
      return;
  }
  addToChat(
    createChatMessage({
      sender: "ai",
      text: "Done",
      type: "unstake",
      stake_info:stakingInformation,
      intent: intent,
    })
  );
}
