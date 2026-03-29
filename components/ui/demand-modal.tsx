"use client";

import { useState, FormEvent, useEffect, useRef, useId } from "react";
import { submitDemand } from "@/lib/demand-service";

type DemandModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialDemand?: string;
  intendedPartnerSlug?: string | null;
  intendedPartnerName?: string | null;
};

export function DemandModal({
  isOpen,
  onClose,
  initialDemand = "",
  intendedPartnerSlug = null,
  intendedPartnerName = null,
}: DemandModalProps) {
  const [request, setRequest] = useState(initialDemand);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const titleId = useId();
  const firstInputRef = useRef<HTMLTextAreaElement>(null);

  // Reset ALL state when modal opens; sync with new initialDemand
  useEffect(() => {
    if (isOpen) {
      setRequest(initialDemand);
      setName("");
      setWhatsapp("");
      setStatus("idle");
      // Auto-focus first field after animation frame
      requestAnimationFrame(() => firstInputRef.current?.focus());
    }
  }, [isOpen, initialDemand]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!request.trim() || !whatsapp.trim()) return;

    setStatus("submitting");

    const result = await submitDemand({
      request,
      name,
      whatsapp,
      intendedPartnerSlug,
      sourceUrl: window.location.href,
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  // Formatting WhatsApp — simple mask for BR mobile numbers
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

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-pp-dark/80 p-6 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="animate-fade-in-up relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-pp-dark p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pp-teal/20 text-3xl">
              ✅
            </div>
            <h3 id={titleId} className="mb-2 text-2xl font-bold text-white">
              Tudo certo!
            </h3>
            <p className="mx-auto mb-8 max-w-xs text-white/60">
              Sua demanda foi enviada.{" "}
              {intendedPartnerName
                ? `O parceiro ${intendedPartnerName}`
                : "Os nossos parceiros locais"}{" "}
              em breve entrarão em contato via WhatsApp com uma proposta.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-full bg-pp-orange py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover hover:shadow-lg hover:shadow-pp-orange/20"
            >
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="section-label mb-2 text-pp-teal-soft">Quase lá</p>
              <h3 id={titleId} className="text-2xl font-bold text-white">
                {intendedPartnerName
                  ? `Enviar para ${intendedPartnerName}`
                  : "Enviar sua demanda"}
              </h3>
              <p className="mt-2 text-sm text-white/50">
                Preencha seu contato para receber propostas detalhadas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="modal-request"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
                >
                  O que você precisa?
                </label>
                <textarea
                  id="modal-request"
                  ref={firstInputRef}
                  required
                  rows={2}
                  className="w-full rounded-[1rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-white outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                  placeholder="Descreva o produto ou serviço"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="modal-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
                >
                  Seu Nome
                </label>
                <input
                  id="modal-name"
                  required
                  type="text"
                  autoComplete="name"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                  placeholder="Como devemos lhe chamar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="modal-whatsapp"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
                >
                  WhatsApp
                </label>
                <input
                  id="modal-whatsapp"
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                  placeholder="(00) 00000-0000"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                />
              </div>

              {status === "error" && (
                <p role="alert" className="mt-2 text-xs text-red-400">
                  Ocorreu um erro ao enviar. Tente novamente mais tarde.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 w-full rounded-full bg-pp-orange py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover hover:shadow-lg hover:shadow-pp-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "submitting"
                  ? "Enviando..."
                  : intendedPartnerName
                    ? "Enviar a este parceiro"
                    : "Receber propostas"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
