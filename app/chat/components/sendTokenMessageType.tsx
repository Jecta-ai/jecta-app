import { MsgExecuteContractCompat, MsgSend } from "@injectivelabs/sdk-ts";
import { useChat } from "../providers/chatProvider";
import type { SendDetails } from "../types";
import { createChatMessage, msgBroadcastClient } from "../utils";

const SendTokenMessageType = ({
  text = "",
  executing,
  setExecuting,
  handleExit,
  send,
  injectiveAddress,
  token,
}: {
  injectiveAddress: string | null;
  text?: string;
  executing: boolean;
  setExecuting: (executing: boolean) => void;
  handleExit: () => void;
  send: SendDetails;
  token:string;
}) => {
  const { addMessage } = useChat();

  const confirmSend = async (sendDetails: SendDetails) => {
    try {
      if (injectiveAddress === null) {
        return;
      }
      setExecuting(true);
      if (sendDetails.token.tokenType === "cw20") {
        const msg = MsgExecuteContractCompat.fromJSON({
          sender: injectiveAddress,
          contractAddress: sendDetails.token.address,
          exec: {
            msg: {
              recipient: sendDetails.receiver,
              amount: String(sendDetails.amount * 10 ** sendDetails.token.decimals),
            },
            action: "transfer",
          },
        });
        const msgClient = msgBroadcastClient();
        const res = await msgClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });
        setExecuting(false);
        addMessage(token,
          createChatMessage({
            sender: "ai",
            text: `Transfer success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
          })
        );
      } else {
        const amount = {
          denom: sendDetails.token.denom,
          amount: String(sendDetails.amount * 10 ** sendDetails.token.decimals),
        };
        const msg = MsgSend.fromJSON({
          amount,
          srcInjectiveAddress: injectiveAddress,
          dstInjectiveAddress: sendDetails.receiver,
        });
        const msgClient = msgBroadcastClient();
        const res = await msgClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });
        setExecuting(false);
        addMessage(token,
          createChatMessage({
            sender: "ai",
            text: `Transfer success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
          })
        );
      }
    } catch (error) {
      setExecuting(false);
      addMessage(token,
        createChatMessage({
          sender: "ai",
          text: `Transfer failed, Error : ${error}`,
          type: "text",
        })
      );

      return;
    }
  };

  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%] ">
      <h3 className="text-lg font-semibold mb-2">Your Transfer Details</h3>
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
              if (send) {
                confirmSend(send);
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

export default SendTokenMessageType;
