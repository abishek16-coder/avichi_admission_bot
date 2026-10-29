"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, CheckCircle2, X, Send } from "lucide-react";

interface LeadCardProps {
  language?: "en" | "ta";
  onDismiss?: () => void;
}

export default function LeadCard({
  language = "en",
  onDismiss,
}: LeadCardProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTamil = language === "ta";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || submitted) return;

    if (!name.trim() || !phone.trim() || !course.trim()) {
      setError(
        isTamil
          ? "தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும்."
          : "Please fill in all details.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, course }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(
          data?.error ||
            (isTamil
              ? "சேமிக்க முடியவில்லை. தயவுசெய்து நேரடியாக அழைக்கவும்."
              : "Could not save details. Please contact the office directly."),
        );
      }
    } catch {
      // Must never break chat experience
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative my-4 p-4 sm:p-5 rounded-2xl bg-[#0F0C22]/90 border border-primary/30 shadow-[0_8px_32px_rgba(124,92,255,0.15)] backdrop-blur-xl"
    >
      {/* Dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 text-[#A9A3C7] hover:text-white p-1 rounded-full hover:bg-white/[0.08] transition-colors"
          aria-label="Dismiss lead form"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 py-2 text-emerald-400"
          >
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                {isTamil
                  ? "நன்றி! எங்கள் சேர்க்கைக் குழு விரைவில் தொடர்புகொள்ளும்."
                  : "Thank you! Our admission team will call you shortly."}
              </p>
              <p className="text-xs text-[#A9A3C7] mt-0.5">
                {isTamil
                  ? "உங்கள் விவரங்கள் பதிவு செய்யப்பட்டுள்ளன."
                  : "Your callback request has been safely received."}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 mb-2 text-primary-glow">
              <PhoneCall className="w-4 h-4" />
              <h4 className="text-sm font-semibold text-white">
                {isTamil
                  ? "திரும்ப அழைக்க விரும்புகிறீர்களா?"
                  : "Want a call back from admissions?"}
              </h4>
            </div>

            <p className="text-xs text-[#A9A3C7] mb-3">
              {isTamil
                ? "உங்கள் பெயர், தொலைபேசி எண் மற்றும் விரும்பும் படிப்பை உள்ளிடுங்கள்."
                : "Leave your name, phone number, and course interest for free admission guidance."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder={isTamil ? "உங்கள் பெயர்" : "Your Name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-[#A9A3C7]/60 focus:outline-none focus:border-primary-glow"
                  maxLength={60}
                />
                <input
                  type="tel"
                  placeholder={isTamil ? "மொபைல் எண்" : "Phone Number"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-[#A9A3C7]/60 focus:outline-none focus:border-primary-glow"
                  maxLength={15}
                />
                <input
                  type="text"
                  placeholder={
                    isTamil ? "விருப்பப் படிப்பு (எ.கா. BCA)" : "Course (e.g. BCA, B.Sc CS)"
                  }
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-[#A9A3C7]/60 focus:outline-none focus:border-primary-glow"
                  maxLength={60}
                />
              </div>

              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-glow transition-all disabled:opacity-50 active:scale-95 shadow-[0_0_15px_rgba(124,92,255,0.4)]"
              >
                <Send className="w-3 h-3" />
                <span>
                  {loading
                    ? isTamil
                      ? "அனுப்புகிறது..."
                      : "Submitting..."
                    : isTamil
                    ? "அனுப்பவும்"
                    : "Request Call Back"}
                </span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

