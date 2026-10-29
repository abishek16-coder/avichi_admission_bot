"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { college } from "@/lib/config";

interface ContactButtonsProps {
  language?: "en" | "ta";
}

export default function ContactButtons({ language = "en" }: ContactButtonsProps) {
  const phoneLink = `tel:${college.phone.replace(/[^0-9+]/g, "")}`;
  const whatsappUrl = college.whatsappUrl || "https://wa.me/919600164070";

  const callText = language === "ta" ? "அலுவலகத்தை அழைக்கவும்" : "Call Admission Office";
  const whatsappText = language === "ta" ? "வாட்ஸ்அப் உதவி" : "WhatsApp Admission Desk";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center gap-2.5 my-3"
    >
      <a
        href={phoneLink}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary-glow hover:bg-primary/30 hover:border-primary-glow text-xs font-medium shadow-[0_0_15px_rgba(124,92,255,0.25)] transition-all duration-200 active:scale-95"
      >
        <Phone className="w-3.5 h-3.5" />
        <span>{callText}</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-200 active:scale-95"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>{whatsappText}</span>
      </a>
    </motion.div>
  );
}

