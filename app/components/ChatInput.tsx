"use client";

import { cn } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import ChatSuggestions from "./ChatSuggestions";
import { useMenu } from "../providers/menuProvider";
import { SendHorizontal } from "lucide-react";
import { Button } from "./ui/button";

interface ChatInputProps {
  loading: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  disableSend: () => boolean;
  isEmptyState?: boolean;
}

const ChatInput = ({ loading, onSubmit, disableSend, isEmptyState }: ChatInputProps) => {
  const { isCollapsed } = useMenu();
  const [message, setMessage] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
    (e.target as HTMLFormElement).reset();
    setMessage("");
  };

  const handleSuggestionClick = (prompt: string) => {
    const formData = new FormData();
    formData.append("userMessage", prompt);
    setMessage(prompt);

    onSubmit(formData);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disableSend()) {
        const form = e.currentTarget.form;
        if (form) {
          const syntheticEvent = {
            preventDefault: () => {},
            currentTarget: form,
            target: form,
          } as unknown as FormEvent<HTMLFormElement>;

          handleSubmit(syntheticEvent);
        }
      }
    }
  };

  if (isEmptyState) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed inset-0 flex flex-col items-center justify-start pt-16 sm:pt-20 md:pt-24 md:pl-72 pointer-events-none transition-all duration-300 z-10",
          isCollapsed && "md:pl-0"
        )}
      >
        <div className="w-full px-4 sm:px-6 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl mt-4  sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent">
              Welcome to JECTA
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400">
              Your AI assistant for the Injective ecosystem
            </p>
          </motion.div>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col mb-4 sm:mb-6 max-w-2xl mx-auto w-full"
            onSubmit={handleSubmit}
          >
            <div className="relative group">
              <textarea
                name="userMessage"
                rows={1}
                className="w-full bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-4 pr-14 leading-relaxed resize-none focus:outline-none border border-zinc-800/50 hover:border-zinc-700/50 focus:border-zinc-600 text-zinc-100 placeholder:text-zinc-600 transition-all duration-200 text-base shadow-lg"
                placeholder="Ask Jecta..."
                style={{
                  minHeight: "56px",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                }}
                onKeyDown={handleEnterKeyPress}
              />
              <Button
                className={cn(
                  "absolute right-3 bottom-4 h-10 w-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed p-0 flex items-center justify-center transition-all duration-200 hover:scale-105",
                  loading && "animate-pulse"
                )}
                disabled={disableSend()}
                type="submit"
              >
                <SendHorizontal className="w-4 h-4 text-zinc-300" />
              </Button>
            </div>
          </motion.form>
          <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 md:left-72 bg-gradient-to-t from-black via-black/90 to-transparent pt-6 pb-6 transition-all duration-300",
        isCollapsed && "md:left-20"
      )}
    >
      <div className="max-w-2xl mx-auto px-6">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="relative group">
            <textarea
              name="userMessage"
              rows={1}
              className="w-full bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-4 pr-14 resize-none focus:outline-none border border-zinc-600/50 hover:border-zinc-400/50 focus:border-zinc-600 text-zinc-100 placeholder:text-zinc-600 transition-all duration-200 shadow-lg"
              placeholder="Message JECTA..."
              style={{
                minHeight: "56px",
                maxHeight: "200px",
                overflow: "auto",
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
              }}
              onKeyDown={handleEnterKeyPress}
            />
            <Button
              className={cn(
                "absolute right-3 bottom-4 h-10 w-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed p-0 flex items-center justify-center transition-all duration-200 hover:scale-105",
                loading && "animate-pulse"
              )}
              disabled={disableSend()}
              type="submit"
            >
              <SendHorizontal className="w-4 h-4 text-zinc-300" />
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatInput;
