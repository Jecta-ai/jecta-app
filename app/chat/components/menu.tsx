"use client";
import { useEffect, useState } from "react";
import { getLastChatNames } from "../services/chatServices";
import type { Chat } from "../services/types";
import { getRefCodeDetails } from "../referralUtils";

interface MenuProps {
  loadChatHistory: (chatId: string) => void;
  createNewChatButton: () => void;
  injectiveAddress: string | null;
  setInjectiveAddress: (address: string | null) => void;
  allChats: Chat[];
  setAllChats: (chats: Chat[]) => void;
  newChatCreated: number;
  setNewChatCreated: (number: number) => void;
  isWhitelisted: boolean;
}

const Menu = ({
  injectiveAddress,
  setInjectiveAddress,
  loadChatHistory,
  allChats,
  setAllChats,
  newChatCreated,
  createNewChatButton,
  isWhitelisted,
}: MenuProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [lastChats, setLastChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [refDetails, setRefDetails] = useState<any>();
  const [copySuccess, setCopySuccess] = useState<string>("");

  useEffect(() => {
    const fetchLastChatNames = async () => {
      const response = await getLastChatNames(injectiveAddress || "");
      if (response) {
        const sortedChats = response.sort(
          (a: { updated_at: string | number | Date }, b: { updated_at: string | number | Date }) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setLastChats(sortedChats);
        setAllChats(sortedChats);
      }
    };
    fetchLastChatNames();
  }, [injectiveAddress, newChatCreated]);

  useEffect(() => {
    const getRef = async () => {
      if (isWhitelisted) {
        const response = await getRefCodeDetails(injectiveAddress);
        if (response) {
          setRefDetails(response);
        }
      }
    };
    getRef();
  }, [isWhitelisted]);

  const handleDisconnect = async () => {
    setInjectiveAddress(null);
    setShowPopup(false);
    window.location.reload();
  };
  const copyToClipboard = () => {
    if (refDetails?.ref_code) {
      navigator.clipboard.writeText(refDetails.ref_code);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  return (
    <aside className="w-1/5 min-h-screen bg-zinc-900 text-white p-6 flex flex-col justify-between shadow-lg border-r border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          JECTA <span className="text-sm text-gray-400">v0.0.2</span>
        </h1>
        <nav className="mt-6 space-y-2">
          <ul className="space-y-2">
            <li className="py-3 px-4 rounded-lg bg-zinc-800 text-gray-200 font-semibold flex items-center gap-2 cursor-pointer">
              JECTA
            </li>
            <li className="py-3 px-4 hover:bg-zinc-800 rounded-lg cursor-pointer flex items-center gap-2 transition">
              DOCS
            </li>
            <li className="py-3 px-4 cursor-pointer">
              {injectiveAddress && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={createNewChatButton}
                    className="w-full py-2 mb-2 bg-green-500 rounded-lg hover:bg-green-600 text-white font-semibold transition"
                  >
                    Create Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPopup(!showPopup)}
                    className="w-full py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white font-semibold transition"
                  >
                    {injectiveAddress.slice(0, 6)}...{injectiveAddress.slice(-4)}
                  </button>

                  {showPopup && (
                    <div className="absolute top-14 left-0 bg-gray-800 text-white p-3 rounded-lg shadow-lg w-full">
                      <button
                        type="button"
                        onClick={handleDisconnect}
                        className="w-full text-left hover:text-red-500 transition"
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
        {isWhitelisted && refDetails && (
          <div className="mt-4 p-4 bg-zinc-800 rounded-lg text-gray-200 relative">
            <h3 className="text-lg font-semibold">Referral Details</h3>
            <div className="flex items-center gap-2 text-sm ">
              <span>REF :</span>
              <span onClick={copyToClipboard} className="hover:cursor-pointer hover:text-blue-400">
                {refDetails.ref_code.slice(0, 6)}...{refDetails.ref_code.slice(-4)}
              </span>
            </div>
            <p className="text-sm">Ref Used: {refDetails.count}</p>
            {copySuccess && (
              <span className="text-green-400 text-xs absolute right-2 top-2">{copySuccess}</span>
            )}
          </div>
        )}
        <div className="px-4 py-2 flex items-center transition">CHATS</div>
        <div className=" border-t border-zinc-800 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {lastChats.map((chat, i) => (
            <li
              key={i}
              className={`py-3 px-4 rounded-lg cursor-pointer transition ${
                selectedChat === chat.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-zinc-800 text-gray-300 hover:text-white"
              }`}
              onClick={() => {
                setSelectedChat(chat.id);
                loadChatHistory(chat.id);
              }}
            >
              {chat.title}
            </li>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-500">@jecta</div>
    </aside>
  );
};

export default Menu;
