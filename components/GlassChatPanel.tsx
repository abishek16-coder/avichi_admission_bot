"use client";

import { motion } from "framer-motion";
import ChatInput from "@/components/ChatInput";
import SuggestionChips from "@/components/SuggestionChips";

interface GlassChatPanelProps {
  onSend: (text: string) => void;
  voiceReplyEnabled: boolean;
  onToggleVoiceReply: () => void;
  isListening: boolean;
  voiceSupported: boolean;
  onToggleListening: () => void;
  transcript: string;
  disabled?: boolean;
  language?: "en" | "ta";
}

export default function GlassChatPanel({
  onSend,
  voiceReplyEnabled,
  onToggleVoiceReply,
  isListening,
  voiceSupported,
  onToggleListening,
  transcript,
  disabled = false,
  language = "en",
}: GlassChatPanelProps) {
  return (
    <motion.div
      layoutId="glass-chat-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.3 }}
      className="relative w-full max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.10] shadow-[0_-12px_40px_rgba(124,92,255,0.08)] backdrop-blur-xl"
    >
      {/* Subtle top inner glow where it meets the halo */}
      <div
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full bg-primary/20 blur-2xl -z-10"
        aria-hidden="true"
      />

      <div className="space-y-3.5">
        <ChatInput
          onSend={onSend}
          disabled={disabled}
          voiceReplyEnabled={voiceReplyEnabled}
          onToggleVoiceReply={onToggleVoiceReply}
          isListening={isListening}
          voiceSupported={voiceSupported}
          onToggleListening={onToggleListening}
          transcript={transcript}
          language={language}
        />

        <SuggestionChips onSelect={onSend} language={language} />
      </div>
    </motion.div>
  );
}

