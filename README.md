# College admission chatbot

Production-ready Next.js assistant for prospective students and parents. Gemini is called only from `app/api/chat`. The browser never sees `GEMINI_API_KEY`.

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`.
3. Replace placeholders in `data/knowledge.md` and the `NEXT_PUBLIC_*` values.
4. Replace `public/logo.svg` with `public/logo.png` (the UI requests `/logo.png`).
5. Run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Vercel

1. Import this repository in Vercel.
2. Add every variable from `.env.example`. Do not prefix `GEMINI_API_KEY` or `ADMIN_SECRET` with `NEXT_PUBLIC_`.
3. Deploy. The chat route runs on the Node.js runtime.

`/admin` writes `data/knowledge.override.md`. Vercel’s filesystem resets, so for a lasting edit either commit `data/knowledge.md` or attach persistent storage. Leads append to `data/leads.jsonl` unless `LEADS_WEBHOOK_URL` is set (use a Google Apps Script web app or any JSON endpoint).

## Update the knowledge base

Edit `data/knowledge.md` and redeploy. The UI does not change. `lib/knowledge.ts` is the only reader, so a later RAG or database source can replace `loadKnowledge()` without touching the chat component.

The admin page at `/admin` loads and saves the override file when `x-admin-secret` matches `ADMIN_SECRET`.

## Embed on the college site

```html
<script src="https://YOUR_DOMAIN/widget.js" defer></script>
```

The floating button opens `/embed`.

## Voice

Input uses the Web Speech API (`SpeechRecognition`). Output uses `speechSynthesis`. Unsupported browsers keep the text box. The speaker toggle stops spoken replies. A user turn that started from the mic is prefixed with `[voice]` so the model avoids markdown.

## Safety

- Last 10 messages are sent as context.
- User text is capped at 500 characters.
- Prompt-injection phrases are replaced with a safe admission prompt.
- Temperature is 0.3, output is capped, and Gemini safety filters are set to block medium and above.
- Rate limit: 12 requests per IP per minute (in-memory; use a shared store if you run many instances).
