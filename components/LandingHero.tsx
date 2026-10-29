"use client";

import { AnimatePresence, motion } from "framer-motion";
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
  isSpeaking: boolean;
  isThinking: boolean;
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
  isSpeaking,
  isThinking,
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
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.045, 0.99, 1.03, 1] : isThinking ? [1, 1.02, 1] : 1,
              rotate: isSpeaking ? [0, 1.5, -1.5, 1, 0] : 0,
            }}
            transition={{
              duration: isSpeaking ? 1.7 : 2.6,
              repeat: isSpeaking || isThinking ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="relative"
            aria-label={isSpeaking ? "Assistant speaking" : isThinking ? "Assistant responding" : "College logo"}
          >
            <motion.div
              animate={{ opacity: isSpeaking ? [0.25, 0.72, 0.38, 0.65, 0.25] : isThinking ? [0.2, 0.45, 0.2] : 0.3, scale: isSpeaking ? [1, 1.12, 1.02, 1.1, 1] : 1 }}
              transition={{ duration: isSpeaking ? 1.7 : 2.6, repeat: isSpeaking || isThinking ? Infinity : 0, ease: "easeInOut" }}
              className="absolute -inset-6 rounded-full bg-gradient-to-tr from-brand via-brand-accent to-brand blur-2xl pointer-events-none"
              aria-hidden="true"
            />
            <motion.div
              animate={{ scale: isSpeaking ? [1, 1.12, 1.2, 1.06, 1] : isThinking ? [1, 1.07, 1] : 1, opacity: isSpeaking ? [0.28, 0.08, 0.2, 0.04, 0.28] : 0 }}
              transition={{ duration: 1.7, repeat: isSpeaking ? Infinity : 0, ease: "easeInOut" }}
              className="absolute -inset-3 rounded-[2rem] border border-brand/50 dark:border-brand-accent/50"
              aria-hidden="true"
            />
            <motion.div
              layoutId="avichi-logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, boxShadow: isSpeaking ? "0 18px 60px rgba(11,58,106,0.26)" : "0 18px 45px rgba(15,23,42,0.12)" }}
              whileHover={{ scale: isSpeaking ? 1 : 1.04 }}
              transition={{ type: "spring", stiffness: 220, damping: 24, opacity: { duration: 0.4 }, boxShadow: { duration: 0.7 } }}
              className="relative grid h-28 w-28 sm:h-36 sm:w-36 place-items-center rounded-3xl bg-white/90 p-4 border border-slate-100 dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Avichi College Logo" className="h-full w-full object-contain filter drop-shadow-md" />
            </motion.div>
            <AnimatePresence>
              {isSpeaking && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-brand dark:text-brand-accent">
                  <span className="flex h-4 items-center gap-0.5" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((bar) => {
                      const heights = [
                        [4, 11, 5, 8, 4],
                        [4, 9, 5, 11, 4],
                        [4, 8, 5, 9, 4],
                        [4, 11, 5, 10, 4],
                        [4, 9, 5, 11, 4],
                      ];
                      return (
                        <motion.span
                          key={bar}
                          className="w-0.5 rounded-full bg-current"
                          animate={{ height: heights[bar] }}
                          transition={{ duration: 0.8 + bar * 0.07, repeat: Infinity, ease: "easeInOut", delay: bar * 0.08 }}
                        />
                      );
                    })}
                  </span>
                  Speaking
                </motion.div>
              )}
            </AnimatePresence>
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
