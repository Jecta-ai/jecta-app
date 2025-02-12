// app/components/Chatbot.tsx
"use client";

import { type Key, useEffect, useRef, useState } from "react";
import { connectWallet } from "@/wallet/connectWallet";
import { MsgBroadcaster, WalletStrategy } from "@injectivelabs/wallet-ts";
import { MsgDelegate, MsgExecuteContractCompat, MsgSend } from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";
import logo from "../images/logo.png";

interface Token {
  logo: string;
  symbol: string;
  balance: string;
  address: string;
}

interface Validator {
  moniker: string;
  address: string;
  commission: string;
}

interface SendDetails {
  token: {
    tokenType: string;
    address: string;
    decimals: number;
    denom?: string;
  };
  receiver: string;
  amount: number;
}

interface ContractInput {
  address: string;
  executeMsg: {
    send?: any;
    execute_routes?: any;
  };
  funds?: any;
}

interface ChatMessage {
  balances: Token[] | null;
  sender: string;
  text: string;
  type: string;
  validators: Validator[] | null;
  contractInput: ContractInput | null;
  send: SendDetails | null;
}

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
});
export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy /* instantiated wallet strategy */,
  network: Network.Mainnet,
});

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [injectiveAddress, setInjectiveAddress] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
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

  const confirmSwap = async (contractInput: ContractInput) => {
    try {
      if (injectiveAddress === null) {
        return;
      }
      setExecuting(true);
      if (contractInput.executeMsg.send !== undefined) {
        const msg = MsgExecuteContractCompat.fromJSON({
          sender: injectiveAddress,
          contractAddress: contractInput.address,
          exec: {
            msg: contractInput.executeMsg.send,
            action: "send",
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
            text: `Swap success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
            intent: "general",
            balances: null,
            validators: null,
            contractInput: null,
            send: null,
          },
        ]);
        console.log(res);
      } else {
        const msg = MsgExecuteContractCompat.fromJSON({
          sender: injectiveAddress,
          contractAddress: contractInput.address,
          exec: {
            msg: contractInput.executeMsg.execute_routes,
            action: "execute_routes",
          },
          funds: contractInput.funds,
        });

        const res = await msgBroadcastClient.broadcast({
          injectiveAddress: injectiveAddress,
          msgs: msg,
        });
        setChat((prevChat) => [
          ...prevChat,
          {
            sender: "ai",
            text: `Swap success ! Here is your tx Hash : ${res.txHash}`,
            type: "text",
            intent: "general",
            balances: null,
            validators: null,
            contractInput: null,
            send: null,
          },
        ]);
        console.log(res);
      }
      setExecuting(false);
    } catch (error) {
      if (error instanceof Error) {
        setExecuting(false);
        const errorMessage = error.message;

        // Check if the error message indicates that the minimum receive amount condition failed.
        if (errorMessage.includes("minimum receive amount")) {
          setChat((prevChat) => [
            ...prevChat,
            {
              sender: "ai",
              text: `Swap failed, Error : 'The swap failed because your minimum receive amount is too high. ' +    
            'Please adjust your slippage settings at your .env to proceed with the swap.'`,
              type: "text",
              intent: "general",
              balances: null,
              validators: null,
              contractInput: null,
              send: null,
            },
          ]);
        } else {
          setChat((prevChat) => [
            ...prevChat,
            {
              sender: "ai",
              text: `Swap failed, Error : ${errorMessage}`,
              type: "text",
              intent: "general",
              balances: null,
              validators: null,
              contractInput: null,
              send: null,
            },
          ]);
        }
      } else {
        // Fallback for errors that are not instances of Error
        setChat((prevChat) => [
          ...prevChat,
          {
            sender: "ai",
            text: `Swap failed, Error : ${error}`,
            type: "text",
            intent: "general",
            balances: null,
            validators: null,
            contractInput: null,
            send: null,
          },
        ]);
      }
    }
  };

  const confirmStake = async () => {
    try {
      if (amount === undefined || injectiveAddress === undefined) {
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

  useEffect(() => {
    setValidatorSelected(false);
    const storedAddress = localStorage.getItem("injectiveAddress");
    if (storedAddress) {
      setInjectiveAddress(storedAddress);
      const msg: ChatMessage = {
        sender: "system",
        text: `User's Injective wallet address is: ${storedAddress}. If user asks you about his wallet address, you need to remember it.`,
        type: "text",
        balances: null,
        validators: null,
        contractInput: null,
        send: null,
      };
      setChat((prevChat) => [...prevChat, msg]);
    }
  }, []); // Empty dependency array since we only want this to run once

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

  const handleConnectWallet = async () => {
    const address = await connectWallet((msg) => setChat((prevChat) => [...prevChat, msg]));
    if (address) {
      setInjectiveAddress(address);
    }
  };

  const handleDisconnect = async () => {
    if (!window.keplr) return;

    // ✅ Disable Keplr permissions before removing wallet
    await window.keplr.disable("injective-1");

    localStorage.removeItem("injectiveAddress"); // ✅ Remove stored address
    localStorage.removeItem("signature"); // ✅ Remove stored signature
    setInjectiveAddress(null);
    setShowPopup(false);
    window.location.reload(); // ✅ Refresh page after disconnecting
  };

  // ✅ Scroll to the bottom whenever chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]); // Only depend on chat updates

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage = {
      sender: "user",
      text: message,
      type: "text",
      balances: null,
      validators: null,
      contractInput: null,
      send: null,
    };
    setChat([...chat, newUserMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chatHistory: chat, address: injectiveAddress }),
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);

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
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-1/5 bg-zinc-950 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold">
            JECTA <span className="text-sm text-gray-400">v0.0.2</span>
          </h1>
          <nav className="mt-6">
            <ul>
              <li className="py-3 px-4 rounded-lg bg-zinc-700">🤖 JECTA</li>
              <li className="py-3 px-4 hover:bg-zinc-700  hover:rounded-lg cursor-pointer">
                📄 Docs (Soon)
              </li>
              <li className="py-3 px-4 hover:bg-zinc-700 hover:rounded-lg cursor-pointer">
                💾 Chats (Soon)
              </li>
              <li className="py-3 px-4  cursor-pointer">
                {!injectiveAddress ? (
                  <button
                    type="button"
                    onClick={handleConnectWallet}
                    className="px-6 py-2 bg-white rounded-lg hover:bg-gray-200 text-black"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPopup(!showPopup)}
                      className="px-6 py-2 bg-white rounded-lg hover:bg-gray-200 text-black"
                    >
                      {injectiveAddress.slice(0, 6)}...{injectiveAddress.slice(-4)}
                    </button>

                    {/* Disconnect Popup */}
                    {showPopup && (
                      <div className="absolute top-12 left-0 bg-gray-800 text-white p-3 rounded-lg shadow-lg">
                        <button
                          type="button"
                          onClick={handleDisconnect}
                          className="hover:text-red-500"
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>

        <div className="text-sm text-gray-400">@jecta</div>
      </aside>

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

              console.log(chat.length - 1);
              console.log(i);

              return (
                <div
                  key={`chat-message-${i}-${msg.sender}`}
                  className={`flex my-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-8 h-8 rounded-md mr-2 border-white border-1"
                    />
                  )}

                  {/* Token mapping */}
                  {msg.balances?.map((token, index) => (
                    <div
                      key={`token-${token.address}-${index}`}
                      className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
                    >
                      {/* Token Logo */}
                      <img
                        src={token.logo}
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full mr-4"
                      />

                      {/* Symbol & Balance */}
                      <div className="flex flex-col flex-1">
                        <span className="text-white font-semibold text-lg">{token.symbol}</span>
                        <span className="text-gray-400 text-sm">
                          {Number(token.balance).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {/* Contract Link */}
                      <a
                        href={`https://injscan.com/asset/${encodeURIComponent(token.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        Contract ↗
                      </a>
                    </div>
                  ))}

                  {/* Validator mapping */}
                  {msg.validators?.map((validator, index) => (
                    <button
                      type="button"
                      key={`validator-${validator.address}-${index}`}
                      onClick={() => {
                        if (!validatorSelected) {
                          handleValidatorSelection(index, validator.moniker, validator.address);
                        } else {
                          alert("Validator already selected !");
                        }
                      }}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex flex-col items-center text-center"
                    >
                      <span className="block font-semibold">{validator.moniker}</span>
                      <span className="text-sm text-gray-300">
                        Commission: {validator.commission}
                      </span>
                    </button>
                  ))}

                  {/* ✅ Handle Balance Messages */}
                  {msg.type === "balance" ? (
                    <div className="p-3 rounded-xl bg-zinc-800 text-white">
                      <div className="flex flex-col gap-3">
                        {msg.balances.map(
                          (
                            token: {
                              logo: string;
                              symbol: string;
                              balance: string;
                              address: string;
                            },
                            index: Key | null | undefined
                          ) => (
                            <div
                              key={index}
                              className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
                            >
                              {/* Token Logo */}
                              <img
                                src={token.logo}
                                alt={token.symbol}
                                className="w-10 h-10 rounded-full mr-4"
                              />

                              {/* Symbol & Balance */}
                              <div className="flex flex-col flex-1">
                                <span className="text-white font-semibold text-lg">
                                  {token.symbol}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {Number(token.balance).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </div>

                              {/* Contract Link */}
                              <a
                                href={`https://injscan.com/asset/${encodeURIComponent(
                                  token.address
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline text-sm"
                              >
                                Contract ↗
                              </a>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : msg.type === "validators" ? (
                    <>
                      {isLastError ? (
                        <>
                          <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                            <h3 className="text-lg font-semibold mb-2">Choose a Validator:</h3>

                            {/* ✅ Grid Layout for Validators */}
                            <div className="grid grid-cols-4 gap-3">
                              {msg.validators.map(
                                (
                                  validator: {
                                    moniker: string;
                                    address: string;
                                    commission: string;
                                  },
                                  index: number
                                ) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      if (!validatorSelected) {
                                        handleValidatorSelection(
                                          index,
                                          validator.moniker,
                                          validator.address
                                        );
                                      } else {
                                        alert("Validator already selected !");
                                      }
                                    }}
                                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex flex-col items-center text-center"
                                  >
                                    <span className="block font-semibold">{validator.moniker}</span>
                                    <span className="text-sm text-gray-300">
                                      Commission: {validator.commission}
                                    </span>
                                  </button>
                                )
                              )}
                            </div>

                            {isLastError && (
                              <button
                                onClick={handleExit}
                                className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
                              >
                                Exit
                              </button>
                            )}
                          </div>
                        </>
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
                        <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%] ">
                          <h3 className="text-lg font-semibold mb-2">Your Swap Details</h3>
                          <div>{msg.text}</div>
                          {!executing && (
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
                                onClick={() => confirmSwap(msg.contractInput)}
                                className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
                              >
                                Confirm
                              </button>
                            </div>
                          )}
                        </div>
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
                        <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%] ">
                          <h3 className="text-lg font-semibold mb-2">Your Transfer Details</h3>
                          <div>{msg.text}</div>
                          {!executing && (
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
                                onClick={() => confirmSend(msg.send)}
                                className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
                              >
                                Confirm
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
                          <h3 className="text-lg font-semibold mb-2">Your Transfer Details</h3>
                          <div>{msg.text}</div>
                        </div>
                      )}
                    </>
                  ) : msg.type === "error" ? (
                    // ✅ Handle Error Messages with Exit Button
                    <div className="p-3 rounded-xl bg-red-700 text-white max-w-[75%]">
                      <p>{msg.text}</p>

                      {/* Show Exit Button ONLY for the latest error message */}
                      {isLastError && (
                        <button
                          type="button"
                          onClick={handleExit}
                          className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
                        >
                          Exit
                        </button>
                      )}
                    </div>
                  ) : (
                    // ✅ Default text-based message rendering
                    <div
                      className={`p-3 rounded-xl max-w-[75%] ${
                        msg.sender === "user"
                          ? "bg-white text-black self-end"
                          : "bg-zinc-800 text-white self-start"
                      }`}
                      style={{
                        wordBreak: "break-word",
                        maxWidth: "100%",
                        overflowWrap: "anywhere",
                      }}
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  )}
                </div>
              );
            })}
          {loading && <p className="text-gray-400">⏳ JECTA is thinking...</p>}
          {executing && <p className="text-gray-400">⏳ Executing...</p>}
        </div>

        {/* Chat Input */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <input
            className="w-full p-3 border border-zinc-600 rounded-lg bg-zinc-800 text-white"
            value={message}
            onChange={(e) => {
              const lastMessageType = chat.length > 0 ? chat[chat.length - 1].type : null;
              console.log(lastMessageType);
              console.log(loading);
              if (
                !(
                  validatorSelected ||
                  lastMessageType === "swap" ||
                  lastMessageType === "send_token" ||
                  loading ||
                  executing ||
                  lastMessageType === "validators"
                )
              ) {
                setMessage(e.target.value);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask to JECTA..."
          />
          <button
            type="button"
            className="p-3 bg-white text-black rounded-lg w-12 flex items-center justify-center"
            onClick={sendMessage}
          >
            ➤
          </button>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
