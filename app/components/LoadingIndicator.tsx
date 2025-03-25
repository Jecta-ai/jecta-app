import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  type: "thinking" | "executing" | "general";
}

const LoadingIndicator = ({ type }: LoadingIndicatorProps) => {
  if (type === "thinking") {
    return (
            <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center mt-8 justify-center gap-4 bg-zinc-900/80 backdrop-blur-lg px-6 py-3 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/10"
      >
        <div className="relative">
          <div className="flex gap-2">
            {[0, 0.2, 0.4].map((delay, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  y: [-4, 0, -4],
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0)",       // blue-500 transparent
                    "0 0 20px 2px rgba(59, 130, 246, 0.3)", // blue-500 glow
                    "0 0 0 0 rgba(59, 130, 246, 0)",       // blue-500 transparent
                  ],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                }}
              />
            ))}
          </div>
          <motion.div
            className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
            JECTA is thinking
          </span>
        </div>
      </motion.div>

    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-lg px-6 py-3 rounded-2xl border border-zinc-500/20"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-4 h-4 border-2 border-zinc-500/30 border-t-zinc-400 rounded-full"
      />
      <span className="text-sm font-medium text-zinc-400">Executing</span>
    </motion.div>
  );
};

export default LoadingIndicator;
