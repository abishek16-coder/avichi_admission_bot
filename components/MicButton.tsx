"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";

interface MicButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  language?: "en" | "ta";
}

export default function MicButton({
  isListening,
  isSupported,
  onToggle,
  language = "en",
}: MicButtonProps) {
  if (!isSupported) {
    return null;
  }

  const label = isListening
    ? language === "ta"
      ? "கேட்பதை நிறுத்துங்கள்"
      : "Stop listening"
    : language === "ta"
    ? "குரல் மூலம் கேளுங்கள்"
    : "Voice input (Speak to ask)";

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Expanding Ripple Circles while listening */}
      {isListening && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border border-red-500/50 pointer-events-none"
            animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border border-red-400/30 pointer-events-none"
            animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          />
        </>
      )}

      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={onToggle}
        title={label}
        aria-label={label}
        aria-pressed={isListening}
        className={`relative grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 z-10 ${
          isListening
            ? "bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.6)]"
            : "text-text-muted hover:text-white hover:bg-white/[0.08]"
        }`}
      >
        {isListening ? (
          /* Live animated waveform bars */
          <span className="flex items-end justify-center gap-[2.5px] h-3.5 w-4" aria-hidden="true">
            <motion.span
              className="w-[2.5px] bg-white rounded-full"
              animate={{ height: ["4px", "14px", "6px", "12px", "4px"] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="w-[2.5px] bg-white rounded-full"
              animate={{ height: ["10px", "5px", "14px", "7px", "10px"] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.span
              className="w-[2.5px] bg-white rounded-full"
              animate={{ height: ["6px", "14px", "4px", "12px", "6px"] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </span>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </motion.button>
    </div>
  );
}
