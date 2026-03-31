"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

type DemandFormProps = {
  initialDemand?: string;
  partnerSlug?: string | null;
  partnerName?: string | null;
  suggestedDetails?: string;
};

export function DemandForm({
  initialDemand = "",
  partnerSlug = null,
  partnerName = null,
  suggestedDetails = "",
}: DemandFormProps) {
  const [request, setRequest] = useState(initialDemand);
  const [details, setDetails] = useState(suggestedDetails);
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [resultInfo, setResultInfo] = useState<{ categories?: string[]; id?: string } | null>(null);

  const lastSuggestedRef = useRef("");
1
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

      const data = await res.json();

      if (data.success) {
        setResultInfo({ categories: data.matchedCategories, id: data.id });
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10 border border-emerald-100">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h3 className="mb-4 text-3xl font-black text-slate-900 tracking-tight">Tudo pronto!</h3>
        <p className="mx-auto mb-10 max-w-xs text-base text-slate-500 font-light leading-relaxed">
          Sua demanda foi enviada com sucesso.{" "}
          {partnerName
            ? `O parceiro ${partnerName}`
            : "Nossos parceiros locais"}{" "}
          entrarão em contato direto no seu WhatsApp.
        </p>
        <div className="flex flex-col items-center gap-6 w-full">
          {resultInfo?.categories && resultInfo.categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {resultInfo.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-slate-50 border border-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          <a
            href="/"
            className="group flex items-center gap-3 rounded-full bg-slate-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-emerald-600 hover:scale-[1.02] shadow-xl shadow-slate-900/10"
          >
            Voltar ao Início
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Request summary */}
      <div>
        <label
          htmlFor="form-request"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          O que você precisa?
        </label>
        <input
          id="form-request"
          required
          type="text"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="h-14 w-full rounded-xl border border-slate-200 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          placeholder="Ex.: 50 sacos de cimento CP2"
        />
      </div>

      {/* Details / context */}
      <div>
        <label
          htmlFor="form-details"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          Detalhes e contexto{" "}
          <span className="normal-case tracking-normal text-slate-300 font-medium">(opcional)</span>
        </label>
        <textarea
          id="form-details"
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          placeholder="Quantidade, marca, urgência, endereço de entrega..."
        />
      </div>

      <hr className="border-slate-100" />

      {/* WhatsApp */}
      <div>
        <label
          htmlFor="form-whatsapp"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
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
          className="h-14 w-full rounded-xl border border-slate-200 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          placeholder="(00) 00000-0000"
        />
      </div>

      {/* Name (optional) */}
      <div>
        <label
          htmlFor="form-name"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          Seu nome{" "}
          <span className="normal-case tracking-normal text-slate-300 font-medium">(opcional)</span>
        </label>
        <input
          id="form-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-14 w-full rounded-xl border border-slate-200 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
        className="w-full rounded-xl bg-slate-900 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-600 hover:shadow-xl shadow-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting"
          ? "Enviando..."
          : partnerName
            ? `Enviar para ${partnerName}`
            : "Enviar pedido"}
      </button>

      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
        Gratuito · Direto no WhatsApp
      </p>
    </form>
  );
}
