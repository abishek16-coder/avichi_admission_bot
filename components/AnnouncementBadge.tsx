"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnnouncementBadgeProps {
  language?: "en" | "ta";
}

export default function AnnouncementBadge({ language = "en" }: AnnouncementBadgeProps) {
  const text =
    language === "ta"
      ? "புதியது: AI சேர்க்கை உதவியாளர் நேரலையில் உள்ளது"
      : "New: AI Admission Assistant is live";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] shadow-[0_0_15px_rgba(124,92,255,0.15)] backdrop-blur-xl group cursor-default"
    >
      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/20 text-primary-glow">
        <Sparkles className="w-2.5 h-2.5 animate-pulse" />
      </div>
      <span className="text-xs font-medium tracking-wide text-text-muted group-hover:text-text transition-colors">
        {text}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#5EEAD4] animate-ping" />
    </motion.div>
  );
}

