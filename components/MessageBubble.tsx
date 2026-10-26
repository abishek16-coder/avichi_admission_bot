"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import type { MessageItem } from "@/hooks/useChat";
import BotMessageActions from "@/components/BotMessageActions";

interface MessageBubbleProps {
  message: MessageItem;
  isLast: boolean;
  isSpeaking: boolean;
  onReadAloud: (text: string) => void;
  onRegenerate?: () => void;
}

export default function MessageBubble({
  message,
  isLast,
  isSpeaking,
  onReadAloud,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex justify-end w-full py-2"
      >
        <div className="max-w-[85%] sm:max-w-[70%] rounded-3xl rounded-br-md px-5 py-3.5 bg-slate-200/70 text-slate-900 dark:bg-slate-800/90 dark:text-slate-100 shadow-sm text-[15px] sm:text-[16px] leading-relaxed">
          {message.text}
        </div>
      </motion.div>
    );
  }

  // Bot message (Gemini-style: NO bubble, plain text on page background with avatar on left)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex items-start gap-3.5 sm:gap-4 py-4 w-full"
    >
      {/* Bot Sparkle Avatar */}
      <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-gradient-to-tr from-brand to-brand-accent text-white shadow-sm flex-shrink-0 mt-0.5">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[15px] sm:text-[16.5px] leading-[1.75] text-slate-800 dark:text-slate-100 font-sans break-words">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0 leading-[1.75]">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900 dark:text-white">
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="my-2.5 pl-5 list-disc space-y-1.5 marker:text-brand dark:marker:text-brand-accent">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-2.5 pl-5 list-decimal space-y-1.5 marker:font-semibold marker:text-brand dark:marker:text-brand-accent">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand dark:text-brand-accent underline underline-offset-2 hover:opacity-80 transition"
                >
                  {children}
                </a>
              ),
              h1: ({ children }) => (
                <h1 className="font-serif font-bold text-xl sm:text-2xl mt-4 mb-2 text-slate-900 dark:text-white">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-serif font-bold text-lg sm:text-xl mt-3.5 mb-2 text-slate-900 dark:text-white">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-semibold text-base sm:text-lg mt-3 mb-1.5 text-slate-900 dark:text-white">
                  {children}
                </h3>
              ),
              hr: () => <hr className="my-4 border-slate-200 dark:border-slate-800" />,
            }}
          >
            {message.text}
          </ReactMarkdown>

          {message.isStreaming && (
            <span className="streaming-caret text-brand dark:text-brand-accent" aria-hidden="true" />
          )}
        </div>

        {/* Action icons under completed bot message */}
        {!message.isStreaming && message.text && (
          <BotMessageActions
            messageText={message.text}
            isLast={isLast}
            isSpeaking={isSpeaking}
            onReadAloud={onReadAloud}
            onRegenerate={onRegenerate}
          />
        )}
      </div>
    </motion.div>
  );
}
