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
  BookOpenCheck,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";

const suggestions = [
  {
    title: "Injective Basics",
    icon: <Rocket className="w-5 h-5" />,
    description: "Learn the fundamentals",
    prompts: [
      { text: "What is Injective?", icon: <Zap className="w-4 h-4" /> },
      { text: "How do I get started with Injective?", icon: <ArrowRight className="w-4 h-4" /> },
      { text: "What are the key features of Injective?", icon: <Code className="w-4 h-4" /> },
    ],
  },
  {
    title: "Trading & DeFi",
    icon: <LineChart className="w-5 h-5" />,
    description: "Explore DeFi opportunities",
    prompts: [
      { text: "Swap 1 INJ to QUNT", icon: <Coins className="w-4 h-4" /> },
      { text: "What is the current price of HDRO ?", icon: <Wallet className="w-4 h-4" /> },
      { text: "I want to stake INJ.", icon: <Server className="w-4 h-4" /> },
    ],
  },
  {
    title: "Technical Insights",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Deep dive into Injective",
    prompts: [
      { text: "Explain me a tx by its own hash.", icon: <Server className="w-4 h-4" /> },
      { text: "I want to see my own portfolio.", icon: <Zap className="w-4 h-4" /> },
      { text: "Analyze SHROOM for me.", icon: <TrendingUp className="w-4 h-4" /> },
    ],
  },
  {
    title: "Governance & Auctions",
    icon: <ShieldCheck className="w-5 h-5" />,
    description: "Track proposals and bidding",
    prompts: [
      { text: "Show me the Injective governance proposals.", icon: <BookOpenCheck className="w-4 h-4" /> },
      { text: "Get me the most recent Injective auction.", icon: <Zap className="w-4 h-4" /> },
      { text: "Place a bid for me in the latest auction.", icon: <ArrowRight className="w-4 h-4" /> },
    ],
  },
  {
    title: "Advanced Wallet Tools",
    icon: <Wallet className="w-5 h-5" />,
    description: "Portfolio & token tracking",
    prompts: [
      { text: "Fetch my Injective portfolio.", icon: <Wallet className="w-4 h-4" /> },
      { text: "Analyze the portfolio of this user.", icon: <Server className="w-4 h-4" /> },
      { text: "Send 5 INJ to this wallet address.", icon: <ArrowRight className="w-4 h-4" /> },
    ],
  },
  {
    title: "Ecosystem Metrics",
    icon: <LineChart className="w-5 h-5" />,
    description: "Track auctions, TVL, and governance",
    prompts: [
      { text: "Show me the total TVL of Injective.", icon: <TrendingUp className="w-4 h-4" /> },
      { text: "Get me the most recent Injective auction.", icon: <Zap className="w-4 h-4" /> },
      { text: "Show me the Injective governance proposals.", icon: <BookOpenCheck className="w-4 h-4" /> },
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
      className={cn(
        "w-full mb-4 mt-4 sm:mt-6 lg:mt-8",
        isCollapsed ? "pl-28 mx-auto" : "px-4 sm:px-6"
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[calc(100vh-250px)] overflow-y-auto pb-4">

        {suggestions.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            className="bg-black/40 backdrop-blur-sm rounded-xl p-2 sm:p-3 lg:p-4 border border-zinc-600/50 hover:border-zinc-400/50 transition-all duration-300 group shadow-lg w-full"
          >
            <div className="flex items-center gap-2 mb-1 sm:mb-2 lg:mb-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-zinc-800/50 text-zinc-300 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                {category.icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base text-zinc-200 font-medium group-hover:text-white transition-colors">
                  {category.title}
                </h3>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="space-y-0.5 sm:space-y-1 lg:space-y-2 pl-8">
              {category.prompts.map((prompt) => (
                <Button
                  key={prompt.text}
                  variant="ghost"
                  className="w-full justify-start text-left text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 rounded-xl h-6 sm:h-7 lg:h-8 px-2 sm:px-3 overflow-hidden"
                  onClick={() => onSuggestionClick(prompt.text)}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="text-zinc-500 group-hover:text-white transition-colors">
                      {prompt.icon}
                    </div>
                    <span className="line-clamp-1 text-xs overflow-hidden text-ellipsis">
                      {prompt.text}
                    </span>
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
