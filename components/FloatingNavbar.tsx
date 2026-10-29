"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Phone, X, ExternalLink, Sparkles } from "lucide-react";
import LanguageSwitch from "@/components/LanguageSwitch";
import { college } from "@/lib/config";

interface FloatingNavbarProps {
  onNavClick: (query: string) => void;
  currentLang: "en" | "ta";
  onLanguageChange: (lang: "en" | "ta") => void;
}

const navItems = [
  {
    en: "Courses",
    ta: "படிப்புகள்",
    queryEn: "What courses and degree programmes are offered at Avichi College?",
    queryTa: "அவிச்சி கல்லூரியில் என்னென்ன படிப்புகள் மற்றும் பட்டங்கள் வழங்கப்படுகின்றன?",
  },
  {
    en: "Admissions",
    ta: "சேர்க்கை",
    queryEn: "How do I apply for admission, and what is the eligibility?",
    queryTa: "சேர்க்கைக்கு எவ்வாறு விண்ணப்பிப்பது மற்றும் தகுதிகள் என்ன?",
  },
  {
    en: "Scholarships",
    ta: "உதவித்தொகை",
    queryEn: "Are there scholarships or fee concessions available?",
    queryTa: "உதவித்தொகைகள் அல்லது கட்டணச் சலுகைகள் உள்ளனவா?",
  },
  {
    en: "Contact",
    ta: "தொடர்பு",
    queryEn: "How can I contact the college admission office and visit campus?",
    queryTa: "கல்லூரி சேர்க்கை அலுவலகத்தை எவ்வாறு தொடர்பு கொள்வது?",
  },
];

export default function FloatingNavbar({
  onNavClick,
  currentLang,
  onLanguageChange,
}: FloatingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phoneLink = `tel:${college.phone.replace(/[^0-9+]/g, "")}`;
  const callLabel =
    currentLang === "ta" ? "அலுவலகத்தை அழைக்கவும்" : "Call Admission Office";

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.05 }}
        className="fixed top-4 sm:top-6 left-0 right-0 z-40 flex justify-center px-4 sm:px-6 pointer-events-none"
      >
        <div className="relative w-full max-w-6xl rounded-full bg-[#060412]/85 border border-white/[0.12] shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto transition-all">
          {/* Top border ambient highlight streak */}
          <div
            className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden="true"
          />

          {/* Left: Crest Logo + College Name & Badge */}
          <div className="flex items-center gap-3 sm:gap-3.5 select-none">
            {/* Luminous Logo Orb */}
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/[0.05] border border-white/15 shadow-[0_0_18px_rgba(167,139,250,0.4)] overflow-hidden flex-shrink-0 group">
              <div
                className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-colors pointer-events-none"
                aria-hidden="true"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Avichi Crest"
                className="w-7 h-7 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] relative z-10"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                  Avichi College
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-semibold text-primary-glow uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Portal
                </span>
              </div>
              <span className="text-[11px] text-[#A9A3C7] hidden sm:block tracking-wide">
                Arts & Science • Chennai
              </span>
            </div>
          </div>

          {/* Center Links (Desktop Pill Navigation) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
            {navItems.map((item) => {
              const label = currentLang === "ta" ? item.ta : item.en;
              const query = currentLang === "ta" ? item.queryTa : item.queryEn;

              return (
                <button
                  key={item.en}
                  type="button"
                  onClick={() => onNavClick(query)}
                  className="px-4 lg:px-5 py-2 text-sm font-medium text-[#A9A3C7] hover:text-white rounded-full transition-all duration-200 hover:bg-white/[0.08] active:scale-95"
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Language Switch + Glowing Call Button + Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <LanguageSwitch
              currentLang={currentLang}
              onChange={onLanguageChange}
              size="lg"
            />

            {/* Glowing Outline Button with Rotating Border Accent */}
            <a
              href={phoneLink}
              title="Call Admission Office"
              className="relative hidden sm:inline-flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 border border-primary-glow/50 text-white font-medium text-xs sm:text-sm shadow-[0_0_20px_rgba(124,92,255,0.3)] hover:shadow-[0_0_30px_rgba(124,92,255,0.55)] hover:border-primary-glow transition-all duration-200 active:scale-95 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Phone className="w-3.5 h-3.5 text-primary-glow group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-tight">{callLabel}</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden grid h-10 w-10 place-items-center rounded-full text-[#A9A3C7] hover:text-white hover:bg-white/[0.08] border border-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed top-24 left-4 right-4 z-50 rounded-3xl bg-[#090717]/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-5 md:hidden"
          >
            <div className="space-y-2">
              <div className="px-2 py-1 text-xs font-semibold text-primary-glow uppercase tracking-wider">
                {currentLang === "ta" ? "முக்கிய தலைப்புகள்" : "Quick Navigation"}
              </div>

              {navItems.map((item) => {
                const label = currentLang === "ta" ? item.ta : item.en;
                const query = currentLang === "ta" ? item.queryTa : item.queryEn;

                return (
                  <button
                    key={item.en}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavClick(query);
                    }}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium text-white hover:bg-white/[0.08] transition-colors flex items-center justify-between"
                  >
                    <span>{label}</span>
                    <span className="text-xs text-primary-glow">→</span>
                  </button>
                );
              })}

              <div className="pt-2 border-t border-white/10 space-y-2">
                <a
                  href={phoneLink}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold shadow-[0_0_20px_rgba(124,92,255,0.4)] transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>{callLabel}</span>
                </a>

                <a
                  href={college.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs text-text-muted hover:text-white transition-colors"
                >
                  <span>Apply Online Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
