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
            <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-emerald-700 subpixel-antialiased mb-4 sm:tracking-[0.4em]">
              Especialistas em encontrar o que você procura
            </p>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.5rem]">
              Compra difícil?<br />
              <span className="text-emerald-500 italic font-medium">
                myLupa resolve.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500 font-light mobile-text-anchor">
              Encontramos o difícil. Negociamos o caro. myLupar é poupar seu tempo. Informe o que precisa - simples assim.
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
        </div> {/* Final do Hero Grid */}

        {/* ─── BASE DE PATROCÍNIOS & TRUST SIGNALS DE PONTA A PONTA ─── */}
        <div className="w-full mt-24 border-t border-slate-100 pt-16 bg-slate-50/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 opacity-80 text-center">Quem myLupa as compras</h3>
            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 25s linear infinite;
              }
              .mask-fade {
                mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
              }
            `}} />
            <div className="relative flex overflow-hidden w-full mask-fade mb-10">
              <div className="animate-marquee flex gap-8 sm:gap-24 items-center whitespace-nowrap opacity-40 hover:opacity-100 transition-opacity">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">CONSTRUTORA ALFA</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">REFORMAS BEM-FEITAS</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">GRUPO ESTRUTURAL</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">PREFEITURA LOCAL</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">MÓVEIS PLANEJADOS</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">CONSTRUTORA ALFA</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">REFORMAS BEM-FEITAS</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">GRUPO ESTRUTURAL</span>
              </div>
            </div>

            <div className="border-t border-slate-200/80 pt-8 pb-12">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 opacity-80 text-center">Fornecedores Homologados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-emerald-100 grayscale hover:grayscale-0 transition-all hover:shadow-md cursor-default group">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">Logo</div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Cimento & Cia</p>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Patrocinador</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-emerald-100 grayscale hover:grayscale-0 transition-all hover:shadow-md cursor-default group">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">Logo</div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Elétrica Sul</p>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Patrocinador</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-emerald-100 grayscale hover:grayscale-0 transition-all hover:shadow-md cursor-default group">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">Logo</div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Madeireira João</p>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Patrocinador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA BANNER P/ PARCEIROS (DE PONTA A PONTA) ─── */}
        <div className="w-full border-t border-emerald-100 bg-emerald-50/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />

              <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 border border-emerald-200 shadow-sm transition-transform hover:scale-110">
                  <Store className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-slate-900">Bons fornecedores são <span className="text-emerald-600 italic font-medium">muito bem-vindos!</span></h3>
                  <p className="mt-2 text-[11px] text-emerald-700 uppercase tracking-[0.25em] font-bold subpixel-antialiased">3 passos e você já está dentro.</p>
                </div>
              </div>

              <div className="w-full md:w-auto relative z-10">
                <Link
                  href="/parceiro/fornecer"
                  className="group flex items-center justify-center gap-4 rounded-full bg-pp-orange px-10 py-5 text-[12px] font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-pp-orange-hover hover:scale-105 shadow-xl shadow-pp-orange/25 active:scale-95 w-full md:w-auto"
                >
                  Ver como participar
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>      </section>

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
