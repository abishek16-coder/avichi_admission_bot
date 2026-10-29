"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MicButton from "@/components/MicButton";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  voiceReplyEnabled: boolean;
  onToggleVoiceReply: () => void;
  isListening: boolean;
  voiceSupported: boolean;
  onToggleListening: () => void;
  transcript: string;
  language?: "en" | "ta";
}

export default function ChatInput({
  onSend,
  disabled = false,
  voiceReplyEnabled,
  onToggleVoiceReply,
  isListening,
  voiceSupported,
  onToggleListening,
  transcript,
  language = "en",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync speech transcript if listening
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [isListening, transcript]);

  // Auto-grow textarea up to ~110px
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const nextHeight = Math.min(ta.scrollHeight, 110);
    ta.style.height = `${Math.max(nextHeight, 28)}px`;
  }, [input]);

  function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const hasText = input.trim().length > 0;
  const placeholder = isListening
    ? language === "ta"
      ? "கேட்கிறது... உங்கள் கேள்வியைப் பேசுங்கள்"
      : "Listening... Speak your question"
    : language === "ta"
    ? "சேர்க்கை பற்றி கேளுங்கள்..."
    : "Ask about admissions...";

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Pill Container with Framer Motion spring config */}
      <motion.div
        layoutId="chat-input-pill"
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        className={`relative flex items-end gap-2 rounded-full border px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300 backdrop-blur-2xl ${
          isListening
            ? "border-red-500/70 shadow-[0_0_28px_rgba(239,68,68,0.35)] bg-[#120815]/95"
            : isFocused
            ? "border-primary-glow/60 shadow-[0_4px_30px_rgba(124,92,255,0.3)] bg-[#0C091C]/95"
            : "border-white/[0.12] bg-[#0A0718]/80 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        }`}
      >
        {/* Animated focus gradient border accent */}
        {isFocused && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none p-[1px] -z-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(124, 92, 255, 0.5), rgba(94, 234, 212, 0.4), rgba(167, 139, 250, 0.5))",
              filter: "blur(4px)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Left: Speaker toggle for voice replies */}
        <button
          type="button"
          onClick={onToggleVoiceReply}
          title={
            voiceReplyEnabled
              ? "Voice replies enabled (Click to mute)"
              : "Voice replies muted (Click to enable)"
          }
          aria-label={
            voiceReplyEnabled ? "Mute voice replies" : "Enable voice replies"
          }
          className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full transition-colors flex-shrink-0 mb-0.5 ${
            voiceReplyEnabled
              ? "text-primary-glow bg-primary/20 hover:bg-primary/30"
              : "text-text-muted hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          {voiceReplyEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>

        {/* Center: Auto-growing Textarea */}
        <div className="flex-1 min-w-0 pb-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            maxLength={600}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            aria-label="Ask admission question"
            className="w-full resize-none bg-transparent text-sm sm:text-base text-text placeholder:text-[#A9A3C7]/60 focus:outline-none leading-relaxed py-1"
            style={{ maxHeight: "110px" }}
          />
        </div>

        {/* Right: Mic Button or Send Button morph */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
          <AnimatePresence mode="wait" initial={false}>
            {hasText ? (
              <motion.button
                key="send-btn"
                type="button"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSubmit()}
                disabled={disabled}
                title="Send question (Enter)"
                aria-label="Send message"
                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-gradient-to-r from-primary to-purple-500 text-white shadow-[0_0_15px_rgba(124,92,255,0.5)] transition-opacity disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </motion.button>
            ) : (
              <motion.div
                key="mic-btn"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <MicButton
                  isListening={isListening}
                  isSupported={voiceSupported}
                  onToggle={onToggleListening}
                  language={language}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
