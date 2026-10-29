"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import OrbitRings from "@/components/OrbitRings";

interface HaloHeroProps {
  isSpeaking?: boolean;
  isThinking?: boolean;
  logoUrl?: string;
}

export default function HaloHero({
  isSpeaking = false,
  isThinking = false,
  logoUrl = "/logo.png",
}: HaloHeroProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Parallax motion values (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    const checkTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(checkTouch);

    if (!checkTouch && !motionQuery.matches) {
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        // Shift a subtle 8px toward the cursor
        const xOffset = ((e.clientX / innerWidth) - 0.5) * 16;
        const yOffset = ((e.clientY / innerHeight) - 0.5) * 16;
        mouseX.set(xOffset);
        mouseY.set(yOffset);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        motionQuery.removeEventListener("change", handleMotionChange);
      };
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-4 select-none">
      {/* Background Soft Purple Bleeds in Top Corners */}
      <div
        className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[720px] max-w-full h-[360px] opacity-45 mix-blend-screen filter blur-[90px] -z-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(124, 92, 255, 0.45), rgba(167, 139, 250, 0.15) 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* Parallax Container */}
      <motion.div
        style={{
          x: !isTouchDevice && !reducedMotion ? smoothX : 0,
          y: !isTouchDevice && !reducedMotion ? smoothY : 0,
        }}
        className="relative flex items-center justify-center"
      >
        {/* Concentric Orbit Rings */}
        <OrbitRings reducedMotion={reducedMotion} />

        {/* Halo Centerpiece Outer Bloom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: isSpeaking ? [0.6, 0.95, 0.6] : [0.55, 0.8, 0.55],
            scale: isSpeaking ? [1, 1.08, 1] : isThinking ? [1, 1.04, 1] : [1, 1.03, 1],
          }}
          transition={
            reducedMotion
              ? { duration: 0.1 }
              : {
                  duration: isSpeaking ? 2 : 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="absolute -inset-10 sm:-inset-14 rounded-full mix-blend-screen pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.42) 0%, rgba(124, 92, 255, 0.22) 40%, transparent 70%)",
            filter: "blur(45px)",
          }}
          aria-hidden="true"
        />

        {/* Central Halo Disc Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 26,
            delay: 0.15,
          }}
          className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full flex items-center justify-center"
        >
          {/* Glowing Conic/Radial Ring (CSS only) */}
          <motion.div
            className="absolute inset-0 rounded-full p-[2px] overflow-hidden"
            style={{
              background:
                "conic-gradient(from 0deg, #FFFFFF 0deg, #A78BFA 90deg, #7C5CFF 180deg, #5EEAD4 270deg, #FFFFFF 360deg)",
              boxShadow:
                "0 0 35px rgba(167, 139, 250, 0.6), inset 0 0 25px rgba(124, 92, 255, 0.4)",
            }}
            animate={
              reducedMotion
                ? undefined
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            aria-hidden="true"
          />

          {/* Dark Eclipse Center Body with Deep Inner Glow */}
          <div
            className="relative w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, #15102A 0%, #080614 65%, #05040D 100%)",
              boxShadow:
                "inset 0 0 45px rgba(167, 139, 250, 0.22), 0 0 50px rgba(10, 8, 20, 0.9)",
            }}
          >
            {/* Soft circular glow directly behind the crest logo (never white box) */}
            <div
              className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, rgba(124, 92, 255, 0.15) 50%, transparent 75%)",
                filter: "blur(18px)",
              }}
              aria-hidden="true"
            />

            {/* Crest Logo: Framer Motion shared layoutId for transition to ChatHeader */}
            <motion.div
              layoutId="hero-crest-orb"
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative z-10 flex items-center justify-center p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Avichi College Crest"
                className="w-24 h-24 sm:w-[110px] sm:h-[110px] object-contain drop-shadow-[0_0_16px_rgba(167,139,250,0.5)] select-none pointer-events-none"
              />
            </motion.div>

            {/* Light Horizon Streak across the base */}
            <div
              className="absolute top-[68%] left-0 right-0 h-[1.5px] pointer-events-none mix-blend-screen opacity-75"
              style={{
                background:
                  "linear-gradient(90deg, transparent 5%, rgba(167, 139, 250, 0.7) 45%, #FFFFFF 50%, rgba(94, 234, 212, 0.7) 55%, transparent 95%)",
                boxShadow: "0 0 10px rgba(167, 139, 250, 0.8)",
              }}
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

