"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Volume2, VolumeX } from "lucide-react";

interface BotMessageActionsProps {
  messageText: string;
  isLast: boolean;
  isSpeaking: boolean;
  onReadAloud: (text: string) => void;
  onRegenerate?: () => void;
}

export default function BotMessageActions({
  messageText,
  isLast,
  isSpeaking,
  onReadAloud,
  onRegenerate,
}: BotMessageActionsProps) {
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

  return (
    <div className="flex items-center gap-1 pt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
      {/* Copy button with toast */}
      <div className="relative">
        <button
          type="button"
          onClick={handleCopy}
          title="Copy response"
          aria-label="Copy response"
          className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        {copied && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm dark:bg-slate-100 dark:text-slate-900 pointer-events-none">
            Copied!
          </span>
        )}
      </div>

      {/* Read aloud */}
      <button
        type="button"
        onClick={() => onReadAloud(messageText)}
        title={isSpeaking ? "Stop reading" : "Read aloud"}
        aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
        className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
          isSpeaking
            ? "bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-accent"
            : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        }`}
      >
        {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      </button>

      {/* Thumbs up */}
      <button
        type="button"
        onClick={() => handleFeedback("up")}
        title="Good response"
        aria-label="Good response"
        className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
          feedback === "up"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>

      {/* Thumbs down */}
      <button
        type="button"
        onClick={() => handleFeedback("down")}
        title="Poor response"
        aria-label="Poor response"
        className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
          feedback === "down"
            ? "text-red-500 dark:text-red-400"
            : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>

      {/* Regenerate (if last message) */}
      {isLast && onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          title="Regenerate answer"
          aria-label="Regenerate answer"
          className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
