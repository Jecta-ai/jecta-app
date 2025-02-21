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
import EarlyAccessPage from "./components/earlyAccessPage";
import { fetchResponse } from "./services/userMessage";
import { createChatMessage } from "./utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useChat } from "./providers/chatProvider";
import { useValidator } from "./providers/validatorProvider";
import { getChatHistory } from "./services/chatServices";
import type { Chat } from "./services/types";

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [injectiveAddress, setInjectiveAddress] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);

  const { validatorSelected, setValidatorSelected } = useValidator();
  const {
    messageHistory,
    setMessageHistory,
    addMessage,
    addMessages,
    createChat,
    currentChat,
    allChats,
    setCurrentChat,
  } = useChat();

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
    if (!loading && !executing) {
      const response = await getChatHistory(chatId);
      const messages = response.map((chat: any) => chat.message);
      setMessageHistory(messages);
      const chatInfos = allChats.filter((chat) => chat.id === chatId);
      setCurrentChat({
        id: chatInfos[0].id,
        title: chatInfos[0].title,
        ai_id: chatInfos[0].ai_id,
        user_id: chatInfos[0].user_id,
      });
    }
  };

  const updateExecuting = (executing: boolean) => {
    setExecuting(executing);
  };

  const updateChat = (cb: (prevChat: ChatMessage[]) => ChatMessage[]) => {
    setMessageHistory(cb);
  };

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
    setLoading(true);
    const userMessage = formData.get("userMessage");

    if (typeof userMessage !== "string" || !userMessage.trim()) {
      return;
    }
    if (!injectiveAddress || !isWhitelisted) {
      return;
    }
    if (!currentChat?.id) {
      const newUserMessage = createChatMessage({
        sender: "user",
        text: userMessage,
        type: "text",
      });
      const newChat = await createChat(injectiveAddress, newUserMessage);
      console.log("newChat -> newChat:", newChat);
      if (newChat?.id) {
        addMessage(newUserMessage, newChat);
        await getAIResponse(userMessage, newChat);
      } else {
        console.error("Chat creation failed, no ID returned.");
      }

      return;
    }

    const newUserMessage = createChatMessage({
      sender: "user",
      text: userMessage,
      type: "text",
    });

    addMessage(newUserMessage);
    await getAIResponse(userMessage);
  };

  const getAIResponse = async (userMessage: string, updatedChat?: Chat) => {
    fetchResponse(userMessage, messageHistory, injectiveAddress)
      .then((data) => {
        addMessages(data.messages, updatedChat); // Update chat history
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
  const createNewChatButton = () => {
    if (!loading && !executing) {
      setCurrentChat(null);
      setMessageHistory([]);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white">
      {!isWhitelisted && (
        <EarlyAccessPage
          injectiveAddress={injectiveAddress}
          setInjectiveAddress={(address) => setInjectiveAddress(address)}
          isWhitelisted={isWhitelisted}
          setIsWhitelisted={(WL) => setIsWhitelisted(WL)}
        />
      )}
      <Menu
        createNewChatButton={createNewChatButton}
        injectiveAddress={injectiveAddress}
        setInjectiveAddress={(address) => setInjectiveAddress(address)}
        loadChatHistory={loadChatHistory}
        isWhitelisted={isWhitelisted}
      />

      {/* Chat Section */}
      <main className="flex flex-col w-full">
        {messageHistory.length > 0 && (
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
              // Detect if this is the last error message
              const isLastError =
                (msg.type === "error" ||
                  msg.type === "validators" ||
                  msg.type === "stake_amount" ||
                  msg.type === "swap" ||
                  msg.type === "send_token") &&
                i === messageHistory.length - 1;
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
                  {msg.type === "send_token" &&
                    (isLastError ? (
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
                    ))}
                  {msg.type === "error" && (
                    <ErrorMessageType
                      text={msg.text}
                      handleExit={handleExit}
                      isLastError={isLastError}
                    />
                  )}
                  {(msg.type === "text" || msg.type === "success" || msg.type === "loading") && (
                    <DefaultMessageType text={msg.text} sender={msg.sender} />
                  )}
                </div>
              );
            })}
            {loading && <p className="text-gray-400">⏳ JECTA is thinking...</p>}
            {executing && <p className="text-gray-400">⏳ Executing...</p>}
          </div>
        )}

        {/* Chat Input */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <form
            className="w-full flex items-center gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const formData = new FormData(e.currentTarget);
              await sendMessage(formData);
            }}
          >
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
