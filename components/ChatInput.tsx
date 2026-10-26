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
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync speech transcript into input if live listening
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [isListening, transcript]);

  // Auto-grow textarea up to 5 lines (~120px)
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const nextHeight = Math.min(ta.scrollHeight, 120);
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

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Gemini-style Pill Container */}
      <motion.div
        layoutId="chat-input-pill"
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        className={`relative flex items-end gap-2 rounded-full border px-3.5 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 backdrop-blur-xl ${
          isListening
            ? "border-red-400 dark:border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] bg-white/95 dark:bg-slate-900/95"
            : isFocused
            ? "border-brand dark:border-brand-accent shadow-[0_4px_28px_rgba(11,58,106,0.18)] dark:shadow-[0_4px_28px_rgba(201,162,39,0.18)] bg-white dark:bg-slate-900"
            : "border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-pill dark:shadow-pill-dark"
        }`}
      >
        {/* Left: Speaker toggle for voice replies */}
        <button
          type="button"
          onClick={onToggleVoiceReply}
          title={voiceReplyEnabled ? "Voice replies enabled (Click to mute)" : "Voice replies muted (Click to enable)"}
          aria-label={voiceReplyEnabled ? "Mute voice replies" : "Enable voice replies"}
          className={`grid h-9 w-9 place-items-center rounded-full transition-colors flex-shrink-0 ${
            voiceReplyEnabled
              ? "text-brand dark:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-800"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {voiceReplyEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Center: Auto-growing Textarea */}
        <div className="flex-1 min-w-0 pb-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            maxLength={600}
            disabled={disabled}
            placeholder={isListening ? "Listening... Speak your question" : "Ask about admissions..."}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            aria-label="Ask admission question"
            className="w-full resize-none bg-transparent text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none leading-relaxed py-1"
            style={{ maxHeight: "120px" }}
          />
        </div>

        {/* Right: Mic Button or Send Button morph */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
          <AnimatePresence mode="wait" initial={false}>
            {hasText ? (
              <motion.button
                key="send-btn"
                type="button"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSubmit()}
                disabled={disabled}
                title="Send message (Enter)"
                aria-label="Send message"
                className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white dark:bg-brand-accent dark:text-slate-900 shadow-md transition-opacity disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </motion.button>
            ) : (
              <motion.div
                key="mic-btn"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <MicButton
                  isListening={isListening}
                  isSupported={voiceSupported}
                  onToggle={onToggleListening}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Small Disclaimer */}
      <p className="mt-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 select-none">
        AI can make mistakes. Please confirm details with the Admission Office.
      </p>
    </div>
  );
}
