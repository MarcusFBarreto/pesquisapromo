"use client";

import { useState, FormEvent } from "react";

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

  // Sync suggested details from parent/chat
  const prevSuggested = details;
  if (suggestedDetails && suggestedDetails !== prevSuggested && !details) {
    setDetails(suggestedDetails);
  }

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pp-teal/20 text-3xl">
          ✅
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">Tudo certo!</h3>
        <p className="mx-auto mb-4 max-w-xs text-sm text-white/60">
          Sua demanda foi enviada.{" "}
          {partnerName
            ? `O parceiro ${partnerName}`
            : "Os nossos parceiros locais"}{" "}
          em breve entrarão em contato via WhatsApp.
        </p>
        {resultInfo?.categories && resultInfo.categories.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {resultInfo.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-pp-orange/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-pp-orange"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        <a
          href="/"
          className="rounded-full bg-pp-orange px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover"
        >
          Voltar ao início
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Request summary */}
      <div>
        <label
          htmlFor="form-request"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
        >
          O que você precisa?
        </label>
        <input
          id="form-request"
          required
          type="text"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
          placeholder="Ex.: 50 sacos de cimento CP2"
        />
      </div>

      {/* Details / context — the field that was missing! */}
      <div>
        <label
          htmlFor="form-details"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
        >
          Detalhes e contexto{" "}
          <span className="normal-case tracking-normal text-white/25">(opcional)</span>
        </label>
        <textarea
          id="form-details"
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full rounded-[1rem] border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
          placeholder="Quantidade, marca, urgência, endereço de entrega, qualquer informação que ajude os parceiros..."
        />
      </div>

      <hr className="border-white/[0.06]" />

      {/* WhatsApp */}
      <div>
        <label
          htmlFor="form-whatsapp"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
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
          className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
          placeholder="(00) 00000-0000"
        />
      </div>

      {/* Name (optional) */}
      <div>
        <label
          htmlFor="form-name"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
        >
          Seu nome{" "}
          <span className="normal-case tracking-normal text-white/25">(opcional)</span>
        </label>
        <input
          id="form-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
          placeholder="Como devemos lhe chamar"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-xs text-red-400">
          Ocorreu um erro ao enviar. Tente novamente.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-pp-orange py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover hover:shadow-lg hover:shadow-pp-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting"
          ? "Enviando..."
          : partnerName
            ? `Enviar para ${partnerName}`
            : "Enviar pedido"}
      </button>

      <p className="text-center text-xs text-white/25">
        Gratuito. Seus dados ficam com você. Parceiros respondem direto.
      </p>
    </form>
  );
}
