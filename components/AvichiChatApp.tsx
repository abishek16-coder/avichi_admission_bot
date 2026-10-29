"use client";

import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import StarField from "@/components/StarField";
import FloatingNavbar from "@/components/FloatingNavbar";
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

  const {
    messages,
    status,
    error,
    language,
    setLanguage,
    sendMessage,
    retryLast,
    regenerateLast,
    clearChat,
  } = useChat({
    onStreamingFinish: handleStreamingFinish,
    initialLanguage: "en",
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
    sendMessage(text, false, language);
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
    <div className="relative flex flex-col h-[100dvh] w-full overflow-hidden bg-[#05040D] text-[#F4F2FF]">
      {/* Canvas Starfield Background */}
      <StarField />

      {/* Deep Purple & Indigo Corner Ambient Glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-purple-700/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[680px] h-[360px] rounded-full bg-primary/15 blur-[140px]" />
      </div>

      <AnimatePresence mode="wait">
        {isLandingState ? (
          /* ================= STATE A: LANDING HERO ================= */
          <motion.div
            key="landing-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex-1 flex flex-col w-full h-full"
          >
            {/* Pill-shaped Floating Navbar */}
            <FloatingNavbar
              onNavClick={handleSend}
              currentLang={language}
              onLanguageChange={setLanguage}
            />

            {/* Center Landing Hero */}
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
              language={language}
            />
          </motion.div>
        ) : (
          /* ================= STATE B: CHAT SCREEN ================= */
          <motion.div
            key="chat-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex-1 flex flex-col h-full w-full overflow-hidden z-10"
          >
            {/* Docked Header with Logo Orb */}
            <ChatHeader
              onNewChat={handleNewChat}
              isSpeaking={isSpeaking}
              currentLang={language}
              onLanguageChange={setLanguage}
            />

            {/* Scrollable Message List inside Glass container */}
            <motion.div
              layoutId="glass-chat-container"
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="flex-1 flex flex-col h-full w-full overflow-hidden"
            >
              <MessageList
                messages={messages}
                status={status}
                error={error}
                isSpeaking={isSpeaking}
                onReadAloud={(text) => {
                  if (isSpeaking) {
                    stopSpeech();
                  } else {
                    speakText(text);
                  }
                }}
                onRegenerate={regenerateLast}
                onRetry={retryLast}
                onAskFollowUp={handleSend}
                language={language}
              />

              {/* Bottom Fixed Input Pill with Blur Fade */}
              <div className="relative w-full z-20 pb-4 pt-2">
                <div
                  className="pointer-events-none absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-[#05040D] to-transparent"
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
                  language={language}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
