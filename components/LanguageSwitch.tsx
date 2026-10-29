"use client";

import { motion } from "framer-motion";

interface LanguageSwitchProps {
  currentLang: "en" | "ta";
  onChange: (lang: "en" | "ta") => void;
  className?: string;
  size?: "md" | "lg";
}

export default function LanguageSwitch({
  currentLang,
  onChange,
  className = "",
  size = "md",
}: LanguageSwitchProps) {
  const isLg = size === "lg";

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`relative inline-flex items-center rounded-full bg-white/[0.06] p-1 border border-white/[0.10] shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)] backdrop-blur-md ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={currentLang === "en"}
        className={`relative z-10 ${
          isLg ? "px-4 py-1.5 text-xs sm:text-sm" : "px-3 py-1 text-xs"
        } font-semibold rounded-full transition-colors duration-200 select-none ${
          currentLang === "en" ? "text-white" : "text-[#A9A3C7] hover:text-white"
        }`}
      >
        {currentLang === "en" && (
          <motion.div
            layoutId="lang-switch-pill"
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full shadow-[0_0_16px_rgba(124,92,255,0.6)] -z-10"
          />
        )}
        EN
      </button>

      <button
        type="button"
        onClick={() => onChange("ta")}
        aria-pressed={currentLang === "ta"}
        className={`relative z-10 ${
          isLg ? "px-4 py-1.5 text-xs sm:text-sm font-tamil" : "px-3 py-1 text-xs font-tamil"
        } font-semibold rounded-full transition-colors duration-200 select-none ${
          currentLang === "ta" ? "text-white" : "text-[#A9A3C7] hover:text-white"
        }`}
      >
        {currentLang === "ta" && (
          <motion.div
            layoutId="lang-switch-pill"
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full shadow-[0_0_16px_rgba(124,92,255,0.6)] -z-10"
          />
        )}
        தமிழ்
      </button>
    </div>
  );
}
