import { useValidator } from "../providers/validatorProvider";
import { useChat } from "../providers/chatProvider";
import { MsgDelegate } from "@injectivelabs/sdk-ts";
import { msgBroadcastClient } from "@/components/ChatBot";
import { useState } from "react";

const StakeAmountMessageType = ({
  handleExit,
  injectiveAddress,
}: {
  injectiveAddress: string | null;
  handleExit: () => void;
}) => {
  const [amount, setAmount] = useState<string>();
  const { validatorAddress, setValidatorSelected } = useValidator();
  const { addMessage } = useChat();

  const confirmStake = async () => {
    try {
      if (amount === undefined || injectiveAddress === null) {
        return;
      }

      const msg = MsgDelegate.fromJSON({
        injectiveAddress,
        validatorAddress: validatorAddress,
        amount: {
          denom: "inj",
          amount: String(Number(amount) * 10 ** 18),
        },
      });
      const res = await msgBroadcastClient.broadcast({
        injectiveAddress: injectiveAddress,
        msgs: msg,
      });
      addMessage({
        sender: "ai",
        text: `Stake success ! Here is your tx Hash : ${res.txHash}`,
        type: "text",
        balances: null,
        validators: null,
        contractInput: null,
        send: null,
      });
      setValidatorSelected(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
      <h3 className="text-lg font-semibold mb-2">Enter Staking Amount:</h3>
      <input
        type="number"
        placeholder="Amount in INJ"
        className="p-2 rounded-lg bg-gray-700 text-white w-full"
        onChange={(e) => setAmount(e.target.value)}
        //onKeyDown={(e) => e.key === "Enter" && handleStakeAmount(e.target.value)}
      />
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
          onClick={confirmStake}
          className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default StakeAmountMessageType;
