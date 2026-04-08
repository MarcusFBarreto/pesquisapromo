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
  const [aiMode, setAiMode] = useState<"openai" | "gemini" | "mock" | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize with the first assistant message + Auto-analysis
  useEffect(() => {
    async function initChat() {
      if (!initialized) {
        const initial = getInitialMessage({ demand, partnerName });
        setMessages([initial]);
        setInitialized(true);

        // Se houver uma demanda inicial, já dispara a análise técnica imediata
        if (demand.trim()) {
          setIsTyping(true);
          try {
            const response = await getAssistantResponse([initial], { demand, partnerName });
            if (response.source) setAiMode(response.source);
            setMessages((prev) => [...prev, response]);
          } catch (error) {
            console.error("Erro na análise inicial:", error);
          } finally {
            setIsTyping(false);
          }
        }
      }
    }
    initChat();
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

    // Collect and sync all user answers to the form (Gostaríamos de saber mais...)
    if (onSuggestDetail) {
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
    <div className="flex h-full flex-col bg-white">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 bg-slate-50/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Promo</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assistente IA</p>
        </div>
        {isTyping && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-emerald-600 animate-pulse">
            digitando...
          </span>
        )}
        {!isTyping && aiMode && (
          <span
            className={`ml-auto rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
              aiMode === "gemini"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            {aiMode === "gemini" ? "⚡ Gemini" : "🧪 Mock"}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-6 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-br-none"
                  : "bg-slate-100 text-slate-700 rounded-bl-none border border-slate-200"
              }`}
            >
              {msg.content.split("**").map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="font-bold text-emerald-600">
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
              className="rounded-full bg-emerald-50 border border-emerald-200 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-emerald-700 transition hover:bg-emerald-100"
            >
              ⚡ Sim, me ajuda!
            </button>
            <button
              onClick={() => handleQuickReply("Não, enviar")}
              className="rounded-full bg-slate-50 border border-slate-200 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              Pular →
            </button>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 rounded-2xl bg-slate-100 px-5 py-4 rounded-bl-none border border-slate-200 shadow-sm">
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 border-t border-slate-100 p-5 bg-slate-50/30"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua resposta..."
          disabled={isTyping}
          className="h-12 flex-1 rounded-xl border border-slate-200 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 disabled:opacity-50 shadow-inner"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-emerald-600 shadow-lg shadow-slate-900/10 disabled:opacity-30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </div>
  );
}
