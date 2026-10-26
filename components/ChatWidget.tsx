"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import { college } from "@/lib/config";
import type { ChatMessage } from "@/lib/chat-types";
import { getRecognition, speak, stopSpeaking, type SpeechRecognitionLike } from "@/lib/speech";

const suggestedChips = [
  "Courses & Departments",
  "Eligibility & Selection",
  "Fee Concessions & Sports Quota",
  "How to Apply Online",
  "IT & BCA Placements",
  "Admission Cell Contact",
];

type Props = { embedded?: boolean };

function FormattedInline({ text }: { text: string }) {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);
  return (
    <>
      {tokens.map((token, i) => {
        if (/^\*\*[^*]+\*\*$/.test(token)) {
          return (
            <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">
              {token.slice(2, -2)}
            </strong>
          );
        }
        const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand dark:text-accent font-medium underline underline-offset-2 hover:opacity-80 transition break-all"
            >
              {linkMatch[1]}
            </a>
          );
        }
        if (/^https?:\/\/[^\s)]+$/.test(token)) {
          return (
            <a
              key={i}
              href={token}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand dark:text-accent font-medium underline underline-offset-2 hover:opacity-80 transition break-all"
            >
              {token}
            </a>
          );
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
}

/** Rich Markdown-aware renderer with lists, bolding, and links */
function MessageText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        // Bullet list
        if (/^[\*\-•]\s+/.test(trimmed)) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="inline-block mt-2 h-1.5 w-1.5 rounded-full bg-brand dark:bg-accent flex-shrink-0" />
              <span className="flex-1">
                <FormattedInline text={trimmed.replace(/^[\*\-•]\s+/, "")} />
              </span>
            </div>
          );
        }
        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="font-semibold text-brand dark:text-accent text-xs mt-0.5 min-w-[18px]">
                {numMatch[1]}.
              </span>
              <span className="flex-1">
                <FormattedInline text={numMatch[2]} />
              </span>
            </div>
          );
        }
        // Header
        if (/^#{1,4}\s+/.test(trimmed)) {
          return (
            <p key={idx} className="font-bold text-slate-900 dark:text-slate-100 pt-1 text-sm tracking-tight">
              <FormattedInline text={trimmed.replace(/^#{1,4}\s+/, "")} />
            </p>
          );
        }
        // Standard line
        return (
          <p key={idx}>
            <FormattedInline text={line} />
          </p>
        );
      })}
    </div>
  );
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type TimedMessage = ChatMessage & { ts: Date; id: string };

