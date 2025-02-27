import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import type { ChatMessage, ContractInput } from "../types";
import { createChatMessage, msgBroadcastClient } from "../utils";

const SwapMessageType = ({
  text = "",
  executing,
  handleExit,
  contractInput,
  updateChat,
  updateExecuting,
  injectiveAddress,
  token,
}: {
  text?: string;
  executing: boolean;
  handleExit: () => void;
  contractInput: ContractInput;
  updateChat: (cb: (prevChat: ChatMessage[]) => ChatMessage[]) => void;
  updateExecuting: (executing: boolean) => void;
  injectiveAddress: string | null;
  token: string;
}) => {
  const confirmSwap = async (contractInput: ContractInput) => {
    try {
      if (injectiveAddress === null) {
        return;
      }
      updateExecuting(true);
      if (contractInput.executeMsg.send !== undefined) {
        const msg = MsgExecuteContractCompat.fromJSON({
          sender: injectiveAddress,
          contractAddress: contractInput.address,
          exec: {
            msg: contractInput.executeMsg.send,
            action: "send",
          },
        });
        const msgClient = msgBroadcastClient();

        const res = await msgClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });
        updateChat((prevChat) => [
          ...prevChat,
          createChatMessage({
            sender: "ai",
            text: `Swap success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
            intent: "general",
          }),
        ]);
      } else {
        const msg = MsgExecuteContractCompat.fromJSON({
          sender: injectiveAddress,
          contractAddress: contractInput.address,
          exec: {
            msg: contractInput.executeMsg.execute_routes,
            action: "execute_routes",
          },
          funds: contractInput.funds,
        });
        const msgClient = msgBroadcastClient();

        const res = await msgClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });
        updateChat((prevChat) => [
          ...prevChat,
          createChatMessage({
            sender: "ai",
            text: `Swap success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
            intent: "general",
          }),
        ]);
      }
      updateExecuting(false);
    } catch (error) {
      if (error instanceof Error) {
        updateExecuting(false);
        const errorMessage = error.message;

        // Check if the error message indicates that the minimum receive amount condition failed.
        if (errorMessage.includes("minimum receive amount")) {
          updateChat((prevChat) => [
            ...prevChat,
            createChatMessage({
              sender: "ai",
              text: `Swap failed, Error : 'The swap failed because your minimum receive amount is too high. ' +    
            'Please adjust your slippage settings at your .env to proceed with the swap.'`,
              type: "text",
              intent: "general",
            }),
          ]);
        } else {
          updateChat((prevChat) => [
            ...prevChat,
            createChatMessage({
              sender: "ai",
              text: `Swap failed, Error : ${errorMessage}`,
              type: "text",
              intent: "general",
            }),
          ]);
        }
      } else {
        // Fallback for errors that are not instances of Error
        updateChat((prevChat) => [
          ...prevChat,
          createChatMessage({
            sender: "ai",
            text: `Swap failed, Error : ${error}`,
            type: "text",
            intent: "general",
          }),
        ]);
      }
    }
  };

  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%] ">
      <h3 className="text-lg font-semibold mb-2">Your Swap Details</h3>
      <div>{text}</div>
      {!executing && (
        <div className=" space-x-4">
          <button
            type="button"
            onClick={handleExit}
            className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            Exit
          </button>
          <button
            type="button"
            onClick={() => {
              if (contractInput) {
                confirmSwap(contractInput);
              }
            }}
            className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default SwapMessageType;
