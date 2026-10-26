"use client";

import { FormEvent, useState } from "react";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [note, setNote] = useState("");

  async function load(event: FormEvent) {
    event.preventDefault();
    setNote("");
    const response = await fetch("/api/admin/knowledge", { headers: { "x-admin-secret": secret } });
    const data = await response.json();
    if (!response.ok) {
      setNote(data.error || "Could not load.");
      return;
    }
    setMarkdown(data.markdown);
  }

  async function save() {
    setNote("");
    const response = await fetch("/api/admin/knowledge", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ markdown }),
    });
    const data = await response.json().catch(() => ({}));
    setNote(response.ok ? "Saved. New chats use this knowledge base." : data.error || "Save failed.");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Knowledge base</h1>
      <p className="text-sm text-slate-500">Updates are stored as data/knowledge.override.md on the server. On Vercel the filesystem is ephemeral unless you attach persistent storage.</p>
      <form onSubmit={load} className="flex gap-2">
        <label className="sr-only" htmlFor="secret">Admin secret</label>
        <input id="secret" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Admin secret" className="flex-1 rounded-xl border border-slate-300 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand dark:border-slate-600" />
        <button className="rounded-xl bg-brand px-4 py-2 text-white">Load</button>
      </form>
      <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} aria-label="Knowledge base markdown" className="min-h-[420px] rounded-2xl border border-slate-300 bg-transparent p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand dark:border-slate-600" />
      <button type="button" onClick={save} className="self-start rounded-xl bg-brand px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent">Save</button>
      {note && <p role="status">{note}</p>}
    </main>
  );
}
