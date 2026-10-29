"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import type { MessageItem } from "@/hooks/useChat";
import BotActions from "@/components/BotActions";
import CourseCards from "@/components/CourseCards";
import ContactButtons from "@/components/ContactButtons";

interface MessageBubbleProps {
  message: MessageItem;
  isLast: boolean;
  isSpeaking: boolean;
  onReadAloud: (text: string) => void;
  onRegenerate?: () => void;
  onAskFollowUp?: (query: string) => void;
  language?: "en" | "ta";
}

const COURSE_REGEX = /(courses|degree|programmes?|program|b\.?sc|bca|b\.?com|bba|criminology|படிப்புகள்|பாடங்கள்)/i;
const CONTACT_REGEX = /(contact|admission cell|admission office|phone|email|\+91|96001|call|office at|அலுவலக|தொடர்பு)/i;

export default function MessageBubble({
  message,
  isLast,
  isSpeaking,
  onReadAloud,
  onRegenerate,
  onAskFollowUp,
  language = "en",
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="flex justify-end w-full py-1.5"
      >
        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-br-sm px-4 sm:px-5 py-3 bg-white/[0.06] border border-white/[0.12] text-white shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl text-sm sm:text-[15px] leading-relaxed selection:bg-primary/40">
          {message.text}
        </div>
      </motion.div>
    );
  }

  // Bot message: NO bubble, plain light text with small glowing sparkle avatar on left
  const showCourses = !message.isStreaming && COURSE_REGEX.test(message.text);
  const showContact = !message.isStreaming && CONTACT_REGEX.test(message.text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex items-start gap-3 sm:gap-3.5 py-3.5 w-full"
    >
      {/* Small Glowing Sparkle Avatar */}
      <div className="relative flex-shrink-0 mt-0.5">
        <div className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-gradient-to-tr from-primary to-accent text-white shadow-[0_0_12px_rgba(124,92,255,0.4)]">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm sm:text-[15.5px] leading-[1.8] text-[#F4F2FF] font-sans break-words">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-[1.8]">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-white tracking-wide">
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="my-2 pl-5 list-disc space-y-1 marker:text-primary-glow">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-2 pl-5 list-decimal space-y-1 marker:text-primary-glow marker:font-semibold">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-glow underline underline-offset-4 hover:text-white transition-colors"
                >
                  {children}
                </a>
              ),
              hr: () => <hr className="my-3 border-white/10" />,
            }}
          >
            {message.text}
          </ReactMarkdown>

          {message.isStreaming && (
            <span className="streaming-cursor" aria-hidden="true" />
          )}
        </div>

        {/* Course Cards when reply involves courses */}
        {showCourses && onAskFollowUp && (
          <CourseCards onAskMore={onAskFollowUp} language={language} />
        )}

        {/* Contact Buttons when reply mentions office/contact */}
        {showContact && <ContactButtons language={language} />}

        {/* Actions under completed bot message */}
        {!message.isStreaming && message.text && (
          <BotActions
            messageText={message.text}
            isLast={isLast}
            isSpeaking={isSpeaking}
            onReadAloud={onReadAloud}
            onRegenerate={onRegenerate}
            language={language}
          />
        )}
      </div>
    </motion.div>
  );
}
