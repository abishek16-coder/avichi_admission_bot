"use client";

import { motion } from "framer-motion";
import { Plus, Phone, ExternalLink } from "lucide-react";
import LanguageSwitch from "@/components/LanguageSwitch";
import { college } from "@/lib/config";

interface ChatHeaderProps {
  onNewChat: () => void;
  isSpeaking: boolean;
  currentLang: "en" | "ta";
  onLanguageChange: (lang: "en" | "ta") => void;
}

export default function ChatHeader({
  onNewChat,
  isSpeaking,
  currentLang,
  onLanguageChange,
}: ChatHeaderProps) {
  const isTamil = currentLang === "ta";
  const phoneLink = `tel:${college.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <header className="relative z-30 flex items-center justify-between w-full px-4 sm:px-8 py-3 sm:py-4 border-b border-white/[0.08] bg-[#060412]/90 shadow-[0_4px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
      {/* Top subtle rim highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />

      {/* Left: Crest Orb with shared layoutId */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex-shrink-0">
          {/* Speaking animated glow pulse */}
          {isSpeaking && (
            <motion.span
              className="absolute -inset-1.5 rounded-full bg-primary/50 blur-md pointer-events-none"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Shared layoutId with HaloHero */}
          <motion.div
            layoutId="hero-crest-orb"
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`relative grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full overflow-hidden border ${
              isSpeaking
                ? "border-primary-glow shadow-[0_0_20px_rgba(167,139,250,0.7)]"
                : "border-white/20 bg-[#0C091D] shadow-[0_0_15px_rgba(0,0,0,0.6)]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Avichi College Crest"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]"
            />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-sm sm:text-base font-bold text-white tracking-tight leading-none">
              {isTamil ? "அவிச்சி AI உதவியாளர்" : "Avichi AI Assistant"}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-[#A9A3C7] mt-0.5 hidden sm:block">
            {college.name} • Admission Desk
          </p>
        </div>
      </div>

      {/* Right Actions: Language Switch, Phone, New Chat */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <LanguageSwitch
          currentLang={currentLang}
          onChange={onLanguageChange}
          size="lg"
        />

        <a
          href={phoneLink}
          title="Call Admission Office"
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-[#A9A3C7] hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-primary-glow" />
          <span>{isTamil ? "அழைக்க" : "Call Office"}</span>
        </a>

        <a
          href={college.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white transition-colors"
        >
          <span>Apply</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* New Chat Button: Reverses animation back to State A */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNewChat}
          title={isTamil ? "புதிய உரையாடலைத் தொடங்குங்கள்" : "Start a new chat"}
          aria-label="New chat"
          className="flex items-center gap-2 px-4 sm:px-4.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs sm:text-sm font-semibold text-white shadow-[0_0_15px_rgba(124,92,255,0.15)] transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 text-primary-glow" />
          <span>{isTamil ? "புதிய உரையாடல்" : "New chat"}</span>
        </motion.button>
      </div>
    </header>
  );
}
