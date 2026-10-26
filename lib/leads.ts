import { appendFile, mkdir } from "fs/promises";
import path from "path";
import type { Lead } from "@/lib/chat-types";

const file = path.join(process.cwd(), "data", "leads.jsonl");

export async function saveLead(lead: Lead): Promise<void> {
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    return;
  }
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(lead)}\n`, "utf8");
}
