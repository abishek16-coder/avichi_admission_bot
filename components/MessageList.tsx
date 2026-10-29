"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, AlertCircle, RotateCcw, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MessageItem, ChatStatus } from "@/hooks/useChat";
import MessageBubble from "@/components/MessageBubble";
import ThinkingOrb from "@/components/ThinkingOrb";
import LeadCard from "@/components/LeadCard";
import { college } from "@/lib/config";

interface MessageListProps {
  messages: MessageItem[];
  status: ChatStatus;
  error?: string | null;
  isSpeaking: boolean;
  onReadAloud: (text: string) => void;
  onRegenerate: () => void;
  onRetry?: () => void;
  onAskFollowUp?: (query: string) => void;
  language?: "en" | "ta";
}

export default function MessageList({
  messages,
  status,
  error,
  isSpeaking,
  onReadAloud,
  onRegenerate,
  onRetry,
  onAskFollowUp,
  language = "en",
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const isAutoScrollActive = useRef(true);

  const isTamil = language === "ta";
  const phoneLink = `tel:${college.phone.replace(/[^0-9+]/g, "")}`;

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
  }, [messages, status, error]);

  // Show lead capture after 3-4 messages if not dismissed
  const showLeadCard = messages.length >= 4 && !leadDismissed;

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-w-4xl mx-auto space-y-2 no-scrollbar"
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
            onAskFollowUp={onAskFollowUp}
            language={language}
          />
        ))}

        {/* Thinking Indicator */}
        {status === "thinking" && <ThinkingOrb language={language} />}

        {/* Friendly Error State */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-3 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-rose-200"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>
                {error ||
                  (isTamil
                    ? "தற்போது சற்று பணி மிகுதியாக உள்ளது. சில வினாடிகளுக்குப் பிறகு மீண்டும் முயற்சிக்கவும் அல்லது சேர்க்கை அலுவலகத்தை அழைக்கவும்."
                    : "I'm a bit busy right now. Please try again in a few seconds, or call the admission office.")}
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-medium text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isTamil ? "மீண்டும் முயற்சி" : "Retry"}</span>
                </button>
              )}
              <a
                href={phoneLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-primary-glow" />
                <span>{isTamil ? "அழைக்க" : "Call Office"}</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* Lead capture card after 3-4 messages */}
        {showLeadCard && (
          <LeadCard
            language={language}
            onDismiss={() => setLeadDismissed(true)}
          />
        )}

        <div ref={bottomRef} className="h-6" />
      </div>

      {/* Floating Scroll to Bottom pill */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={scrollToBottom}
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
            className="absolute bottom-4 right-6 sm:right-10 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-[#0C091D]/90 text-white shadow-xl backdrop-blur-md hover:bg-primary/30 transition-colors"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
