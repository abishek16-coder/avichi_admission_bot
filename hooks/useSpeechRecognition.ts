"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getRecognition, type SpeechRecognitionLike } from "@/lib/speech";

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  lang?: string;
}

export function useSpeechRecognition({
  onResult,
  lang = "en-IN",
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(Boolean(getRecognition()));
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    const rec = getRecognition();
    if (!rec) {
      setError("Voice recognition is not supported in this browser.");
      return;
    }

    stopListening();

    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i]?.[0];
        if (item?.transcript) {
          finalTranscript += item.transcript;
        }
      }
      setTranscript(finalTranscript);
      if (onResult && finalTranscript.trim()) {
        onResult(finalTranscript.trim());
      }
    };

    rec.onerror = (e) => {
      if (e.error !== "no-speech") {
        setError("Could not hear anything. Please try again or type.");
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      setIsListening(true);
      setTranscript("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start microphone.");
      setIsListening(false);
    }
  }, [lang, onResult, stopListening]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    setTranscript,
  };
}
