"use client";
import { connectWallet } from "@/wallet/connectWallet";
import { useState } from "react";
import type { ChatMessage } from "../types";

interface MenuProps {
  injectiveAddress: string | null;
  setInjectiveAddress: (address: string | null) => void;
}

const Menu = ({ injectiveAddress, setInjectiveAddress }: MenuProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const handleConnectWallet = async () => {
    console.log("Connecting wallet");

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

  return (
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
  );
};

export default Menu;
