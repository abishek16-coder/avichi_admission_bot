import type { Metadata } from "next";
import { college } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${college.name} admissions`,
  description: `Ask the ${college.name} admission assistant about courses, eligibility, fees, and how to apply.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = `:root{--brand:${college.primary};--accent:${college.accent}}`;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark"||(!localStorage.getItem("theme")&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
