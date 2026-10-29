"use client";

import { motion } from "framer-motion";

interface OrbitRingsProps {
  reducedMotion?: boolean;
}

export default function OrbitRings({ reducedMotion = false }: OrbitRingsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10" aria-hidden="true">
      {/* Inner Orbit Ring (approx 340px) */}
      <motion.div
        className="absolute rounded-full border border-white/[0.07]"
        style={{ width: "340px", height: "340px" }}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {/* Glowing dot on inner ring */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_10px_#A78BFA]" />
      </motion.div>

      {/* Middle Orbit Ring (approx 460px) */}
      <motion.div
        className="absolute rounded-full border border-white/[0.05]"
        style={{ width: "460px", height: "460px" }}
        animate={reducedMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
      >
        {/* Glowing dot on middle ring */}
        <div className="absolute top-1/4 right-0 w-1.5 h-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_#5EEAD4]" />
      </motion.div>

      {/* Outer faint ring (approx 580px, desktop only) */}
      <motion.div
        className="hidden md:block absolute rounded-full border border-white/[0.03]"
        style={{ width: "580px", height: "580px" }}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
      >
        {/* Glowing dot on outer ring */}
        <div className="absolute bottom-10 left-16 w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_#A78BFA]" />
      </motion.div>
    </div>
  );
}

