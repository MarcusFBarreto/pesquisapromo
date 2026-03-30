"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { DemandForm } from "@/components/ui/demand-form";
import { DemandChat } from "@/components/ui/demand-chat";
import { getPartnerBySlug } from "@/lib/partner-data";

function SolicitarContent() {
  const searchParams = useSearchParams();
  const demand = searchParams.get("q") || "";
  const partnerSlug = searchParams.get("parceiro") || null;

  const partner = partnerSlug ? getPartnerBySlug(partnerSlug) : null;

  const [suggestedDetails, setSuggestedDetails] = useState("");

  return (
    <main className="min-h-screen bg-pp-dark">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-pp-dark backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="text-lg font-semibold tracking-tight text-white">
                Pesquisa<span className="text-pp-orange">Promo</span>
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 border border-white/20">
                <div className="h-1.5 w-1.5 rounded-full bg-white opacity-80" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                  Piloto: Horizonte, CE
                </span>
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition hover:border-white/30 hover:text-white"
          >
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* ─── PAGE HEADER ─── */}
      <section className="border-b border-white/[0.06] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">📋</span>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {partner ? `Solicitar para ${partner.name}` : "Nova solicitação"}
              </h1>
              <p className="text-sm text-white/40">
                {partner
                  ? `${partner.category} · ${partner.city}/${partner.region}`
                  : "Descreva o que precisa e receba propostas de parceiros locais"
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SPLIT LAYOUT ─── */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT: Form */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pp-orange/20">
                  <span className="text-xs">📋</span>
                </div>
                <p className="text-sm font-semibold text-white/70">Seu pedido</p>
              </div>

              <DemandForm
                initialDemand={demand}
                partnerSlug={partnerSlug}
                partnerName={partner?.name ?? null}
                suggestedDetails={suggestedDetails}
              />
            </div>
          </div>

          {/* RIGHT: Chat */}
          <div className="animate-fade-in-up delay-1 order-1 lg:order-2">
            <div className="flex h-[500px] flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] lg:h-[600px]">
              <DemandChat
                demand={demand}
                partnerName={partner?.name ?? null}
                onSuggestDetail={setSuggestedDetails}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SolicitarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-pp-dark">
          <p className="text-white/40">Carregando...</p>
        </div>
      }
    >
      <SolicitarContent />
    </Suspense>
  );
}
