"use client";

import { motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

interface FloatingNavbarProps {
  onNavClick: (query: string) => void;
  onLanguageChange: (lang: "en" | "ta") => void;
  currentLang: "en" | "ta";
}

const navLinks = {
  en: ["Courses", "Admissions", "Scholarships", "Contact"],
  ta: ["படிப்புகள்", "சேர்க்கை", "உதவித்தொகை", "தொடர்பு"],
};

const queries = {
  en: [
    "What courses are offered?",
    "How do I apply for admission?",
    "What scholarships are available?",
    "How can I contact the admission office?",
  ],
  ta: [
    "என்ன படிப்புகள் வழங்கப்படுகின்றன?",
    "சேர்க்கைக்கு எப்படி விண்ணப்பிப்பது?",
    "என்ன உதவித்தொகைகள் உள்ளன?",
    "சேர்க்கை அலுவலகத்தை எப்படி தொடர்பு கொள்வது?",
  ],
};

export default function FloatingNavbar({ onNavClick, onLanguageChange, currentLang }: FloatingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks[currentLang];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl"
      >
        <div className="glass px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Avichi" className="w-8 h-8 object-contain" />
            <span className="hidden sm:inline text-sm font-semibold">Avichi College</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link, i) => (
              <button
                key={link}
                onClick={() => onNavClick(queries[currentLang][i])}
                className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors rounded-full hover:bg-white/5"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-white/5 rounded-full p-0.5">
              <button
                onClick={() => onLanguageChange("en")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  currentLang === "en" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange("ta")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  currentLang === "ta" ? "bg-primary text-white" : "text-text-muted hover:text-text"
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Call Button */}
            <a
              href={`tel:${process.env.NEXT_PUBLIC_COLLEGE_PHONE}`}
              className="hidden sm:flex btn-glow items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{currentLang === "en" ? "Call Office" : "அலுவலகத்தை அழைக்கவும்"}</span>
            </a>

            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 glass p-4 space-y-2"
        >
          {links.map((link, i) => (
            <button
              key={link}
              onClick={() => {
                onNavClick(queries[currentLang][i]);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 rounded-xl transition-colors"
            >
              {link}
            </button>
          ))}
          <a
            href={`tel:${process.env.NEXT_PUBLIC_COLLEGE_PHONE}`}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-white/5 rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4" />
            {currentLang === "en" ? "Call Admission Office" : "சேர்க்கை அலுவலகத்தை அழைக்கவும்"}
          </a>
        </motion.div>
      )}
    </>
  );
}
