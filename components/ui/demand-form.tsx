"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Tag, Sparkles } from "lucide-react";
import { findMatchesForDemand, MatchedOffer } from "@/lib/match-service";
import { MatchCard } from "./match-card";

type DemandFormProps = {
  initialDemand?: string;
  partnerSlug?: string | null;
  partnerName?: string | null;
  suggestedDetails?: string;
  onVerified?: () => void;
  onSelectMatch?: (match: MatchedOffer) => void;
  selectedMatchId?: string;
};

export function DemandForm({
  initialDemand = "",
  partnerSlug = null,
  partnerName = null,
  suggestedDetails = "",
  onVerified,
  onSelectMatch,
  selectedMatchId,
}: DemandFormProps) {
  const [request, setRequest] = useState(initialDemand);
  const [details, setDetails] = useState(suggestedDetails);
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [resultInfo, setResultInfo] = useState<{ categories?: string[]; id?: string } | null>(null);

  const lastSuggestedRef = useRef("");
  // Sync suggested details from parent/chat
  useEffect(() => {
    // Only auto-fill if the user hasn't manually changed the field to something else
    // or if the field is currently what we last suggested.
    if (suggestedDetails && (!details || details === lastSuggestedRef.current)) {
      setDetails(suggestedDetails);
      lastSuggestedRef.current = suggestedDetails;
    }
  }, [suggestedDetails, details]);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 11) raw = raw.slice(0, 11);

    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    setWhatsapp(formatted);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!request.trim() || !whatsapp.trim()) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/demands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request,
          details: details || undefined,
          name: name || undefined,
          whatsapp,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setResultInfo({ categories: data.matchedCategories, id: data.id });
        
        const initialMatches = findMatchesForDemand(request, data.matchedCategories?.[0]);
        if (initialMatches.length > 0) {
          onSelectMatch?.(initialMatches[0]);
        }

        // Se NÃO for necessário verificar (Trusted User), pulamos direto para o fim
        if (data.verificationRequired === false) {
          setVerified(true);
          onVerified?.();
        }
        
        setStatus("success");
      } else {
        setStatus("error");
        console.error("Server Error:", data || "Unknown Error");
        alert("Erro no servidor: " + (data?.error || "A API não retornou a resposta correta."));
      }
    } catch (err: any) {
      console.error("Network or Syntax Error:", err);
      setStatus("error");
      alert("Erro de conexão ou crash interno: " + err.message);
    }
  }

  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!resultInfo?.id || !verifyCode) return;
    setVerifying(true);
    try {
      const res = await fetch("/api/demands/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resultInfo.id, code: verifyCode }),
      });
      if (res.ok) {
        setVerified(true);
        onVerified?.();
      } else {
        alert("Código incorreto. Verifique no seu WhatsApp.");
      }
    } catch {
      alert("Erro na verificação.");
    } finally {
      setVerifying(false);
    }
  }

  if (status === "success") {
    // Apollo Match Engine (v1.3.0)
    const matches = findMatchesForDemand(request, resultInfo?.categories?.[0]);

    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        {!verified ? (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-xl shadow-amber-500/10 border border-amber-100">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-900 tracking-tight">Quase lá!</h3>
            <p className="mx-auto mb-6 max-w-xs text-sm text-slate-500 font-light leading-relaxed">
              Recebemos sua solicitação; um código de segurança foi enviado ao seu WhatsApp para validar seu pedido.
            </p>
            
            <form onSubmit={handleVerify} className="w-full max-w-xs mb-8">
              <input 
                type="text" 
                maxLength={4}
                placeholder="0000"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="w-full h-14 text-center text-2xl font-black tracking-[0.5em] rounded-xl border border-slate-200 bg-slate-50 mb-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={verifying}
                className="w-full py-4 bg-emerald-500 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
              >
                {verifying ? "Verificando..." : "Validar Pedido"}
              </button>
            </form>

            {matches.length > 0 && (
               <div className="w-full border-t border-slate-100 pt-8 mt-4 text-left">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-4 w-4 text-pp-orange animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                      Sua solução pode estar aqui. Confira:
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {matches.map(m => (
                      <button 
                        key={m.id}
                        type="button"
                        onClick={() => onSelectMatch?.(m)}
                        className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl transition-transform active:scale-[0.98]"
                      >
                        <MatchCard match={m} isSelected={selectedMatchId === m.id} />
                      </button>
                    ))}
                  </div>
               </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10 border border-emerald-100">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-900 tracking-tight">Tudo certo!</h3>
            <p className="mx-auto mb-10 max-w-xs text-sm text-slate-500 font-light leading-relaxed">
              Recebemos sua solicitação; iremos trabalhar para lhe retornar com as melhores informações.
            </p>
            
            {matches.length > 0 && (
               <div className="w-full mb-10 text-left">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                      Sua solução pode estar aqui. Confira:
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {matches.map(m => (
                      <button 
                        key={m.id}
                        type="button"
                        onClick={() => onSelectMatch?.(m)}
                        className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl transition-transform active:scale-[0.98]"
                      >
                        <MatchCard match={m} isSelected={selectedMatchId === m.id} />
                      </button>
                    ))}
                  </div>
               </div>
            )}

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link
                href="/"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors py-2"
              >
                Voltar à página inicial
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Request summary (Essential) */}
      <div>
        <label
          htmlFor="form-request"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 mobile-text-anchor"
        >
          O que você precisa?
        </label>
        <input
          id="form-request"
          required
          type="text"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="h-14 w-full rounded-xl border border-emerald-100 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
          placeholder="Ex.: 50 sacos de cimento CP2"
        />
      </div>

      {/* 2. WhatsApp (Essential — right after the request) */}
      <div>
        <label
          htmlFor="form-whatsapp"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 mobile-text-anchor"
        >
          WhatsApp para receber propostas
        </label>
        <input
          id="form-whatsapp"
          required
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={whatsapp}
          onChange={handleWhatsappChange}
          className="h-14 w-full rounded-xl border border-emerald-100 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
          placeholder="(00) 00000-0000"
        />
      </div>

      <hr className="border-slate-100" />

      {/* 3. Concierge Details (Optional) */}
      <div>
        <label
          htmlFor="form-details"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 mobile-text-anchor"
        >
          Gostaríamos de saber mais...
          <span className="normal-case tracking-normal text-slate-300 font-medium sm:text-slate-200"> (opcional)</span>
        </label>
        <p className="mb-3 text-xs text-slate-400 font-light leading-relaxed">
          É um item raro? Você tem pressa ou é reposição comum?
        </p>
        <textarea
          id="form-details"
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full rounded-xl border border-emerald-100 bg-white p-5 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
          placeholder="Ex: Não encontrei em nenhum lugar... preciso para amanhã..."
        />
      </div>

      {/* 4. Name (Optional) */}
      <div>
        <label
          htmlFor="form-name"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 mobile-text-anchor"
        >
          Seu nome{" "}
          <span className="normal-case tracking-normal text-slate-300 font-medium sm:text-slate-200">(opcional)</span>
        </label>
        <input
          id="form-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-14 w-full rounded-xl border border-emerald-100 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
          placeholder="Como devemos lhe chamar"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-xs text-red-500 font-bold">
          Ocorreu um erro ao enviar. Tente novamente.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-slate-900 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] mobile-btn-soft-dark solar-shimmer-effect"
      >
        {status === "submitting"
          ? "myLupando..."
          : partnerName
            ? `myLupar para ${partnerName}`
            : "myLupar este pedido"}
      </button>

      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
        Gratuito · Direto no WhatsApp
      </p>
    </form>
  );
}
