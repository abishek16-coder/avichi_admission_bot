"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

interface CourseItem {
  id: string;
  name: string;
  duration: string;
  desc: string;
  descTa: string;
}

const COURSES: CourseItem[] = [
  {
    id: "bsc-cs",
    name: "B.Sc Computer Science",
    duration: "3 Years",
    desc: "Programming, data structures, algorithms, AI foundations & web applications.",
    descTa: "நிரலாக்கம், தரவு கட்டமைப்பு, வழிமுறைகள் மற்றும் வலை பயன்பாடுகள்.",
  },
  {
    id: "bca",
    name: "BCA (Computer Applications)",
    duration: "3 Years",
    desc: "Software development, modern frameworks, database management & industry projects.",
    descTa: "மென்பொருள் உருவாக்கம், நவீன கட்டமைப்புகள் மற்றும் தரவுத்தள மேலாண்மை.",
  },
  {
    id: "viscom",
    name: "B.Sc Visual Communication",
    duration: "3 Years",
    desc: "Digital filmmaking, graphic design, photography, animation & media production.",
    descTa: "டிஜிட்டல் திரைப்பட உருவாக்கம், கிராஃபிக் வடிவமைப்பு மற்றும் மீடியா தயாரிப்பு.",
  },
  {
    id: "bcom",
    name: "B.Com (General / Corporate / A&F)",
    duration: "3 Years",
    desc: "Accounting, corporate taxation, financial management & banking operations.",
    descTa: "கணக்கியல், வரிவிதிப்பு, நிதி மேலாண்மை மற்றும் வங்கி செயல்பாடுகள்.",
  },
  {
    id: "bba",
    name: "BBA (Business Administration)",
    duration: "3 Years",
    desc: "Business strategy, human resources, marketing principles & entrepreneurship.",
    descTa: "வணிக உத்தி, மனித வளம், சந்தைப்படுத்தல் மற்றும் தொழில் முனைவு.",
  },
  {
    id: "criminology",
    name: "B.Sc Criminology & Criminal Justice",
    duration: "3 Years",
    desc: "Forensic investigation, police science, criminal psychology & cybercrime.",
    descTa: "தடயவியல் விசாரணை, காவல்துறை அறிவியல் மற்றும் குற்றவியல் உளவியல்.",
  },
];

interface CourseCardsProps {
  onAskMore: (query: string) => void;
  language?: "en" | "ta";
}

export default function CourseCards({
  onAskMore,
  language = "en",
}: CourseCardsProps) {
  const askMoreText = language === "ta" ? "மேலும் அறிய" : "Ask more";

  return (
    <div className="w-full my-3">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-primary-glow">
        <BookOpen className="w-3.5 h-3.5" />
        <span>
          {language === "ta" ? "சிறப்புப் படிப்புகள்" : "Featured Degree Programmes"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {COURSES.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
            className="flex flex-col justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-primary-glow/40 hover:bg-white/[0.06] transition-all duration-200 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-white group-hover:text-primary-glow transition-colors">
                  {course.name}
                </h4>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted flex-shrink-0">
                  {course.duration}
                </span>
              </div>
              <p className="text-xs text-[#A9A3C7] leading-relaxed mb-3">
                {language === "ta" ? course.descTa : course.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const query =
                  language === "ta"
                    ? `${course.name} சேர்க்கை தகுதி மற்றும் பாடத்திட்டம் பற்றி கூறுங்கள்`
                    : `Tell me more about eligibility, curriculum and career opportunities for ${course.name}`;
                onAskMore(query);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-glow hover:text-white transition-colors self-start group/btn"
            >
              <span>{askMoreText}</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

