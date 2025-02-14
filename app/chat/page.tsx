// app/components/Chatbot.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MsgDelegate, MsgExecuteContractCompat, MsgSend } from "@injectivelabs/sdk-ts";
import logo from "@/public/logo.png";
import type { SendDetails, ChatMessage } from "./types";
import Menu from "./components/menu";
import BalanceMessageType from "./components/balanceMessageType";
import ValidatorsMessageType from "./components/validatorsMessageType";
import Image from "next/image";
import StakeAmountMessageType from "./components/stakeAmountMessageType";
import SwapMessageType from "./components/swapMessageType";
import SendTokenMessageType from "./components/sendTokenMessageType";
import ErrorMessageType from "./components/errorMessageType";
import DefaultMessageType from "./components/defaultMessageType";
import { fetchResponse } from "./services/userMessage";
import { createChatMessage, msgBroadcastClient } from "./utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

const Chatbot = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [injectiveAddress, setInjectiveAddress] = useState<string | null>(null);
  const [validatorSelected, setValidatorSelected] = useState(false);
  const [amount, setAmount] = useState<string>();
  const [validatorInfo, setValidatorInfo] = useState<string>("");

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
        const res = await msgBroadcastClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });
        setExecuting(false);
        setChat((prevChat) => [
          ...prevChat,
          {
            sender: "ai",
            text: `Transfer success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
            intent: "general",
            balances: null,
            validators: null,
            contractInput: null,
            send: null,
          },
        ]);
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
        const res = await msgBroadcastClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });
        setExecuting(false);
        setChat((prevChat) => [
          ...prevChat,
          {
            sender: "ai",
            text: `Transfer success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
            intent: "general",
            balances: null,
            validators: null,
            contractInput: null,
            send: null,
          },
        ]);
      }
    } catch (error) {
      setExecuting(false);
      setChat((prevChat) => [
        ...prevChat,
        {
          sender: "ai",
          text: `Transfer failed, Error : ${error}`,
          type: "text",
          intent: "general",
          balances: null,
          validators: null,
          contractInput: null,
          send: null,
        },
      ]);
      console.log(error);
      return;
    }
  };

  const confirmStake = async () => {
    try {
      if (amount === undefined || injectiveAddress === null) {
        return;
      }

      const msg = MsgDelegate.fromJSON({
        injectiveAddress,
        validatorAddress: validatorInfo,
        amount: {
          denom: "inj",
          amount: String(Number(amount) * 10 ** 18),
        },
      });
      const res = await msgBroadcastClient.broadcast({
        injectiveAddress: injectiveAddress,
        msgs: msg,
      });
      setChat((prevChat) => [
        ...prevChat,
        {
          sender: "ai",
          text: `Stake success ! Here is your tx Hash : ${res.txHash}`,
          type: "text",
          intent: "general",
          balances: null,
          validators: null,
          contractInput: null,
          send: null,
        },
      ]);
      setValidatorSelected(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleValidatorSelection = async (
    validatorIndex: number,
    name: string,
    validator: string
  ) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${validatorIndex}`,
          chatHistory: chat,
          address: injectiveAddress,
          intent: "stake_inj_amount",
        }),
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChat((prevChat) => [
        ...prevChat,
        {
          sender: "ai",
          text: `Validator #${name} selected`,
          type: "text",
          intent: "stake_inj_amount",
          balances: null,
          validators: null,
          contractInput: null,
          send: null,
        },
      ]);
      setValidatorInfo(validator);
      setValidatorSelected(true);
      setChat((prevChat) => [...prevChat, ...data.messages]); // Update chat history
    } catch (error) {
      console.error("Chat error:", error);
      setChat((prevChat) => [
        ...prevChat,
        {
          sender: "ai",
          text: "Error processing request",
          type: "error",
          balances: null,
          validators: null,
          contractInput: null,
          send: null,
        },
      ]);
    } finally {
      setLoading(false);
    }

    /*
    
    */
  };

  const handleExit = async () => {
    setValidatorSelected(false);
    setChat((prevChat) => {
      if (prevChat.length === 0) return prevChat;

      // ✅ Change the last message type to "text"
      const updatedChat = [...prevChat];
      updatedChat[updatedChat.length - 1].type = "text";
      return updatedChat;
    });
    const exitToolMessage = {
      sender: "ai",
      text: "Tool closed successfully.",
      type: "text",
      balances: null,
      validators: null,
      contractInput: null,
      send: null,
    };
    setChat([...chat, exitToolMessage]);
  };

  const updateExecuting = (executing: boolean) => {
    setExecuting(executing);
  };

  const updateChat = (cb: (prevChat: ChatMessage[]) => ChatMessage[]) => {
    setChat(cb);
  };

  useEffect(() => {
    setValidatorSelected(false);
    // TODO: Do not store the address in local storage, use the injected address instead
    const storedAddress = localStorage.getItem("injectiveAddress");
    if (storedAddress) {
      setInjectiveAddress(storedAddress);
      const msg = createChatMessage({
        sender: "system",
        message: `User's Injective wallet address is: ${storedAddress}. If user asks you about his wallet address, you need to remember it.`,
        type: "text",
      });
      setChat((prevChat) => [...prevChat, msg]);
    }
  }, []); // Empty dependency array since we only want this to run once

  // ✅ Scroll to the bottom whenever chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]); // Only depend on chat updates

  const disableSend = () => {
    const lastMessageType = chat.length > 0 ? chat[chat.length - 1].type : null;

    return (
      validatorSelected ||
      lastMessageType === "swap" ||
      lastMessageType === "send_token" ||
      loading ||
      executing ||
      lastMessageType === "validators"
    );
  };

  const sendMessage = async (formData: FormData) => {
    const userMessage = formData.get("userMessage");
    if (typeof userMessage !== "string" || !userMessage.trim()) {
      return;
    }

    const newUserMessage = createChatMessage({
      sender: "user",
      message: userMessage,
      type: "text",
    });
    setChat([...chat, newUserMessage]);
    setLoading(true);

    fetchResponse(userMessage, chat, injectiveAddress)
      .then((data) => {
        setChat((prevChat) => [...prevChat, ...data.messages]); // Update chat history
      })
      .catch(() => {
        setChat((prevChat) => [
          ...prevChat,
          createChatMessage({
            sender: "ai",
            message: "Error processing request",
            type: "error",
          }),
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white">
      <Menu
        injectiveAddress={injectiveAddress}
        setInjectiveAddress={(address) => setInjectiveAddress(address)}
      />

      {/* Chat Section */}
      <main className="flex flex-col w-4/5">
        <div className="p-6 text-center">
          <h2 className="text-3xl font-semibold">
            JECTA <span className="text-xl text-gray-400">v0.0.2</span>
          </h2>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className={`flex-1 bg-zinc-900 p-6 mx-6 mb-4 rounded-xl overflow-y-auto flex flex-col ${
            loading || executing ? "animate-neonBlink" : ""
          }`}
        >
          {chat
            .filter((msg) => msg.sender !== "system")
            .map((msg, i) => {
              // Detect if this is the last error message
              const isLastError =
                (msg.type === "error" ||
                  msg.type === "validators" ||
                  msg.type === "stake_amount" ||
                  msg.type === "swap" ||
                  msg.type === "send_token") &&
                i === chat.length - 2;

              return (
                <div
                  key={`chat-message-${i}-${msg.sender}`}
                  className={`flex my-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <Image
                      src={logo}
                      alt="Logo"
                      className="w-8 h-8 rounded-md mr-2 border-white border-1"
                      width={32}
                      height={32}
                    />
                  )}

                  {msg.type === "balance" ? (
                    msg.balances && <BalanceMessageType balances={msg.balances} />
                  ) : msg.type === "validators" ? (
                    <>
                      {isLastError ? (
                        msg.validators && (
                          <ValidatorsMessageType
                            validators={msg.validators}
                            validatorSelected={validatorSelected}
                            handleValidatorSelection={handleValidatorSelection}
                            isLastError={isLastError}
                            handleExit={handleExit}
                          />
                        )
                      ) : (
                        <>
                          <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                            Selecting Validator...
                          </div>
                        </>
                      )}
                    </>
                  ) : msg.type === "stake_amount" ? (
                    <>
                      {isLastError ? (
                        <StakeAmountMessageType
                          setAmount={(amount: string) => setAmount(amount)}
                          handleExit={handleExit}
                          confirmStake={confirmStake}
                        />
                      ) : (
                        <>
                          <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                            <h3 className="text-lg font-semibold mb-2">
                              Amount successfull given !
                            </h3>
                          </div>
                        </>
                      )}
                    </>
                  ) : msg.type === "swap" ? (
                    <>
                      {isLastError ? (
                        msg.contractInput && (
                          <SwapMessageType
                            executing={executing}
                            text={msg.text}
                            handleExit={handleExit}
                            updateExecuting={updateExecuting}
                            updateChat={updateChat}
                            contractInput={msg.contractInput}
                            injectiveAddress={injectiveAddress}
                          />
                        )
                      ) : (
                        <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                          <h3 className="text-lg font-semibold mb-2">Your Swap Details</h3>
                          <div>{msg.text}</div>
                        </div>
                      )}
                    </>
                  ) : msg.type === "send_token" ? (
                    <>
                      {isLastError ? (
                        msg.send && (
                          <SendTokenMessageType
                            text={msg.text}
                            executing={executing}
                            handleExit={handleExit}
                            confirmSend={confirmSend}
                            send={msg.send}
                          />
                        )
                      ) : (
                        <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                          <h3 className="text-lg font-semibold mb-2">Your Transfer Details</h3>
                          <div>{msg.text}</div>
                        </div>
                      )}
                    </>
                  ) : msg.type === "error" ? (
                    <ErrorMessageType
                      text={msg.text}
                      handleExit={handleExit}
                      isLastError={isLastError}
                    />
                  ) : (
                    <DefaultMessageType text={msg.text} sender={msg.sender} />
                  )}
                </div>
              );
            })}
          {loading && <p className="text-gray-400">⏳ JECTA is thinking...</p>}
          {executing && <p className="text-gray-400">⏳ Executing...</p>}
        </div>

        {/* Chat Input */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <form className="w-full flex items-center gap-3" action={sendMessage}>
            <Input className="w-full" name="userMessage" placeholder="Ask to JECTA..." />
            <Button
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disableSend()}
              type="submit"
            >
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
