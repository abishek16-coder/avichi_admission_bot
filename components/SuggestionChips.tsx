"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, SendHorizontal, Award } from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (chipText: string) => void;
  language?: "en" | "ta";
}

const chipsData = [
  {
    en: "Courses offered",
    ta: "வழங்கப்படும் படிப்புகள்",
    icon: BookOpen,
  },
  {
    en: "Eligibility",
    ta: "சேர்க்கை தகுதி",
    icon: GraduationCap,
  },
  {
    en: "How to apply",
    ta: "விண்ணப்பிப்பது எப்படி",
    icon: SendHorizontal,
  },
  {
    en: "Scholarships & fees",
    ta: "உதவித்தொகை & கட்டணம்",
    icon: Award,
  },
];

export default function SuggestionChips({
  onSelect,
  language = "en",
}: SuggestionChipsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-2 overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 min-w-max px-2">
        {chipsData.map((chip, idx) => {
          const Icon = chip.icon;
          const label = language === "ta" ? chip.ta : chip.en;

          return (
            <motion.button
              key={chip.en}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + idx * 0.05,
                duration: 0.35,
                ease: "easeOut",
              }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(label)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.09] text-xs sm:text-sm font-medium text-[#F4F2FF]/85 shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:border-primary-glow/60 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(124,92,255,0.25)] transition-all duration-200 select-none flex-shrink-0 cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5 text-primary-glow flex-shrink-0" />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
