"use client";

import { motion } from "framer-motion";
import SuggestionChips from "@/components/SuggestionChips";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";
import { college } from "@/lib/config";

interface LandingHeroProps {
  onSend: (text: string) => void;
  voiceReplyEnabled: boolean;
  onToggleVoiceReply: () => void;
  isListening: boolean;
  voiceSupported: boolean;
  onToggleListening: () => void;
  transcript: string;
}

const greetingWords = ["Hello!", "Welcome", "to", "Avichi", "College"];

export default function LandingHero({
  onSend,
  voiceReplyEnabled,
  onToggleVoiceReply,
  isListening,
  voiceSupported,
  onToggleListening,
  transcript,
}: LandingHeroProps) {
  return (
    <div className="relative flex flex-col justify-between min-h-[100dvh] w-full px-4 py-6 overflow-hidden">
      {/* Top Bar on Landing Screen */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {college.city}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Center Hero Block */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-3xl mx-auto w-full text-center z-10 py-6">
        {/* Large Centered Logo with Breathing Glow Ring */}
        <div className="relative mb-6 sm:mb-8 group cursor-pointer">
          {/* Breathing Glow Ring */}
          <div
            className="animate-glow-ring absolute -inset-6 sm:-inset-8 rounded-full bg-gradient-to-tr from-brand via-brand-accent to-brand blur-2xl opacity-40 pointer-events-none"
            aria-hidden="true"
          />

          <motion.div
            layoutId="avichi-logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative grid h-28 w-28 sm:h-36 sm:w-36 place-items-center rounded-3xl bg-white/90 p-4 shadow-2xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Avichi College Logo"
              className="h-full w-full object-contain filter drop-shadow-md"
            />
          </motion.div>
        </div>

        {/* Word-by-word Gradient Greeting */}
        <motion.h1
          className="font-serif text-3xl sm:text-5xl md:text-5xl font-light tracking-tight leading-tight mb-2 sm:mb-3"
          aria-label="Hello! Welcome to Avichi College"
        >
          <span className="bg-gradient-to-r from-brand via-brand-accent to-brand bg-clip-text text-transparent inline-flex flex-wrap justify-center gap-x-2">
            {greetingWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.08,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-md font-sans"
        >
          How can I help with your admission today?
        </motion.p>

        {/* Centered Gemini Input Pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="w-full mb-6"
        >
          <ChatInput
            onSend={onSend}
            voiceReplyEnabled={voiceReplyEnabled}
            onToggleVoiceReply={onToggleVoiceReply}
            isListening={isListening}
            voiceSupported={voiceSupported}
            onToggleListening={onToggleListening}
            transcript={transcript}
          />
        </motion.div>

        {/* Suggestion Chips */}
        <SuggestionChips onSelect={onSend} />
      </div>

      {/* Bottom Footer Info on Landing */}
      <div className="w-full text-center text-xs text-slate-400 dark:text-slate-500 z-10 pt-4">
        {college.name} Admission Portal · University of Madras Affiliated
      </div>
    </div>
  );
}
