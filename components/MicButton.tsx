"use client";

import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface MicButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
}

export default function MicButton({
  isListening,
  isSupported,
  onToggle,
}: MicButtonProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      title={isListening ? "Stop listening" : "Voice input (Speak to ask)"}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
      aria-pressed={isListening}
      className={`relative grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 ${
        isListening
          ? "bg-red-500 text-white shadow-md shadow-red-500/30"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      }`}
    >
      {isListening && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-400/40" />
      )}
      {isListening ? (
        <span className="waveform flex items-end gap-[2px] h-3.5" aria-hidden="true">
          <span className="w-[2.5px] bg-white rounded-full h-full" />
          <span className="w-[2.5px] bg-white rounded-full h-full" />
          <span className="w-[2.5px] bg-white rounded-full h-full" />
        </span>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </motion.button>
  );
}
