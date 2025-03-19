import React from "react";
import { Copy, LogOut } from "lucide-react";
import { MsgUndelegate } from "@injectivelabs/sdk-ts"; // Injective SDK
import { BigNumberInBase } from "@injectivelabs/utils";
import { createChatMessage, msgBroadcastClient } from "../utils";
import { useChat } from "../providers/chatProvider";
interface Validator {
  validatorName: string;
  validatorAddress: string;
  stakedAmount: number;
  rewards: number;
}

const ValidatorList = ({
    validators,
    handleExit,
    injectiveAddress,
    token
  }: {
    injectiveAddress:string|null,
    validators: Validator[];
    handleExit: () => void;
    token:string;
  }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const { addMessage } = useChat();
  const handleUnstake = async (validator: Validator) => {
    try {
      
      
      const unstakeAmount = new BigNumberInBase(validator.stakedAmount).toWei(18);
        if(!injectiveAddress){
            return
        }
      
      const msgUndelegate = MsgUndelegate.fromJSON({
        injectiveAddress,
        validatorAddress: validator.validatorAddress,
        amount: {
          denom: "inj",
          amount: unstakeAmount.toFixed(),
        },
      });
      const msgClient = msgBroadcastClient()
      const res = await msgClient.broadcast({
        injectiveAddress: injectiveAddress,
        msgs: msgUndelegate,
      });
      addMessage(token,
              createChatMessage({
                sender: "ai",
                text: `Unstake success ! Here is your tx Hash : ${res.txHash}`,
                type: "text",
              })
            );

      
    } catch (error) {
      
    } 
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-white mb-6">Validator Staking</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {validators.map((validator, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
          >
            <h3 className="text-lg font-semibold mb-2">{validator.validatorName}</h3>
            <p className="text-sm text-gray-400 truncate max-w-[220px] md:max-w-[320px]">
              {validator.validatorAddress}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Staked: <span className="text-white">{validator.stakedAmount.toFixed(6)} INJ</span></p>
                <p className="text-sm text-gray-400">Rewards: <span className="text-white">{validator.rewards} INJ</span></p>
              </div>
              <button
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                onClick={() => copyToClipboard(validator.validatorAddress)}
              >
                <Copy size={18} className="text-gray-300" />
              </button>
            </div>

            <button
              onClick={() => handleUnstake(validator)}
              className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition duration-300"
            >
              <LogOut size={18} /> Unstake
            </button>
          </div>
        ))}
      </div>
      <button
          type="button"
          onClick={handleExit}
          className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
        >
          Exit
        </button>
    </div>
  );
};

export default ValidatorList;
