"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, SendHorizontal, Award } from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (chipText: string) => void;
}

const chips = [
  { text: "Courses offered", icon: BookOpen },
  { text: "Eligibility", icon: GraduationCap },
  { text: "How to apply", icon: SendHorizontal },
  { text: "Scholarships & fees", icon: Award },
];

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-2xl mx-auto px-4">
      {chips.map((chip, idx) => {
        const Icon = chip.icon;
        return (
          <motion.button
            key={chip.text}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15 + idx * 0.06,
              duration: 0.35,
              ease: "easeOut",
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(chip.text)}
            className="group flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-brand-accent dark:hover:text-white"
          >
            <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand dark:group-hover:text-brand-accent transition-colors" />
            <span>{chip.text}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
