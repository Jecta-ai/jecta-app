import { motion } from "framer-motion";

import { useMenu } from "../providers/menuProvider";
import { cn } from "@/lib/utils";
import {
  Rocket,
  LineChart,
  ArrowRight,
  Code,
  Coins,
  Wallet,
  Server,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";

const suggestions = [
  {
    title: "Injective Basics",
    icon: <Rocket className="w-5 h-5" />,
    description: "Learn the fundamentals",
    prompts: [
      {
        text: "What is Injective ?",
        icon: <Zap className="w-4 h-4" />,
      },
      {
        text: "How do I get started with Injective?",
        icon: <ArrowRight className="w-4 h-4" />,
      },
      {
        text: "What are the key features of Injective?",
        icon: <Code className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Trading & DeFi",
    icon: <LineChart className="w-5 h-5" />,
    description: "Explore opportunities",
    prompts: [
      {
        text: "I want to swap 1 INJ to USDT",
        icon: <Coins className="w-4 h-4" />,
      },
      {
        text: "What is the current price of QUNT ?",
        icon: <Wallet className="w-4 h-4" />,
      },
      {
        text: "I want to stake INJ.",
        icon: <Server className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Technical",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Deep dive into tech",
    prompts: [
      {
        text: "Give me the latest Injective news.",
        icon: <Code className="w-4 h-4" />,
      },
      {
        text: "Explain me a tx by it's own hash.",
        icon: <Server className="w-4 h-4" />,
      },
      {
        text: "I want to see my own portfolio.",
        icon: <Zap className="w-4 h-4" />,
      },
    ],
  },
];

interface ChatSuggestionsProps {
  onSuggestionClick: (prompt: string) => void;
}

const ChatSuggestions = ({ onSuggestionClick }: ChatSuggestionsProps) => {
  const { isCollapsed } = useMenu();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("w-full px-6 mb-8 mt-12", isCollapsed && "pl-24  mx-auto")}
    >
      <div className="flex gap-4 h-full">
        {suggestions.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-600/50 hover:border-zinc-400/50 transition-all duration-300 group shadow-lg w-full"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-zinc-800/50 text-zinc-300 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                {category.icon}
              </div>
              <div>
                <h3 className="text-base text-zinc-200 font-medium group-hover:text-white transition-colors">
                  {category.title}
                </h3>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="space-y-2 pl-11">
              {category.prompts.map((prompt) => (
                <Button
                  key={prompt.text}
                  variant="ghost"
                  className="w-full justify-start text-left text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 rounded-xl h-8 px-3"
                  onClick={() => onSuggestionClick(prompt.text)}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-zinc-500 group-hover:text-white transition-colors">
                      {prompt.icon}
                    </div>
                    <span className="line-clamp-1 text-xs">{prompt.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatSuggestions;