export default function ChatWidget({ embedded = false }: Props) {
  const [messages, setMessages] = useState<TimedMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [dark, setDark] = useState(false);
  const [error, setError] = useState("");
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadNote, setLeadNote] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const voiceSupported = typeof window !== "undefined" && Boolean(getRecognition());
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function clearChat() {
    stopSpeaking();
    setSpeaking(false);
    setMessages([]);
    setError("");
  }

  async function copyMessage(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  }

  async function send(text: string, fromVoice = false) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError("");
    setInput("");

    const userMessage: TimedMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      ts: new Date(),
    };
    const all = [...messages, userMessage];
    const botId = `b-${Date.now()}`;
    const botPlaceholder: TimedMessage = {
      id: botId,
      role: "model",
      text: "",
      ts: new Date(),
    };

    setMessages([...all, botPlaceholder]);
    setBusy(true);

    try {
      // Send up to last 8 messages for context
      const recent = all.slice(-8);
      const payload = recent.map((m, i): ChatMessage =>
        fromVoice && i === recent.length - 1
          ? { role: "user", text: `[voice] ${m.text}` }
          : { role: m.role, text: m.text },
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const line = part.replace(/^data:\s*/, "");
          if (!line || line === "[DONE]") continue;
          const parsed = JSON.parse(line) as { text?: string };
          if (!parsed.text) continue;
          full += parsed.text;
          setMessages((current) => {
            const copy = [...current];
            const lastIdx = copy.length - 1;
            if (lastIdx >= 0) {
              copy[lastIdx] = { ...copy[lastIdx], text: full, ts: new Date() };
            }
            return copy;
          });
        }
      }

      if (voiceOn && ttsSupported && full) {
        setSpeaking(true);
        speak(full, () => setSpeaking(false));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setMessages((current) => current.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  function toggleMic() {
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }
    const rec = getRecognition();
    if (!rec) {
      setError("Voice input is not supported in this browser. You can still type.");
      return;
    }
    stopSpeaking();
    setSpeaking(false);
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript ?? "";
      if (said) void send(said, true);
    };
    rec.onerror = () => setError("I could not hear that. Please try again or type your question.");
    rec.onend = () => setListening(false);
    recognition.current = rec;
    rec.start();
    setListening(true);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  async function saveLead(form: FormData) {
    setLeadNote("");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        course: form.get("course"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLeadNote(response.ok ? "Thank you! The admission office will contact you soon." : data.error || "Could not save.");
    if (response.ok) setTimeout(() => setLeadOpen(false), 2500);
  }

  const glow = listening || speaking;
  const statusText = listening ? "Listening..." : speaking ? "Speaking..." : "Admission Assistant";

  return (
    <section
      className={`flex w-full flex-col overflow-hidden transition-colors duration-300 border shadow-2xl ${
        embedded ? "h-[740px] max-h-[100dvh] sm:rounded-3xl" : "h-[100dvh]"
      } ${dark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}
      aria-label="Admission chatbot"
    >
      {/* Header */}
      <header
        className={`relative flex items-center justify-between gap-3 px-5 py-3.5 border-b ${
          dark ? "border-slate-800 bg-slate-900/90" : "border-slate-100 bg-white/90"
        } backdrop-blur-md z-10`}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand via-accent to-brand opacity-70" />
        <div className="flex items-center gap-3">
          <div
            className={`relative grid h-11 w-11 place-items-center rounded-full ring-2 transition-all duration-300 ${
              glow ? "ring-brand shadow-glow" : dark ? "ring-slate-700 bg-slate-800" : "ring-slate-200 bg-slate-100"
            }`}
          >
            {glow && <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="relative h-9 w-9 rounded-full object-contain" />
          </div>
          <div>
            <p className={`text-sm font-semibold leading-tight ${dark ? "text-slate-100" : "text-slate-800"}`}>
              {college.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-slate-500 font-medium">{statusText}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              title="Clear conversation"
              aria-label="Clear conversation"
              className={`grid h-8 w-8 place-items-center rounded-full text-xs transition ${
                dark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          {ttsSupported && (
            <button
              type="button"
              onClick={() => {
                setVoiceOn((v) => !v);
                stopSpeaking();
                setSpeaking(false);
              }}
              aria-pressed={voiceOn}
              title={voiceOn ? "Mute audio replies" : "Enable audio replies"}
              aria-label="Toggle spoken replies"
              className={`grid h-8 w-8 place-items-center rounded-full text-xs transition ${
                voiceOn
                  ? "bg-brand/10 text-brand dark:bg-brand/20 dark:text-accent font-semibold"
                  : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {voiceOn ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle colour theme"
            className={`grid h-8 w-8 place-items-center rounded-full text-xs transition ${
              dark ? "text-amber-300 hover:text-amber-200 hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {dark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Message area */}
      <div
        ref={scroller}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-md pt-4 text-center"
          >
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand via-brand/90 to-brand/70 shadow-lg shadow-brand/25 text-white">
              <span className="text-3xl">🎓</span>
            </div>
            <h2 className={`text-lg font-bold ${dark ? "text-slate-100" : "text-slate-800"}`}>
              Avichi Admission Assistant
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ask any admission question in English or Tamil. Voice input is supported.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {suggestedChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void send(chip)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
                    dark
                      ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:border-brand hover:text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand shadow-sm"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`flex flex-col gap-1 ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`group relative max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-brand to-brand/85 text-white rounded-br-sm shadow-md shadow-brand/20"
                    : dark
                    ? "bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700/60 shadow-sm"
                    : "bg-white text-slate-800 rounded-bl-sm border border-slate-100 shadow-md"
                }`}
              >
                {message.text ? (
                  <MessageText text={message.text} />
                ) : (
                  <span className="opacity-0 select-none">...</span>
                )}

                {message.role === "model" && message.text && (
                  <button
                    type="button"
                    onClick={() => copyMessage(message.id, message.text)}
                    title="Copy response"
                    className="absolute -right-7 top-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Copy reply"
                  >
                    {copiedId === message.id ? (
                      <span className="text-[10px] text-emerald-500 font-semibold">✓</span>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              {message.text && (
                <p className="px-1 text-[10px] text-slate-400 font-medium">{formatTime(message.ts)}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {busy && messages.at(-1)?.text === "" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start">
            <div
              className={`flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3 ${
                dark ? "bg-slate-800 border border-slate-700/50" : "bg-white border border-slate-100 shadow-md"
              }`}
              aria-label="Assistant is generating reply"
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Error notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4"
          >
            <p
              className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900"
              role="alert"
            >
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer & input */}
      <div className={`border-t px-4 pt-3 pb-4 ${dark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/50"}`}>
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <a
            href={college.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            <span>💬</span> Talk to Admission Cell
          </a>
          <a
            href={college.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:brightness-95"
          >
            <span>📝</span> Apply Online
          </a>
          <button
            type="button"
            onClick={() => setLeadOpen((v) => !v)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              leadOpen
                ? "bg-brand text-white"
                : dark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            Request Call Back
          </button>
        </div>

        <AnimatePresence>
          {leadOpen && (
            <motion.form
              action={saveLead}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div
                className={`rounded-2xl border p-3.5 ${
                  dark ? "border-slate-700 bg-slate-800/90" : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <p className={`mb-2 text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-700"}`}>
                  Request a callback from our Admission Counsellor
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    name="name"
                    required
                    aria-label="Your full name"
                    placeholder="Student Name"
                    className={`rounded-xl border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand ${
                      dark
                        ? "border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                        : "border-slate-200 bg-slate-50 placeholder:text-slate-400"
                    }`}
                  />
                  <input
                    name="phone"
                    required
                    type="tel"
                    aria-label="Phone number"
                    placeholder="Phone Number (+91)"
                    className={`rounded-xl border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand ${
                      dark
                        ? "border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                        : "border-slate-200 bg-slate-50 placeholder:text-slate-400"
                    }`}
                  />
                  <input
                    name="course"
                    required
                    aria-label="Course interest"
                    placeholder="Course interested in"
                    className={`rounded-xl border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand ${
                      dark
                        ? "border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                        : "border-slate-200 bg-slate-50 placeholder:text-slate-400"
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-brand py-2 text-sm font-semibold text-white transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Submit Request
                </button>
                {leadNote && (
                  <p
                    className={`mt-2 text-xs ${
                      leadNote.startsWith("Thank") ? "text-emerald-600 dark:text-emerald-400" : "text-red-600"
                    }`}
                  >
                    {leadNote}
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <label className="sr-only" htmlFor="question">
            Your admission question
          </label>
          <div
            className={`relative flex flex-1 items-end rounded-2xl border transition-all ${
              dark
                ? "border-slate-700 bg-slate-800 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand"
                : "border-slate-200 bg-white focus-within:border-brand focus-within:ring-1 focus-within:ring-brand shadow-sm"
            }`}
          >
            <textarea
              ref={textareaRef}
              id="question"
              value={input}
              maxLength={500}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask about admissions, courses, fees, eligibility..."
              className={`w-full resize-none bg-transparent px-4 py-3 pr-8 text-sm leading-relaxed focus:outline-none ${
                dark ? "text-slate-100 placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"
              }`}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput("")}
                className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-0.5"
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          {voiceSupported && (
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={listening}
              title={listening ? "Stop voice recording" : "Speak your question"}
              aria-label={listening ? "Stop listening" : "Start voice input"}
              className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-full text-white transition-all active:scale-95 ${
                listening
                  ? "bg-red-500 shadow-lg shadow-red-500/30 animate-pulse"
                  : "bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              }`}
            >
              {listening ? (
                <span className="waveform flex items-end gap-0.5" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={busy || !input.trim()}
            title="Send message"
            className="grid h-11 w-11 place-items-center flex-shrink-0 rounded-full bg-brand text-white shadow-md shadow-brand/20 transition-all hover:bg-brand/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg className="w-5 h-5 -rotate-45 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>

        <p className="mt-2 text-center text-[10px] text-slate-400">
          Official Admission Assistant · Contact Admission Cell: {college.phone}
        </p>
      </div>
    </section>
  );
}
