"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import {
  ChatMessage,
  getInitialMessage,
  getAssistantResponse,
} from "@/lib/chat-service";

type DemandChatProps = {
  demand: string;
  partnerName?: string | null;
  onSuggestDetail?: (detail: string) => void;
};

export function DemandChat({
  demand,
  partnerName = null,
  onSuggestDetail,
}: DemandChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [aiMode, setAiMode] = useState<"gemini" | "mock" | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize with the first assistant message
  useEffect(() => {
    if (!initialized) {
      const initial = getInitialMessage({ demand, partnerName });
      setMessages([initial]);
      setInitialized(true);
    }
  }, [initialized, demand, partnerName]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(content: string) {
    if (!content.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    // Collect user answers to suggest as details
    if (onSuggestDetail && updatedMessages.filter((m) => m.role === "user").length >= 2) {
      const userAnswers = updatedMessages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(". ");
      onSuggestDetail(userAnswers);
    }

    const response = await getAssistantResponse(updatedMessages, {
      demand,
      partnerName,
    });

    if (response.source) {
      setAiMode(response.source);
    }

    setMessages((prev) => [...prev, response]);
    setIsTyping(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickReply(text: string) {
    sendMessage(text);
  }

  // Should we show quick replies? Only after the first assistant message and no user response yet
  const showQuickReplies =
    messages.length === 1 && messages[0].role === "assistant" && !isTyping;

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pp-teal/20">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Promo</p>
          <p className="text-xs text-white/40">Assistente PesquisaPromo</p>
        </div>
        {isTyping && (
          <span className="ml-auto text-xs text-pp-teal animate-pulse">
            digitando...
          </span>
        )}
        {!isTyping && aiMode && (
          <span
            className={`ml-auto rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
              aiMode === "gemini"
                ? "bg-pp-teal/15 text-pp-teal-soft"
                : "bg-amber-500/15 text-amber-400"
            }`}
          >
            {aiMode === "gemini" ? "⚡ Gemini IA" : "🧪 Simulado"}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-pp-teal text-white rounded-br-sm"
                  : "bg-white/[0.08] text-white/80 rounded-bl-sm"
              }`}
            >
              {msg.content.split("**").map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="font-semibold text-white">
                    {part}
                  </strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </div>
          </div>
        ))}

        {/* Quick reply buttons */}
        {showQuickReplies && (
          <div className="flex gap-2 pl-1">
            <button
              onClick={() => handleQuickReply("Sim")}
              className="rounded-full bg-pp-teal/20 px-4 py-2 text-xs font-semibold text-pp-teal-soft transition hover:bg-pp-teal/30"
            >
              👍 Sim, me ajuda!
            </button>
            <button
              onClick={() => handleQuickReply("Não, enviar")}
              className="rounded-full bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/50 transition hover:bg-white/10"
            >
              Pular
            </button>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 rounded-2xl bg-white/[0.08] px-4 py-3 rounded-bl-sm">
              <div className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-white/10 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua resposta..."
          disabled={isTyping}
          className="h-10 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pp-teal text-white transition hover:bg-pp-teal-soft disabled:opacity-30"
        >
          ↑
        </button>
      </form>
    </div>
  );
}
