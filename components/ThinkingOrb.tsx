"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ThinkingOrbProps {
  language?: "en" | "ta";
}

export default function ThinkingOrb({ language = "en" }: ThinkingOrbProps) {
  const text = language === "ta" ? "சிந்திக்கிறது..." : "Thinking...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3.5 py-4 w-full max-w-2xl"
    >
      {/* Pulsing Glow Orb Avatar */}
      <div className="relative flex-shrink-0 mt-0.5">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1 rounded-full bg-primary/40 blur-md pointer-events-none"
        />
        <div className="relative grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-gradient-to-tr from-primary via-purple-500 to-accent text-white shadow-[0_0_15px_rgba(167,139,250,0.6)]">
          <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      </div>

      {/* Shimmer skeleton lines */}
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-primary-glow animate-pulse">
            {text}
          </span>
        </div>

        {/* 3 shimmer skeleton lines */}
        <div className="space-y-2 pt-0.5 max-w-md">
          <div className="relative h-2.5 w-4/5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep" />
          </div>
          <div className="relative h-2.5 w-3/5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep" />
          </div>
          <div className="relative h-2.5 w-2/5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

