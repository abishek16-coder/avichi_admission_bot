"use client";

import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import LandingHero from "@/components/LandingHero";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";

export default function AvichiChatApp() {
  const { isSpeaking, voiceEnabled, toggleVoice, speakText, stopSpeech } =
    useSpeechSynthesis();

  const handleStreamingFinish = useCallback(
    (fullText: string) => {
      if (voiceEnabled) {
        speakText(fullText);
      }
    },
    [speakText, voiceEnabled],
  );

  const { messages, status, sendMessage, regenerateLast, clearChat } = useChat({
    onStreamingFinish: handleStreamingFinish,
  });

  const {
    isListening,
    transcript,
    isSupported: voiceSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: () => {},
  });

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      stopSpeech();
      startListening();
    }
  }

  function handleSend(text: string) {
    stopSpeech();
    if (isListening) {
      stopListening();
    }
    sendMessage(text);
  }

  function handleNewChat() {
    stopSpeech();
    if (isListening) {
      stopListening();
    }
    clearChat();
  }

  const isLandingState = messages.length === 0;

  return (
    <div className="relative flex flex-col h-[100dvh] w-full overflow-hidden bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] transition-colors duration-300">
      {/* Subtle Drifting Ambient Gradient Blobs */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="ambient-blob-1 absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-brand/40 to-brand-accent/30 blur-3xl" />
        <div className="ambient-blob-2 absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-brand-accent/30 to-brand/40 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {isLandingState ? (
          <motion.div
            key="landing-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="flex-1 flex flex-col w-full h-full"
          >
            <LandingHero
              onSend={handleSend}
              voiceReplyEnabled={voiceEnabled}
              onToggleVoiceReply={toggleVoice}
              isListening={isListening}
              voiceSupported={voiceSupported}
              onToggleListening={toggleListening}
              transcript={transcript}
              isSpeaking={isSpeaking}
              isThinking={status === "thinking" || status === "streaming"}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col h-full w-full overflow-hidden"
          >
            {/* Docked Header */}
            <ChatHeader onNewChat={handleNewChat} isSpeaking={isSpeaking} />

            {/* Scrollable Message List */}
            <MessageList
              messages={messages}
              status={status}
              isSpeaking={isSpeaking}
              onReadAloud={(text) => {
                if (isSpeaking) {
                  stopSpeech();
                } else {
                  speakText(text);
                }
              }}
              onRegenerate={regenerateLast}
            />

            {/* Docked Bottom Input Area with Blur Fade */}
            <div className="relative w-full z-20 pb-4 pt-3">
              {/* Blur gradient fade above the input */}
              <div
                className="pointer-events-none absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-[var(--bg-light)] to-transparent dark:from-[var(--bg-dark)]"
                aria-hidden="true"
              />
              <ChatInput
                onSend={handleSend}
                disabled={status === "thinking" || status === "streaming"}
                voiceReplyEnabled={voiceEnabled}
                onToggleVoiceReply={toggleVoice}
                isListening={isListening}
                voiceSupported={voiceSupported}
                onToggleListening={toggleListening}
                transcript={transcript}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
