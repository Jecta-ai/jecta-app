import { IndexerRestExplorerApi } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { queryOpenRouter } from "../ai"; 

const endpoints = getNetworkEndpoints(Network.Mainnet); 
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`
);

export const txSearch = {
    execute: async (txHash: string, chatHistory: any[]): Promise<string> => {
      try {
        if (!txHash || txHash.length !== 64 || !/^[A-Fa-f0-9]{64}$/.test(txHash)) {
          return "❌ Invalid transaction hash. Please provide a valid Injective TX hash.";
        }
  
        const transaction = await indexerRestExplorerApi.fetchTransaction(txHash);
  
        if (!transaction || !transaction.hash) {
          return `❌ Transaction not found. Please verify the TX hash and try again.`;
        }
  
        const { hash, blockNumber, gasUsed, gasWanted, code, messages, signatures, gasFee, blockTimestamp, logs } = transaction;
        const status = code === 0 ? "✅ Success" : "❌ Failed";
        const payer = gasFee?.payer || "Unknown";
        const granter = gasFee?.granter ? ` (Granter: ${gasFee.granter})` : "";
        const messageTypes = messages.map(msg => `- **${msg.type}**`).join("<br>");
        const transactionSummary = 
  `
    <h1 style="margin:0;">✅ Transaction Found</h1>
    <span><strong>Hash:</strong> <a href="https://explorer.injective.network/transaction/${hash}" target="_blank">${hash}</a></span><br>
    <span><strong>Status:</strong> ${status}</span><br>
    <span><strong>Block:</strong> ${blockNumber}</span><br>
    <span><strong>Timestamp:</strong> ${blockTimestamp}</span><br>
    <span><strong>Gas Used:</strong> ${gasUsed} / ${gasWanted}</span><br>
    <span><strong>Gas Payer:</strong> ${payer}${granter}</span><br><br>
    <span><strong>Messages Processed:</strong> ${messages.length}</span><br>
    <span>${messageTypes}</span><br><br>
    <span>📜 <strong>AI Transaction Breakdown</strong></span><br>
    <span><em>Analyzing transaction logs...</em></span>
  `;
  
        let explanation;
        try {
          explanation = await queryOpenRouter(
            `Look at the following Injective transaction details and explain clearly what happened:\n\n${JSON.stringify(messages, null, 2)}`,
            chatHistory
          );
        } catch (error) {
          explanation = "⚠️ AI was unable to generate a response. The transaction details above should help you analyze the transaction manually.";
        }
  
        return `${transactionSummary}<br><br><strong>🔍 AI Summary:</strong><br>${explanation}`;
      } catch (error) {
        return "❌ Failed to fetch transaction details. Please try again later.";
      }
    },
  };
  