import { fetchValidators } from "../tools/stakeTool";



export async function stakeInjective(intent: string,
    message: string,
    chatHistory: any[],
    addToChat: (msg: any) => void,
    address:string |null) {
if (!address) {
          addToChat({ sender: "ai", text: "❌ Please connect your wallet first.", type: "text" });
          return;
        }
  
        addToChat({ sender: "ai", text: "🔍 Fetching current Injective validators...", type: "loading" });
  
        const validators = await fetchValidators();
  
        if (validators.length === 0) {
          addToChat({ sender: "ai", text: "⚠️ No validators found!", type: "text" });
          return;
        }
  
        addToChat({
          sender: "ai",
          type: "validators",
          validators: validators.map((v, index) => ({
            index: index + 1,
            moniker: v.moniker,
            address: v.address,
            commission: v.commission,
          })),
        });
  

    }