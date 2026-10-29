"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface HaloHeroProps {
  isSpeaking?: boolean;
  isThinking?: boolean;
  logoUrl?: string;
}

export default function HaloHero({ isSpeaking, isThinking, logoUrl = "/logo.png" }: HaloHeroProps) {
  return (
    <div className="relative w-full flex items-center justify-center py-12 sm:py-16">
      {/* Halo Container */}
      <motion.div
        className="relative"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ 
          scale: isSpeaking ? [1, 1.05, 1] : isThinking ? [1, 1.03, 1] : 1,
          opacity: 1 
        }}
        transition={{ 
          scale: { duration: isSpeaking ? 1.5 : 2.5, repeat: isSpeaking || isThinking ? Infinity : 0 },
          opacity: { duration: 0.6 }
        }}
      >
        {/* Outer Bloom */}
        <motion.div
          className="absolute -inset-12 sm:-inset-16 rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{
            opacity: isSpeaking ? [0.4, 0.7, 0.4] : [0.4, 0.5, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        {/* Orbit Rings */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-glow shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
        </motion.div>

        <motion.div
          className="absolute -inset-10 rounded-full border border-white/4"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(94,234,212,0.6)]" />
        </motion.div>

        {/* Core Halo */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60">
          {/* Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #A78BFA, #5EEAD4, #A78BFA)",
              opacity: 0.6,
            }}
            animate={{
              rotate: 360,
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            aria-hidden="true"
          />

          {/* Dark Core */}
          <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#0A0815] to-[#05040D] shadow-[inset_0_0_60px_rgba(167,139,250,0.15)]">
            {/* Logo */}
            <motion.div
              layoutId="avichi-halo-logo"
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Avichi College"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_20px_rgba(167,139,250,0.3)]"
              />
            </motion.div>
          </div>

          {/* Horizon Streak */}
          <div
            className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.4) 50%, transparent)",
            }}
            aria-hidden="true"
          />
        </div>
      </motion.div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -bottom-6 flex items-center gap-2 text-xs font-medium text-primary-glow"
        >
          <Sparkles className="w-3 h-3" />
          <span>Speaking</span>
        </motion.div>
      )}
    </div>
  );
}
