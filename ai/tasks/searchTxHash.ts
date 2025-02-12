import { txSearch } from "../tools/txSearch";

export async function searchTxHash(intent: string,
    message: string,
    chatHistory: any[],
    addToChat: (msg: any) => void,
    address:string |null) {
        const txHash = extractTxHashFromMessage(message);
      
        if (!txHash) {
          addToChat({ sender: "ai", text: "❌ No valid Injective transaction hash found in your message.", type: "error", intent: intent });
          return;
        }
  
        addToChat({ sender: "ai", text: `🔍 Searching for transaction ${txHash}...`, type: "loading", intent: intent });
  
        const txDetails = await txSearch.execute(txHash,chatHistory);
        
        addToChat({ sender: "ai", text: txDetails, type: "success", intent: intent });
  

    }
export const extractTxHashFromMessage = (message: string) => {
      const txHashRegex = /\b[A-Fa-f0-9]{64}\b/; // Matches a 64-character hexadecimal string
      const match = message.match(txHashRegex);
      return match ? match[0] : null;
    };