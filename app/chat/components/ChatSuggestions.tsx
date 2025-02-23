import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { useMenu } from "../providers/menuProvider";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Rocket = dynamic(() => import("lucide-react").then((mod) => mod.Rocket), {
  ssr: false,
});

const LineChart = dynamic(() => import("lucide-react").then((mod) => mod.LineChart), {
  ssr: false,
});

const ArrowRight = dynamic(() => import("lucide-react").then((mod) => mod.ArrowRight), {
  ssr: false,
});

const Code = dynamic(() => import("lucide-react").then((mod) => mod.Code), {
  ssr: false,
});

const Coins = dynamic(() => import("lucide-react").then((mod) => mod.Coins), {
  ssr: false,
});

const Wallet = dynamic(() => import("lucide-react").then((mod) => mod.Wallet), {
  ssr: false,
});

const Server = dynamic(() => import("lucide-react").then((mod) => mod.Server), {
  ssr: false,
});

const MessageSquare = dynamic(() => import("lucide-react").then((mod) => mod.MessageSquare), {
  ssr: false,
});

const Zap = dynamic(() => import("lucide-react").then((mod) => mod.Zap), {
  ssr: false,
});

const suggestions = [
  {
    title: "Injective Basics",
    icon: <Rocket className="w-5 h-5" />,
    description: "Learn the fundamentals",
    prompts: [
      {
        text: "What is Injective Protocol?",
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
        text: "How do I start trading on Injective?",
        icon: <Coins className="w-4 h-4" />,
      },
      {
        text: "What are the trading fees?",
        icon: <Wallet className="w-4 h-4" />,
      },
      {
        text: "How to provide liquidity on Injective?",
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
        text: "How to integrate Injective into my dApp?",
        icon: <Code className="w-4 h-4" />,
      },
      {
        text: "Explain Injective's smart contract capabilities",
        icon: <Server className="w-4 h-4" />,
      },
      {
        text: "What are Injective's supported chains?",
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
