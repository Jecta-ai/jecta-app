"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ChainGrpcWasmApi, MsgExecuteContractCompat, toBase64 } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import {
  MsgBroadcaster,
  type Wallet as WalletType,
  WalletStrategy,
  Wallet,
} from "@injectivelabs/wallet-ts";
import { connectToWallet } from "@/wallet/walletConnection";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Wallet as WalletIcon } from "lucide-react";
import { crateInjectiveIfNotExists } from "../services/userMessage";

const endpoints = getNetworkEndpoints(Network.Testnet);
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc);

interface EarlyAccessPageProps {
  injectiveAddress: string | null;
  setInjectiveAddress: (address: string | null) => void;
  isWhitelisted: boolean;
  setIsWhitelisted: (isWL: boolean) => void;
}

const EarlyAccessPage = ({
  injectiveAddress,
  setInjectiveAddress,
  isWhitelisted,
  setIsWhitelisted,
}: EarlyAccessPageProps) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [strategy, setStrategy] = useState<WalletType>();
  const earlyAccessContract = "inj1dhzwl09judskmt56qynsxfv44rq4c4xq583rw8";

  const checkIsWhitelisted = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryFromObject = toBase64({ is_whitelisted: { address: `${injectiveAddress}` } });

      const contractState = await chainGrpcWasmApi.fetchSmartContractState(
        earlyAccessContract,
        queryFromObject
      );

      const decodedResponse = new TextDecoder().decode(
        Uint8Array.from(Object.values(contractState.data))
      );

      const parsedResponse = JSON.parse(decodedResponse);

      setIsLoading(false);
      setIsWhitelisted(parsedResponse.is_whitelisted);
    } catch (error) {
      setIsLoading(false);
      setIsWhitelisted(false);
      console.error("Error querying contract:", error);
    }
  }, [injectiveAddress]);

  useEffect(() => {
    if (injectiveAddress) {
      checkIsWhitelisted();
    }
  }, [injectiveAddress, checkIsWhitelisted]);

  const handleConnectWallet = async (wallet: WalletType) => {
    try {
      setIsLoading(true);
      const { address, token } = await connectToWallet(wallet);

      if (address) {
        setStrategy(wallet);
        setInjectiveAddress(address);
        toast.success("Wallet Connected !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Login failed.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinEAP = async (ref_code: string) => {
    try {
      setIsLoading(true);
      if (injectiveAddress) {
        const msg = MsgExecuteContractCompat.fromJSON({
          sender: injectiveAddress,
          contractAddress: earlyAccessContract,
          msg: {
            join_whitelist: {
              ref_code: ref_code || "", // Handle empty referral code
            },
          },
          funds: {
            denom: "inj",
            amount: new BigNumberInBase(1).toWei().toFixed(),
          },
        });
        const walletStrategy = new WalletStrategy({
          chainId: ChainId.Testnet,
          wallet: strategy,
        });

        const msgBroadcastClient = new MsgBroadcaster({
          walletStrategy,
          network: Network.Testnet,
        });

        await msgBroadcastClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });

        localStorage.removeItem("token");
        await crateInjectiveIfNotExists(injectiveAddress);
        setInjectiveAddress(null);
        toast.success("Payment success ! Please connect your wallet again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : "Something went wrong!"}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error joining EAP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <ToastContainer />
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome to JECTA
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {injectiveAddress
              ? "Join our Early Access Program"
              : "Connect your wallet to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <>
              {injectiveAddress ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 break-all">
                    <p className="text-xs font-medium text-zinc-500 mb-1">Connected Address</p>
                    <p className="text-sm font-medium text-zinc-300">{injectiveAddress}</p>
                  </div>

                  {!isWhitelisted && (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Enter referral code (Optional)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                      />
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                        onClick={() => joinEAP(referralCode)}
                      >
                        Join Early Access (1 INJ)
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 bg-slate-700"
                    onClick={() => handleConnectWallet(Wallet.Keplr)}
                  >
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Connect with Keplr
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 bg-slate-700"
                    onClick={() => handleConnectWallet(Wallet.Leap)}
                  >
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Connect with Leap
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>

        {injectiveAddress && isWhitelisted && (
          <CardFooter>
            <p className="text-sm text-emerald-500 font-medium w-full text-center">
              ✨ You have Early Access! ✨
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default EarlyAccessPage;
