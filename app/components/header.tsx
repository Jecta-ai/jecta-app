"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { LogOut, MessageSquare, Wallet } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  injectiveAddress: string | null;
  setInjectiveAddress: (address: string | null) => void;
  isWhitelisted: boolean;
  isCollapsed?: boolean;
}

const Header = ({
  injectiveAddress,
  setInjectiveAddress,
  isWhitelisted,
  isCollapsed = false,
}: HeaderProps) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleDisconnect = () => {
    setInjectiveAddress(null);
    setShowPopup(false);
    localStorage.removeItem("token");

    window.location.reload();
  };

  return (
    <>
      <div className="h-14 w-fit " />

      <header
        className={cn(
          "fixed top-0  border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm transition-all duration-300 z-20",
          "hidden md:block",
          isCollapsed ? "left-20" : "left-72",
          "right-0"
        )}
      >
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-zinc-200">JECTA</h2>
            {isWhitelisted && (
              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
              Early Access
            </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {injectiveAddress ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 gap-2 text-sm text-zinc-50 hover:text-zinc-200 hover:bg-zinc-800/50 bg-slate-700",
                    showPopup && "bg-zinc-800 text-zinc-200"
                  )}
                  onClick={() => setShowPopup(!showPopup)}
                >
                  <Wallet className="h-4 w-4" />
                  <span>
                    {injectiveAddress.slice(0, 6)}...{injectiveAddress.slice(-4)}
                  </span>
                </Button>

                {showPopup && (
                  <>
                    <div
                      className="fixed inset-0"
                      onClick={() => setShowPopup(false)}
                      onKeyDown={(e) => e.key === "Escape" && setShowPopup(false)}
                      role="button"
                      tabIndex={0}
                    />

                    <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl">
                      <div className="px-3 py-2">
                        <p className="text-xs font-medium text-zinc-400">Connected Address</p>
                        <p className="mt-1 break-all text-sm text-zinc-200">{injectiveAddress}</p>
                      </div>
                      <div className="h-px bg-zinc-800" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 rounded-none px-3 py-2 text-sm font-normal text-red-400 hover:bg-zinc-800 hover:text-red-400 z-50"
                        onClick={handleDisconnect}
                      >
                        <LogOut className="h-4 w-4" />
                        Disconnect
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="w-8" /> 
          <h2 className="text-lg font-semibold text-zinc-200">JECTA Chat</h2>
          <div className="flex items-center">
            {injectiveAddress && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-sm text-zinc-400"
                onClick={() => setShowPopup(!showPopup)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
