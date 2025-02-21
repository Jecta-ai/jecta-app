import React, { useEffect, useState } from "react";

import { ChainGrpcWasmApi, MsgExecuteContractCompat, toBase64 } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { MsgBroadcaster, Wallet, WalletStrategy } from "@injectivelabs/wallet-ts";
import { connectToWallet } from "@/wallet/walletConnection";
import { BigNumberInBase } from '@injectivelabs/utils'
import { ChainId } from "@injectivelabs/ts-types";

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Testnet,
});

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy /* instantiated wallet strategy */,
  network: Network.Testnet,
});

interface EarlyAccessPageProps {
  injectiveAddress:string | null;
  setInjectiveAddress: (address: string | null) => void;
  isWhitelisted:boolean;
  setIsWhitelisted: (isWL: boolean) => void;
}

const EarlyAccessPage= ({ injectiveAddress,setInjectiveAddress,isWhitelisted,setIsWhitelisted}:EarlyAccessPageProps) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const earlyAccessContract = "inj17rtl3ctxp2wqw48cgf0mga0qthsr7lygsqul2r"

  const checkIsWhitelisted = async () => {
    try {
      setIsLoading(true)
        console.log(injectiveAddress)
        const queryFromObject = toBase64({ is_whitelisted: { address: `${injectiveAddress}` } });

        const contractState = await chainGrpcWasmApi.fetchSmartContractState(
            earlyAccessContract,
            queryFromObject
        );

        console.log("Query Response:", contractState);
        const decodedResponse = new TextDecoder().decode(Uint8Array.from(Object.values(contractState.data)));
        
        const parsedResponse = JSON.parse(decodedResponse);

        console.log("Parsed Query Response:", parsedResponse.is_whitelisted);
        setIsLoading(false)
        setIsWhitelisted(parsedResponse.is_whitelisted)
    } catch (error) {
      setIsLoading(false);
        setIsWhitelisted(false)
        console.error("Error querying contract:", error);
    }
};

    useEffect(()=>{
      if(injectiveAddress){
        checkIsWhitelisted()
      }
    },[injectiveAddress])

    const handleConnectWallet = async (wallet:Wallet) => {
      const walletInfo = await connectToWallet(wallet);
      console.log(walletInfo)
      if (walletInfo?.address) {
        setInjectiveAddress(walletInfo?.address);
        
      }
    };

    const joinEAP = async (ref_code:string) => {
      console.log(ref_code)
      try{
        if(injectiveAddress){
          let msg;
          if(ref_code !== ""){
            console.log("executing w ref")
            msg = MsgExecuteContractCompat.fromJSON({
              sender: injectiveAddress,
              contractAddress: earlyAccessContract,
              msg: {
                join_whitelist: {
                  ref_code: ref_code, // Handle optionality correctly
                },
              },funds:{
                denom: 'inj',
                amount: new BigNumberInBase(1).toWei().toFixed(),
              },
            });
          }else{
            console.log("executing")
            msg = MsgExecuteContractCompat.fromJSON({
              sender: injectiveAddress,
              contractAddress: earlyAccessContract,
              msg: {
                join_whitelist: {
                  ref_code: "", // Handle optionality correctly
                }
              }
                ,funds:{
                denom: 'inj',
                amount: new BigNumberInBase(1).toWei().toFixed(),
              },
            });
          }
          const res = await msgBroadcastClient.broadcast({
            injectiveAddress: injectiveAddress,
            msgs: msg,
          });
          checkIsWhitelisted()
          console.log(res)
        }
      }catch(error){
        console.log(error)
      } 
    }


  return (
    <div className="fixed inset-1 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-zinc-800 text-white p-6 rounded-2xl shadow-lg  flex flex-col gap-4">        
        {/* Connect with Keplr Button */}
        {isLoading ? (<>
          <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
        </>):(<>
        {/* Welcome Message */}
        <h2 className="text-xl font-semibold text-center">Welcome to Jecta</h2>
          {injectiveAddress ? (<>
        Your Injective Address: {injectiveAddress}
        {!isWhitelisted && <>
        {/* Referral Code Input */}
        <input
          type="text"
          placeholder="Referral Code (Optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full p-2 bg-zinc-700 text-white rounded-md outline-none focus:ring-2 focus:ring-purple-400"
        />
          {/* Join EAP Button */}
          <button
          onClick={()=>joinEAP(referralCode)}   
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition"
          >
          Join EAP (1 INJ)
          </button>
          </>
        }
        </>):(<><button
          onClick={()=>handleConnectWallet(Wallet.Keplr)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
        >
          Connect with Keplr
        </button>
        <button
          onClick={()=>handleConnectWallet(Wallet.Leap)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
        >
          Connect with Leap
        </button></>)}
        </>)}
        
        
      </div>
    </div>
  );
};

export default EarlyAccessPage;
