"use client";
import { useEffect, useRef, useState } from "react";
import logo from "@/public/logo.png";
import sonia from "../images/sonia.png"
import venicia from "../images/venicia.png"
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
import { fetchResponse } from "./services/apiChat";
import { createChatMessage } from "./utils";
import { useChat } from "./providers/chatProvider";
import { useValidator } from "./providers/validatorProvider";
import { getChatHistory } from "./services/chatServices";
import type { Chat } from "./services/types";
import ChatInput from "./components/ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import LoadingIndicator from "./components/LoadingIndicator";
import PlaceBidAmountMessageType from "./components/placeBidAmountMessageType";
import TokenMetadataCard from "./components/TokenMetadataCard";
import TokenPieChart from "./components/TokenPieChart";
import MetricsType from "./components/metricsMessageType";
import ValidatorTable from "./components/stakingInformationType";
import ProposalCard from "./components/proposalCardType";

export type LoadingState = "thinking" | "executing" | "general" | null;

const Chatbot = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [injectiveAddress, setInjectiveAddress] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [newChatCreated, setNewChatCreated] = useState<boolean>(false);
  const { validatorSelected, setValidatorSelected } = useValidator();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, [injectiveAddress]);
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

     
      const updatedChat = [...prevChat];
      updatedChat[updatedChat.length - 1].type = "text";
      return updatedChat;
    });
    const exitToolMessage = createChatMessage({
      sender: "ai",
      text: "Tool closed successfully.",
      type: "text",
    });
    addMessage(token, exitToolMessage);
  };

  const loadChatHistory = async (chatId: string) => {
    if (!loadingState) {
      setLoadingState("general");
      const response = await getChatHistory(chatId);
      const messages = response.map((chat: { message: ChatMessage }) => chat.message);
      setMessageHistory(messages);
      const chatInfos = allChats.filter((chat) => chat.id === chatId);
      setCurrentChat({
        id: chatInfos[0].id,
        title: chatInfos[0].title,
        ai_id: chatInfos[0].ai_id,
        user_id: chatInfos[0].user_id,
      });
      setLoadingState(null);
    }
  };

  const updateExecuting = (executing: boolean) => {
    setLoadingState(executing ? "executing" : null);
  };

  const updateChat = (cb: (prevChat: ChatMessage[]) => ChatMessage[]) => {
    setMessageHistory(cb);
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messageHistory]);

  const disableSend = () => {
    const lastMessageType =
      messageHistory.length > 0 ? messageHistory[messageHistory.length - 1].type : null;

    return (
      validatorSelected ||
      lastMessageType === "swap" ||
      lastMessageType === "send_token" ||
      lastMessageType === "place_bid_amount" ||
      !!loadingState ||
      lastMessageType === "validators"
    );
  };

  const sendMessage = async (formData: FormData) => {
    if (messageHistory.length === 0) setLoadingState("general");
    else if (messageHistory.length > 0) setLoadingState("thinking");

    const userMessage = formData.get("userMessage");

    if (typeof userMessage !== "string" || !userMessage.trim()) {
      setLoadingState(null);
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
      const newChat = await createChat(injectiveAddress, newUserMessage, token,"system");

      if (newChat?.id) {
        addMessage(token, newUserMessage, newChat);
        await getAIResponse(userMessage, newChat);
        if (newChatCreated == false) {
          setNewChatCreated(true);
        } else {
          setNewChatCreated(false);
        }
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

    addMessage(token, newUserMessage);
    await getAIResponse(userMessage);
  };

  const getAIResponse = async (userMessage: string, updatedChat?: Chat) => {
    fetchResponse(userMessage, messageHistory, injectiveAddress, token)
      .then((data) => {
        addMessages(token, data.messages, updatedChat); 
      })
      .catch((err) => {
        console.error("Error fetching response:", err);
        addMessage(
          token,
          createChatMessage({
            sender: "ai",
            text: "Error processing request",
            type: "error",
          })
        );
      })
      .finally(() => {
        setLoadingState(null);
      });
  };
  const createNewChatButton = () => {
    if (!loadingState) {
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
        newChatCreated={newChatCreated}
      />

      <main className="flex flex-col w-full mt-16">
        <AnimatePresence>
          {
            <motion.div
              ref={chatContainerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex-1 bg-zinc-900 p-6 mx-2 rounded-xl overflow-y-auto flex flex-col pb-20 relative ${
                messageHistory.length === 0 ? "mb-2" : "mb-16"
              } ${
                loadingState
                  ? "border-[3px] border-transparent animate-neonBlink"
                  : "border border-zinc-800"
              }`}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {messageHistory.map((msg, i) => {
                  if (msg.sender === "system") {
                    return null;
                  }
                  const isLastError =
                    (msg.type === "error" ||
                      msg.type === "validators" ||
                      msg.type === "stake_amount" ||
                      msg.type === "place_bid_amount" ||
                      msg.type === "swap" ||
                      msg.type === "unstake" ||
                      msg.type === "send_token") &&
                    i === messageHistory.length - 1;

                 
                  const isRecent = i >= messageHistory.length - 3;
                  const animationProps = isRecent
                    ? {
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -10 },
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 1,
                          delay: isRecent ? 0.1 : 0,
                        },
                      }
                    : {
                        initial: { opacity: 1 },
                        animate: { opacity: 1 },
                      };

                  return (
                    <motion.div
                      key={`chat-message-${i}-${msg.sender}`}
                      {...animationProps}
                      className={`flex my-2 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
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
                                              {msg.sender === "sonia" && (
                        <img
                          src={sonia.src}
                          alt="Sonia"
                          className="w-8 h-8 rounded-md mr-2 border-white border-1"
                        />
                      )}
                                            {msg.sender === "venicia" && (
                        <img
                          src={venicia.src}
                          alt="Venicia"
                          className="w-8 h-8 rounded-md mr-2 border-white border-1"
                        />
                      )}
                      {msg.type === "balance" && msg.balances && (
                        <BalanceMessageType balances={msg.balances} />
                      )}
                      {msg.type === "tokenmetadata" && (
                    <div className="p-3 rounded-xl bg-zinc-800 text-white ">
                      
                      <TokenMetadataCard msg={msg} />
                    </div>
                      )}
                      {msg.type === "unstake" && (
                        isLastError?(<>
                          <ValidatorTable handleExit={handleExit} validators={msg.stake_info} injectiveAddress={injectiveAddress} token={token} />

                        </>):(<>
                          <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                              Done !
                            </div>
                        </>)
                    
                      )}
                      {msg.type === "llama" && (
                    <div className="p-3 rounded-xl bg-zinc-800 text-white sm:w-fit w-full">
                      
                      <MetricsType data={msg.llama} />
                    </div>
                      )}
                      {msg.type === "proposals" && (
                    <div className="p-3 rounded-xl bg-zinc-800 text-white w-full">
                      
                      <ProposalCard proposals={msg.proposals}  />
                    </div>
                      )}
                      {msg.type === "pie" && (
                    <div className="p-3 rounded-xl bg-zinc-800 text-white w-96">
                      
                      <TokenPieChart data={msg.pie} />
                    </div>
                      )}
                      {msg.type === "validators" &&
                        (isLastError ? (
                          msg.validators && (
                            <ValidatorsMessageType
                              token={token}
                              injectiveAddress={injectiveAddress}
                              validators={msg.validators}
                              setLoadingState={setLoadingState}
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
                            token={token}
                            handleExit={handleExit}
                            injectiveAddress={injectiveAddress}
                          />
                        ) : (
                          <>
                            <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                            
                              Done !
                             
                            </div>
                          </>
                        ))}
                        {msg.type === "place_bid_amount" &&
                        (isLastError ? (
                          <PlaceBidAmountMessageType
                            token={token}
                            handleExit={handleExit}
                            injectiveAddress={injectiveAddress}
                          />
                        ) : (
                          <>
                            <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                              
                              Done !
                              
                            </div>
                          </>
                        ))}
                      {msg.type === "swap" &&
                        (isLastError ? (
                          msg.contractInput && (
                            <SwapMessageType
                              executing={loadingState === "executing"}
                              text={msg.text}
                              handleExit={handleExit}
                              updateExecuting={updateExecuting}
                              updateChat={updateChat}
                              contractInput={msg.contractInput}
                              injectiveAddress={injectiveAddress}
                              token={token}
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
                              executing={loadingState === "executing"}
                              handleExit={handleExit}
                              send={msg.send}
                              token={token}
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
                      {(msg.type === "text" ||
                        msg.type === "success" ||
                        msg.type === "loading") && (
                        <DefaultMessageType text={msg.text} sender={msg.sender} />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {loadingState === "thinking" && <LoadingIndicator type="thinking" />}
              {loadingState === "executing" && <LoadingIndicator type="executing" />}
            </motion.div>
          }
        </AnimatePresence>

        <ChatInput
          loading={!!loadingState}
          onSubmit={sendMessage}
          disableSend={disableSend}
          isEmptyState={messageHistory.length === 0}
        />
      </main>
    </div>
  );
};

export default Chatbot;
