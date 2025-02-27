"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LogOut, MessageSquare, Wallet } from "lucide-react";

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
      {/* Header spacer to prevent content overlap */}
      <div className="h-14 w-fit " />

      {/* Fixed header */}
      <header
        className={cn(
          "fixed top-0  border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm transition-all duration-300 z-20",
          "hidden md:block", // Hide on mobile since we're using Sheet
          isCollapsed ? "left-20" : "left-72", // Adjust left position based on sidebar state
          "right-0" // Extend to the right edge
        )}
      >
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-zinc-200">JECTA Chat</h2>
            {isWhitelisted && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
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
                    {/* Backdrop to close popup when clicking outside */}
                    <div
                      className="fixed inset-0"
                      onClick={() => setShowPopup(false)}
                      onKeyDown={(e) => e.key === "Escape" && setShowPopup(false)}
                      role="button"
                      tabIndex={0}
                    />

                    {/* Popup menu */}
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

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="w-8" /> {/* Spacer for menu button */}
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
