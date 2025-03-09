import { useChat } from "../providers/chatProvider";
import { useState } from "react";
import { createChatMessage,msgBroadcastClient } from "../utils";
import {
    MsgBid,
    ChainGrpcAuctionApi,
    IndexerGrpcAuctionApi,
  } from '@injectivelabs/sdk-ts'
import { INJ_DENOM, BigNumberInBase } from '@injectivelabs/utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet)
const auctionApi = new ChainGrpcAuctionApi(endpointsForNetwork.grpc)

const network = Network.Mainnet;
const endpoints = getNetworkEndpoints(network);
const indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(endpoints.indexer);

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
  const { addMessage } = useChat();
  const [errorMessage,setErrorMessage] = useState<string>("");

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
      const auction = await indexerGrpcAuctionApi.fetchAuction(latestRound);
      let minBid;
      if(auction.bids.length >0){
        const sortedBids = auction.bids.sort((a, b) => Number(b.bidAmount) - Number(a.bidAmount));
        minBid = Number(sortedBids[0].bidAmount);
      }else{
        minBid = 0;
      }
      if(Number(amount) < (minBid/(10**18))){
        setErrorMessage(`Min Bid must be more than ${minBid/(10**18)} INJ`);
        return
      }else{
        setErrorMessage("")
      }
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
      
    } catch (error) {
      setErrorMessage(String(error))
      console.log(error)
    }
  };

  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
      <h3 className="text-lg font-semibold mb-2">Enter Bid Amount:</h3>
      <div className="text-red-400">
        {errorMessage}
      </div>
      <input
        type="number"
        placeholder="Amount in INJ"
        className="p-2 rounded-lg bg-gray-700 text-white w-full"
        onChange={(e) => setAmount(e.target.value)}
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
