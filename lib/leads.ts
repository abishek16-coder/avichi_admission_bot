import { appendFile, mkdir } from "fs/promises";
import path from "path";
import type { Lead } from "@/lib/chat-types";

const file = path.join(process.cwd(), "data", "leads.jsonl");

export async function saveLead(lead: Lead): Promise<void> {
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      return;
    } catch (err) {
      console.warn("Failed to forward lead to webhook:", err);
    }
  }

  // Fallback for local development only (never crash on read-only environments like Vercel)
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, `${JSON.stringify(lead)}\n`, "utf8");
  } catch (err) {
    console.warn("Local lead write skipped or unavailable in read-only environment:", err);
  }
}
