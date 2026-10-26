"use client";

import { useCallback, useEffect, useState } from "react";
import { speak, stopSpeaking } from "@/lib/speech";

const STORAGE_KEY = "avichi_voice_replies_enabled";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setVoiceEnabled(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      if (!next) {
        stopSpeaking();
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (!voiceEnabled || !isSupported || !text.trim()) return;
      setIsSpeaking(true);
      speak(text, () => {
        setIsSpeaking(false);
      });
    },
    [isSupported, voiceEnabled],
  );

  const stopSpeech = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    voiceEnabled,
    isSupported,
    toggleVoice,
    speakText,
    stopSpeech,
  };
}
