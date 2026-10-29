export const college = {
  name: process.env.NEXT_PUBLIC_COLLEGE_NAME ?? "Avichi College of Engineering",
  city: process.env.NEXT_PUBLIC_COLLEGE_CITY ?? "Chennai",
  phone: process.env.NEXT_PUBLIC_COLLEGE_PHONE ?? "+91 44 0000 0000",
  email: process.env.NEXT_PUBLIC_COLLEGE_EMAIL ?? "admissions@avichi.example.edu",
  applyUrl: process.env.NEXT_PUBLIC_APPLY_URL ?? "https://example.edu/apply",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/919000000000",
  primary: process.env.NEXT_PUBLIC_PRIMARY_COLOR ?? "#0B3A6A",
  accent: process.env.NEXT_PUBLIC_ACCENT_COLOR ?? "#C9A227",
};

export const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
