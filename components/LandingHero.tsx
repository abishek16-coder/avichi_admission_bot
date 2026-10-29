"use client";

import { motion } from "framer-motion";
import AnnouncementBadge from "@/components/AnnouncementBadge";
import HaloHero from "@/components/HaloHero";
import GlassChatPanel from "@/components/GlassChatPanel";

interface LandingHeroProps {
  onSend: (text: string) => void;
  voiceReplyEnabled: boolean;
  onToggleVoiceReply: () => void;
  isListening: boolean;
  voiceSupported: boolean;
  onToggleListening: () => void;
  transcript: string;
  isSpeaking: boolean;
  isThinking: boolean;
  language: "en" | "ta";
}

export default function LandingHero({
  onSend,
  voiceReplyEnabled,
  onToggleVoiceReply,
  isListening,
  voiceSupported,
  onToggleListening,
  transcript,
  isSpeaking,
  isThinking,
  language = "en",
}: LandingHeroProps) {
  const isTamil = language === "ta";

  const headlineEn = "Ask anything about Avichi College";
  const headlineTa = "அவிச்சி கல்லூரி பற்றி எதையும் கேளுங்கள்";

  const subtitleEn =
    "Courses, eligibility, admissions and scholarships. Answered instantly, by text or voice.";
  const subtitleTa =
    "படிப்புகள், சேர்க்கை தகுதி மற்றும் உதவித்தொகை. உரை அல்லது குரல் வழியே உடனடியாக பதில்.";

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[100dvh] w-full px-4 pt-28 sm:pt-36 pb-6 overflow-hidden z-10">
      {/* Top Section: Badge & Headline with line-by-line fade up */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto w-full mt-1 sm:mt-2 z-10">
        <AnnouncementBadge language={language} />

        {/* Hero Headline in light-weight, wide-tracking sans-serif with vertical gradient fill */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="font-heading font-normal text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.12] mt-4 mb-3 headline-gradient select-none"
        >
          {isTamil ? headlineTa : headlineEn}
        </motion.h1>

        {/* Small subtitle in muted lavender-grey */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="text-xs sm:text-sm md:text-base text-[#A9A3C7] max-w-xl mx-auto font-sans leading-relaxed px-2 select-none"
        >
          {isTamil ? subtitleTa : subtitleEn}
        </motion.p>
      </div>

      {/* Center Section: Centerpiece Halo with Avichi Crest (~110px) */}
      <div className="relative w-full flex items-center justify-center py-2 sm:py-4 z-10">
        <HaloHero
          isSpeaking={isSpeaking}
          isThinking={isThinking}
          logoUrl="/logo.png"
        />
      </div>

      {/* Bottom Section: Rounded Glass Chat Panel */}
      <div className="w-full z-20 pb-2">
        <GlassChatPanel
          onSend={onSend}
          voiceReplyEnabled={voiceReplyEnabled}
          onToggleVoiceReply={onToggleVoiceReply}
          isListening={isListening}
          voiceSupported={voiceSupported}
          onToggleListening={onToggleListening}
          transcript={transcript}
          language={language}
        />
      </div>
    </div>
  );
}
