"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat-types";

export interface MessageItem {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: Date;
  isStreaming?: boolean;
}

export type ChatStatus = "idle" | "thinking" | "streaming" | "error";

interface UseChatOptions {
  onStreamingFinish?: (fullText: string) => void;
}

export function useChat({ onStreamingFinish }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (rawText: string, fromVoice = false) => {
      const text = rawText.trim();
      if (!text || status === "thinking" || status === "streaming") return;

      setError(null);

      const userMessage: MessageItem = {
        id: `user-${Date.now()}`,
        role: "user",
        text,
        createdAt: new Date(),
      };

      const botMessageId = `model-${Date.now()}`;
      const botPlaceholder: MessageItem = {
        id: botMessageId,
        role: "model",
        text: "",
        createdAt: new Date(),
        isStreaming: true,
      };

      const updatedHistory = [...messages, userMessage];
      setMessages([...updatedHistory, botPlaceholder]);
      setStatus("thinking");

      // Context payload for backend /api/chat
      const recent = updatedHistory.slice(-8);
      const payload: ChatMessage[] = recent.map((m, idx) => {
        if (fromVoice && idx === recent.length - 1 && m.role === "user") {
          return { role: "user", text: `[voice] ${m.text}` };
        }
        return { role: m.role, text: m.text };
      });

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || "Could not generate answer. Please try again.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";
        let receivedFirstToken = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const line = part.replace(/^data:\s*/, "").trim();
            if (!line || line === "[DONE]") continue;

            try {
              const parsed = JSON.parse(line) as { text?: string };
              if (parsed.text) {
                if (!receivedFirstToken) {
                  receivedFirstToken = true;
                  setStatus("streaming");
                }
                full += parsed.text;

                setMessages((prev) => {
                  const copy = [...prev];
                  const lastIdx = copy.length - 1;
                  if (lastIdx >= 0 && copy[lastIdx].id === botMessageId) {
                    copy[lastIdx] = {
                      ...copy[lastIdx],
                      text: full,
                      isStreaming: true,
                    };
                  }
                  return copy;
                });
              }
            } catch {
              // ignore malformed SSE json
            }
          }
        }

        // Finish streaming
        setMessages((prev) => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].id === botMessageId) {
            copy[lastIdx] = {
              ...copy[lastIdx],
              text: full,
              isStreaming: false,
            };
          }
          return copy;
        });

        setStatus("idle");
        if (onStreamingFinish && full) {
          onStreamingFinish(full);
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          setStatus("idle");
          return;
        }
        const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
        setError(errorMsg);
        setStatus("error");
        // Remove the empty bot placeholder if it produced no text
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.id === botMessageId && !last.text) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        abortControllerRef.current = null;
      }
    },
    [messages, onStreamingFinish, status],
  );

  const regenerateLast = useCallback(() => {
    if (messages.length < 2 || status === "thinking" || status === "streaming") return;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages((prev) => {
      const idx = prev.map((m) => m.role).lastIndexOf("model");
      if (idx !== -1) {
        return prev.slice(0, idx);
      }
      return prev;
    });

    sendMessage(lastUserMessage.text);
  }, [messages, sendMessage, status]);

  return {
    messages,
    status,
    error,
    sendMessage,
    regenerateLast,
    clearChat,
  };
}
