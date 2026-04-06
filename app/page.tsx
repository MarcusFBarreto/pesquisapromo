import Link from "next/link";
import { HeroDemandForm } from "@/components/ui/hero-demand-form";
import {
  ChevronRight,
  PenLine,
  Sparkles,
  Users,
  Zap,
  Search,
  Store,
  Target,
  LifeBuoy,
  Share2,
  Tag
} from "lucide-react";

const howItWorks = [
  {
    step: "01",
    title: "Diga o que precisa",
    description:
      "Produto, serviço ou orçamento — descreva em poucas palavras e informe sua região.",
  },
  {
    step: "02",
    title: "Parceiros recebem",
    description:
      "Quem puder atender na sua região recebe sua demanda e prepara uma proposta.",
  },
  {
    step: "03",
    title: "Compare e escolha",
    description:
      "Receba propostas reais, compare com calma e decida sem pressa.",
  },
] as const;

const trustSignals = [
  { icon: <Users className="w-5 h-5 text-emerald-600" />, text: "Parceiros locais prontos para te atender." },
  { icon: <Zap className="w-5 h-5 text-amber-500" />, text: "Sem tempo de cotar? A gente faz por você." },
  { icon: <Search className="w-5 h-5 text-slate-400" />, text: "Item raro ou caro? Nós myLupamos." },
] as const;

import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";

export default function Home() {
  return (
    <main className="min-h-screen">
      <PesquisaPromoHeader />

      {/* ─── Hero Solar Compacto ─── */}
      <section className="relative overflow-hidden bg-white pb-12 pt-0 lg:pb-24 lg:pt-2">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-emerald-500 opacity-[0.03] blur-[120px]" />
          <div className="absolute -left-24 bottom-0 h-[500px] w-[500px] rounded-full bg-emerald-600 opacity-[0.02] blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-x-20 lg:px-10">
          {/* LEFT COLUMN: Section 1 (Headline + Para) */}
          <div className="animate-fade-in-up flex flex-col lg:row-start-1 lg:col-start-1">
            <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-emerald-600 mb-4 sm:tracking-[0.4em]">
              Especialistas em encontrar o que você procura
            </p>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.5rem]">
              Ajuda para compras?<br />
              <span className="text-emerald-500 italic font-medium">
                deixe myLupa resolver.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500 font-light mobile-text-anchor">
              Encontramos o difícil. Dispensamos o caro. myLupar é poupar seu tempo. Informe o que precisa - simples assim.
            </p>
          </div>

          {/* LEFT COLUMN: Section 2 (Form Card) */}
          <div className="animate-fade-in-up lg:row-start-2 lg:col-start-1 mt-8 lg:mt-10 self-end">
            <div className="rounded-2xl border border-emerald-100 bg-white p-10 shadow-[0_20px_50px_rgba(16,185,129,0.1)] relative transition-all hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)] group/card">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-pp-orange animate-pulse" />
                  <label className="text-[11px] uppercase font-black tracking-[0.2em] text-slate-900">
                    O que você está precisando?
                  </label>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover/card:scale-110 transition-transform">
                  <PenLine className="w-5 h-5" />
                </div>
              </div>

              <HeroDemandForm />
            </div>
          </div>



          {/* RIGHT COLUMN: Benefits list (Starts at top, ends at bottom of Form Card) */}
          <div className="animate-fade-in-up delay-2 lg:row-start-1 lg:row-span-2 lg:col-start-2">
            <div className="bg-white border border-emerald-100 rounded-2xl p-10 shadow-[0_20px_50px_rgba(16,185,129,0.08)] h-full flex flex-col transition-all hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)] group/benefits glass-container-mobile sm:bg-white sm:border-emerald-100">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-black tracking-[0.2em] uppercase text-slate-900">
                    Por que usar
                  </span>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-benefits-hover:rotate-12 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-10 grid gap-6 auto-rows-fr grow">
                {trustSignals.map((signal, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:scale-[1.02] sm:bg-white sm:border-slate-100"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50/50 border border-emerald-100/50 sm:bg-slate-50 sm:border-none">
                      {signal.icon}
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-slate-600 mobile-text-anchor">
                      {signal.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Partner CTA (Below the alignment line) */}
          <div className="animate-fade-in-up delay-3 lg:row-start-3 lg:col-start-2 mt-8">
            <div className="h-full min-h-[360px] bg-emerald-50/40 border border-emerald-100 rounded-2xl p-10 transition-all hover:scale-[1.01] shadow-xl shadow-emerald-500/5 overflow-hidden relative group glass-container-mobile">
              {/* Decorative element */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-colors" />

              <div className="flex flex-col justify-between h-full relative">
                <div className="flex items-center gap-5 text-slate-900">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 border border-emerald-200 shadow-sm transition-transform group-hover:scale-110">
                    <Store className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black leading-tight text-slate-900">Bons fornecedores são<br /><span className="text-emerald-600 italic font-medium">muito bem-vindos!</span></h3>
                    <p className="mt-2 text-[10px] text-emerald-600 uppercase tracking-[0.25em] font-black">Preencha um pequeno pré-cadastro</p>
                  </div>
                </div>

                <div className="mt-10 lg:mt-0">
                  <Link
                    href="/parceiro/fornecer"
                    className="group flex items-center justify-between rounded-3xl bg-pp-orange px-8 py-6 text-[12px] font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-pp-orange-hover shadow-2xl shadow-pp-orange/25 active:scale-95"
                  >
                    Ver como participar
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER FASE 1 ─── */}
      <footer className="bg-slate-50 py-12 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
              <div className="h-2 w-2 rounded-full bg-pp-orange" />
            </div>
            <p className="text-sm font-bold text-slate-900 tracking-tight">
              my<span className="text-pp-orange">Lupa</span>
            </p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-400 max-w-md mx-auto font-light">
            Encontramos o difícil. Negociamos o caro. Seu tempo vale mais.
          </p>

          <p className="mt-8 text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            Copyright © 2026 myLupa. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
