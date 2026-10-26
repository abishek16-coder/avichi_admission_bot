"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MessageItem, ChatStatus } from "@/hooks/useChat";
import MessageBubble from "@/components/MessageBubble";
import ThinkingIndicator from "@/components/ThinkingIndicator";

interface MessageListProps {
  messages: MessageItem[];
  status: ChatStatus;
  isSpeaking: boolean;
  onReadAloud: (text: string) => void;
  onRegenerate: () => void;
}

export default function MessageList({
  messages,
  status,
  isSpeaking,
  onReadAloud,
  onRegenerate,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isAutoScrollActive = useRef(true);

  // Check scroll position to display the "scroll to bottom" floating pill
  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isUp = distanceFromBottom > 140;
    setShowScrollBottom(isUp);
    isAutoScrollActive.current = !isUp;
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
    isAutoScrollActive.current = true;
  }

  useEffect(() => {
    if (isAutoScrollActive.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto px-4 sm:px-6 md:px-8 py-6 max-w-4xl mx-auto space-y-2"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((m, idx) => (
          <MessageBubble
            key={m.id}
            message={m}
            isLast={idx === messages.length - 1}
            isSpeaking={isSpeaking}
            onReadAloud={onReadAloud}
            onRegenerate={onRegenerate}
          />
        ))}

        {status === "thinking" && <ThinkingIndicator />}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Floating Scroll to Bottom button */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={scrollToBottom}
            title="Scroll to latest message"
            aria-label="Scroll to bottom"
            className="absolute bottom-4 right-6 sm:right-10 z-20 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-200 backdrop-blur-md"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
