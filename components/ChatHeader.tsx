"use client";

import { motion } from "framer-motion";
import { Plus, ExternalLink } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { college } from "@/lib/config";

interface ChatHeaderProps {
  onNewChat: () => void;
  isSpeaking: boolean;
}

export default function ChatHeader({ onNewChat, isSpeaking }: ChatHeaderProps) {
  return (
    <header className="relative z-30 flex items-center justify-between w-full px-4 sm:px-6 py-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      {/* Left: Glided Logo with layoutId + Assistant Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* Speaking animated glow pulse */}
          {isSpeaking && (
            <span className="absolute -inset-1 rounded-full bg-brand/30 dark:bg-brand-accent/30 animate-ping" />
          )}
          <motion.div
            layoutId="avichi-logo"
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`relative grid h-9 w-9 place-items-center rounded-full overflow-hidden border ${
              isSpeaking
                ? "border-brand ring-2 ring-brand/40"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Avichi College"
              className="h-7 w-7 object-contain"
            />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Avichi Admission Assistant
            </h1>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            {college.name}
          </p>
        </div>
      </div>

      {/* Right Actions: New Chat, Apply link, Theme */}
      <div className="flex items-center gap-2">
        <a
          href={college.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-brand-accent/15 text-brand dark:text-brand-accent hover:bg-brand-accent/25 transition-colors"
        >
          <span>Apply Online</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNewChat}
          title="Start a new chat conversation"
          aria-label="New chat"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New chat</span>
        </motion.button>

        <ThemeToggle />
      </div>
    </header>
  );
}
