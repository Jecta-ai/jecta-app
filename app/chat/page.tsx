"use client";

import { useEffect, useRef, useState } from "react";
import logo from "@/public/logo.png";
import type { ChatMessage } from "./types";
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
import { createChatMessage } from "./utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useChat } from "./providers/chatProvider";
import { useValidator } from "./providers/validatorProvider";
import { getChatHistory } from "./services/chatServices";

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [injectiveAddress, setInjectiveAddress] = useState<string | null>(null);

  const { validatorSelected, setValidatorSelected } = useValidator();
  const { messageHistory, setMessageHistory, addMessage, addMessages, createChat } = useChat();

  useEffect(() => {
    if (injectiveAddress) {
      console.log("useEffect -> injectiveAddress:", injectiveAddress);
      createChat(injectiveAddress);
    }
  }, [injectiveAddress]);

  const handleExit = async () => {
    setValidatorSelected(false);
    setMessageHistory((prevChat) => {
      if (prevChat.length === 0) return prevChat;

      // ✅ Change the last message type to "text"
      const updatedChat = [...prevChat];
      updatedChat[updatedChat.length - 1].type = "text";
      return updatedChat;
    });
    const exitToolMessage = createChatMessage({
      sender: "ai",
      text: "Tool closed successfully.",
      type: "text",
    });
    addMessage(exitToolMessage);
  };

  const loadChatHistory = async (chatId: string) => {
    console.log("Loading chat history:", chatId);
    const response = await getChatHistory(chatId);
    console.log("response:", response);
    const messages = response.map((chat: any) => chat.message);
    setMessageHistory(messages);
  };

  const updateExecuting = (executing: boolean) => {
    setExecuting(executing);
  };

  const updateChat = (cb: (prevChat: ChatMessage[]) => ChatMessage[]) => {
    setMessageHistory(cb);
  };

  useEffect(() => {
    setValidatorSelected(false);
    // TODO: Do not store the address in local storage, use the injected address instead
    const storedAddress = localStorage.getItem("injectiveAddress");
    if (storedAddress) {
      setInjectiveAddress(storedAddress);
      // createChatMessage({
      //   sender: "system",
      //   message: `User's Injective wallet address is: ${storedAddress}. If user asks you about his wallet address, you need to remember it.`,
      //   type: "text",
      // });
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messageHistory]);

  const disableSend = () => {
    const lastMessageType =
      messageHistory.length > 0 ? messageHistory[messageHistory.length - 1].type : null;

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
      text: userMessage,
      type: "text",
    });

    addMessage(newUserMessage);
    setLoading(true);
    getAIResponse(userMessage);
  };

  const getAIResponse = async (userMessage: string) => {
    fetchResponse(userMessage, messageHistory, injectiveAddress)
      .then((data) => {
        console.log(".then -> data:", data);
        addMessages(data.messages); // Update chat history
      })
      .catch(() => {
        addMessage(
          createChatMessage({
            sender: "ai",
            text: "Error processing request",
            type: "error",
          })
        );
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
        loadChatHistory={loadChatHistory}
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
          {messageHistory.map((msg, i) => {
            if (msg.sender === "system") {
              return null;
            }
            console.log("Chatbot -> msg:", msg.type);
            // Detect if this is the last error message
            const isLastError =
              (msg.type === "error" ||
                msg.type === "validators" ||
                msg.type === "stake_amount" ||
                msg.type === "swap" ||
                msg.type === "send_token") &&
              i === messageHistory.length - 1;
            console.log(i === messageHistory.length - 1);
            console.log(msg.type);
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
                {msg.type === "balance" && msg.balances && (
                  <BalanceMessageType balances={msg.balances} />
                )}
                {msg.type === "validators" &&
                  (isLastError ? (
                    msg.validators && (
                      <ValidatorsMessageType
                        injectiveAddress={injectiveAddress}
                        validators={msg.validators}
                        setLoading={setLoading}
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
                  ))}
                {msg.type === "stake_amount" &&
                  (isLastError ? (
                    <StakeAmountMessageType
                      handleExit={handleExit}
                      injectiveAddress={injectiveAddress}
                    />
                  ) : (
                    <>
                      <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                        <h3 className="text-lg font-semibold mb-2">Amount successfull given !</h3>
                      </div>
                    </>
                  ))}
                {msg.type === "swap" &&
                  (isLastError ? (
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
                  ))}
                {msg.type === "send_token" && (
                  <>
                    {isLastError ? (
                      msg.send && (
                        <SendTokenMessageType
                          text={msg.text}
                          injectiveAddress={injectiveAddress}
                          setExecuting={updateExecuting}
                          executing={executing}
                          handleExit={handleExit}
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
                )}
                {msg.type === "error" ? (
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
