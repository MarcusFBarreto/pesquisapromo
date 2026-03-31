"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { DemandForm } from "@/components/ui/demand-form";
import { DemandChat } from "@/components/ui/demand-chat";
import { getPartnerBySlug } from "@/lib/partner-data";
import { ClipboardCheck, ArrowLeft } from "lucide-react";

function SolicitarContent() {
  const searchParams = useSearchParams();
  const demand = searchParams.get("q") || "";
  const partnerSlug = searchParams.get("parceiro") || null;

  const partner = partnerSlug ? getPartnerBySlug(partnerSlug) : null;

  const [suggestedDetails, setSuggestedDetails] = useState("");

  return (
    <main className="min-h-screen bg-white">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2 sm:gap-4 shrink-0 whitespace-nowrap">
            {/* Logo Solar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-emerald-500 bg-white shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            
            {/* Marca e Badge como SIBLINGS (Lado a Lado sempre) */}
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none shrink-0">
              Pesquisa<span className="text-pp-orange">Promo</span>
            </span>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-50/50 px-1.5 py-0.5 border border-slate-100 shrink-0">
              <div className="h-1 w-1 rounded-full bg-emerald-400" />
              <span className="text-[8px] font-black uppercase tracking-[0.05em] text-slate-400">
                Piloto: Horizonte, CE
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="group flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 transition-all hover:border-slate-900 hover:bg-slate-50 active:scale-95 shadow-sm bg-white sm:h-auto sm:px-5 sm:py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
        </div>
      </nav>

      {/* ─── PAGE HEADER ─── */}
      <section className="border-b border-slate-100 bg-slate-50/50 px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm transition-transform hover:scale-105">
              <ClipboardCheck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
                {partner ? `Solicitar para ${partner.name}` : "Nova solicitação"}
              </h1>
              <p className="text-base text-slate-500 font-light mt-1 mobile-text-anchor">
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
      <section className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* Background Decorativo */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-slate-50/50 to-transparent -z-10" />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT: Form */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50 glass-container-mobile sm:shadow-2xl">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">
                  <span className="text-xs">1</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-900 mobile-text-anchor">Seu pedido</p>
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
            <div className="flex h-[500px] flex-col rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/30 lg:h-[650px] sticky top-24 overflow-hidden glass-container-mobile sm:bg-white sm:shadow-xl">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mobile-text-anchor">Assistente PesquisaPromo</p>
              </div>
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
