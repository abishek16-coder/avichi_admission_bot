import { college, groqModel } from "@/lib/config";
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

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(sse(JSON.stringify({ text: fallback })) + sse("[DONE]"), {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }

  const latest = history[history.length - 1].parts[0].text;
  const knowledge = await getRelevantKnowledge(latest);
  const prior = history.slice(0, -1).map((message) => ({
    role: (message.role === "model" ? "assistant" : "user") as "assistant" | "user",
    content: message.parts[0].text,
  }));
  const stream = new ReadableStream({
    async start(controller) {
      const send = (text: string) => controller.enqueue(new TextEncoder().encode(sse(JSON.stringify({ text }))));
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [
              { role: "system", content: buildSystemInstruction(knowledge) },
              ...prior,
              { role: "user", content: latest },
            ],
            temperature: 0.3,
            max_completion_tokens: 512,
            reasoning_effort: "low",
            stream: true,
          }),
        });

        if (!response.ok || !response.body) {
          const detail = await response.text();
          console.error("Groq chat failed", response.status, detail.slice(0, 500));
          send(fallback);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let sent = false;
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() || "";
          for (const event of events) {
            const line = event.split("\n").find((part) => part.startsWith("data: "));
            if (!line) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;
            try {
              const chunk = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string; reasoning?: string } }> };
              const text = chunk.choices?.[0]?.delta?.content;
              if (text) {
                sent = true;
                send(text);
              }
            } catch {
              continue;
            }
          }
        }
        if (!sent) send(fallback);
      } catch (error) {
        console.error("Groq chat failed", error instanceof Error ? error.message : "Unknown error");
        send(fallback);
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
