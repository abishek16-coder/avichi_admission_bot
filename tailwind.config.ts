import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        border: "var(--border)",
        primary: {
          DEFAULT: "var(--primary)",
          glow: "var(--primary-glow)",
        },
        accent: "var(--accent)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        brand: {
          DEFAULT: "var(--primary)",
          glow: "var(--primary-glow)",
          accent: "var(--accent)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        tamil: ["var(--font-tamil)", "Noto Sans Tamil", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 50px rgba(167, 139, 250, 0.35)",
        "glow-lg": "0 0 80px rgba(124, 92, 255, 0.4)",
        pill: "0 4px 24px -2px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
