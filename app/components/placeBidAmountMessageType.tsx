import { useValidator } from "../providers/validatorProvider";
import { useChat } from "../providers/chatProvider";
import { useState } from "react";
import { createChatMessage,msgBroadcastClient } from "../utils";
import {
    MsgBid,
    ChainGrpcAuctionApi,
    MsgBroadcasterWithPk,
  } from '@injectivelabs/sdk-ts'
  import { ChainId } from '@injectivelabs/ts-types'
  import { INJ_DENOM, BigNumberInBase } from '@injectivelabs/utils'
  import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

  const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet)
const auctionApi = new ChainGrpcAuctionApi(endpointsForNetwork.grpc)

const PlaceBidAmountMessageType = ({
  handleExit,
  injectiveAddress,
  token
}: {
  injectiveAddress: string | null;
  handleExit: () => void;
  token:string;
}) => {
  const [amount, setAmount] = useState<string>();
  const { validatorAddress, setValidatorSelected } = useValidator();
  const { addMessage } = useChat();

  const confirmBid = async () => {
    try {
      if (amount === undefined || injectiveAddress === null) {
        return;
      }

      const amountBid = {
        denom: INJ_DENOM,
        amount: String(new BigNumberInBase(amount).toWei()),
      }
      const latestAuctionModuleState = await auctionApi.fetchModuleState()
      const latestRound = latestAuctionModuleState.auctionRound

      const msg = MsgBid.fromJSON({
        amount:amountBid,
        injectiveAddress,
        round: latestRound,
      })
      const msgClient = msgBroadcastClient()
      const res = await msgClient.broadcast({
        injectiveAddress: injectiveAddress,
        msgs: msg,
      });
      addMessage(token,
        createChatMessage({
          sender: "ai",
          text: `Bid success ! Here is your tx Hash : ${res.txHash}`,
          type: "text",
        })
      );
      setValidatorSelected(false);
    } catch (error) {

    }
  };

  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
      <h3 className="text-lg font-semibold mb-2">Enter Bid Amount:</h3>
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
          onClick={confirmBid}
          className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PlaceBidAmountMessageType;
