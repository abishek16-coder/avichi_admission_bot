"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
} from "lucide-react";

interface BotActionsProps {
  messageText: string;
  isLast: boolean;
  isSpeaking: boolean;
  onReadAloud: (text: string) => void;
  onRegenerate?: () => void;
  language?: "en" | "ta";
}

export default function BotActions({
  messageText,
  isLast,
  isSpeaking,
  onReadAloud,
  onRegenerate,
  language = "en",
}: BotActionsProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  function handleFeedback(type: "up" | "down") {
    setFeedback((prev) => (prev === type ? null : type));
  }

  const isTamil = language === "ta";

  return (
    <div className="flex items-center gap-1 pt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
      {/* Copy button with toast */}
      <div className="relative">
        <button
          type="button"
          onClick={handleCopy}
          title={isTamil ? "நகலெடு" : "Copy response"}
          aria-label={isTamil ? "நகலெடு" : "Copy response"}
          className="grid h-7 w-7 place-items-center rounded-lg text-[#A9A3C7] hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
        {copied && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-[#090717] border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white shadow-md pointer-events-none whitespace-nowrap">
            {isTamil ? "நகலெடுக்கப்பட்டது!" : "Copied!"}
          </span>
        )}
      </div>

      {/* Read aloud toggle */}
      <button
        type="button"
        onClick={() => onReadAloud(messageText)}
        title={
          isSpeaking
            ? isTamil
              ? "வாசிப்பதை நிறுத்து"
              : "Stop reading"
            : isTamil
            ? "குரலில் கேள்"
            : "Read aloud"
        }
        aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
        className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
          isSpeaking
            ? "bg-primary/20 text-primary-glow"
            : "text-[#A9A3C7] hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        {isSpeaking ? (
          <VolumeX className="h-3.5 w-3.5" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Thumbs up */}
      <button
        type="button"
        onClick={() => handleFeedback("up")}
        title="Helpful response"
        aria-label="Thumbs up"
        className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
          feedback === "up"
            ? "text-emerald-400 bg-emerald-500/10"
            : "text-[#A9A3C7] hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>

      {/* Thumbs down */}
      <button
        type="button"
        onClick={() => handleFeedback("down")}
        title="Not helpful"
        aria-label="Thumbs down"
        className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
          feedback === "down"
            ? "text-rose-400 bg-rose-500/10"
            : "text-[#A9A3C7] hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>

      {/* Regenerate if last message */}
      {isLast && onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          title={isTamil ? "மீண்டும் பதில் உருவாக்கு" : "Regenerate response"}
          aria-label="Regenerate"
          className="grid h-7 w-7 place-items-center rounded-lg text-[#A9A3C7] hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

