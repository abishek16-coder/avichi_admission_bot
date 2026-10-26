import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { college, geminiModel } from "@/lib/config";
import { getRelevantKnowledge } from "@/lib/knowledge";
import { buildSystemInstruction, guardUserText } from "@/lib/prompt";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { ChatMessage } from "@/lib/chat-types";

export const runtime = "nodejs";

const fallback = `Sorry, I'm having trouble right now. Please contact the admission office at ${college.phone} or ${college.email}.`;

function sse(data: string) {
  return `data: ${data}\n\n`;
}

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request))) {
    return Response.json(
      { error: "Too many messages. Please wait a minute or call the admission office." },
      { status: 429 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  const history = incoming
    .filter((m) => (m.role === "user" || m.role === "model") && typeof m.text === "string")
    .map((m) => ({
      role: m.role,
      parts: [{ text: m.role === "user" ? guardUserText(m.text) : m.text.slice(0, 2000) }],
    }))
    .filter((m) => m.parts[0].text.length > 0);

  if (!history.length || history[history.length - 1].role !== "user") {
    return Response.json({ error: "Send a question to continue." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(sse(JSON.stringify({ text: fallback })) + sse("[DONE]"), {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }

  const latest = history[history.length - 1].parts[0].text;
  const knowledge = await getRelevantKnowledge(latest);
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: geminiModel,
    systemInstruction: buildSystemInstruction(knowledge),
    generationConfig: { temperature: 0.4, maxOutputTokens: 1000 },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });

  const prior = history.slice(0, -1);
  const stream = new ReadableStream({
    async start(controller) {
      const send = (text: string) => controller.enqueue(new TextEncoder().encode(sse(JSON.stringify({ text }))));
      try {
        const chat = model.startChat({ history: prior });
        const result = await chat.sendMessageStream(latest);
        let sent = false;
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            sent = true;
            send(text);
          }
        }
        if (!sent) send(fallback);
      } catch (error) {
        const detail = error instanceof Error ? error.message : "";
        console.error("Gemini chat failed", detail);
        const retired = /no longer available|not found|404/i.test(detail);
        send(
          retired
            ? `${fallback} The configured model is unavailable. Set GEMINI_MODEL to a current model such as gemini-3-flash-preview.`
            : fallback,
        );
      } finally {
        controller.enqueue(new TextEncoder().encode(sse("[DONE]")));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
