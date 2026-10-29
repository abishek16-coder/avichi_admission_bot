import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Noto_Sans_Tamil } from "next/font/google";
import { college } from "@/lib/config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#05040D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${college.name} - AI Admission Assistant`,
  description: `Ask anything about admissions, courses, eligibility, and scholarships at ${college.name}. Answered instantly by text or voice.`,
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${notoSansTamil.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#05040D] text-[#F4F2FF] font-sans antialiased min-h-[100dvh] overflow-x-hidden selection:bg-purple-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
