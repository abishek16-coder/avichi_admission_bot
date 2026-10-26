"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3.5 py-4 w-full max-w-3xl"
    >
      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-brand to-brand-accent text-white shadow-sm flex-shrink-0 animate-pulse">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="flex-1 space-y-2.5 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium bg-gradient-to-r from-brand via-brand-accent to-brand bg-clip-text text-transparent animate-pulse">
            Thinking...
          </span>
        </div>

        {/* 3 shimmer skeleton lines */}
        <div className="space-y-2 pt-1 max-w-lg">
          <div className="h-3 w-4/5 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          <div className="h-3 w-3/5 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          <div className="h-3 w-2/5 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        </div>
      </div>
    </motion.div>
  );
}
