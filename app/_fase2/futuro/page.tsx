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

          {/* LEFT COLUMN: Share Panel (Equivalent to MerchantCTA) */}
          <div className="animate-fade-in-up delay-3 lg:row-start-3 lg:col-start-1 mt-8 hidden lg:block">
            <div className="h-full min-h-[360px] bg-white border border-slate-100 rounded-2xl p-10 transition-all hover:scale-[1.01] shadow-xl shadow-slate-500/5 overflow-hidden relative group">
              {/* Decorative element */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-500/5 blur-2xl group-hover:bg-slate-500/10 transition-colors" />

              <div className="flex flex-row gap-8 relative h-full">
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-5 text-slate-900">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-emerald-600 border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                        <Share2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black leading-tight text-slate-900">Gostou da ideia? <br /><span className="text-slate-400 italic font-medium">compartilhe o myLupa.</span></h3>
                        <p className="mt-2 text-[10px] text-emerald-600 uppercase tracking-[0.25em] font-black">Ecossistema em expansão</p>
                      </div>
                    </div>

                    <div className="mt-10">
                      <h4 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-[0.2em] opacity-30 italic">
                        + compradores <br /> + produtos <br /> + fornecedores
                      </h4>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link
                      href="/mypromos"
                      className="group flex items-center justify-between rounded-2xl bg-slate-900 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-600 shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                      myLupar oportunidades
                      <Tag className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Vertical Social Stack (Premium Highlight) */}
                <div className="flex flex-col justify-center gap-3 border-l border-slate-100 pl-8 shrink-0">
                  <a href="#" className="group/social p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm border border-transparent hover:border-emerald-100 active:scale-95" title="Instagram">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="group/social p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm border border-transparent hover:border-emerald-100 active:scale-95" title="X (Twitter)">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
                    </svg>
                  </a>
                  <a href="#" className="group/social p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm border border-transparent hover:border-emerald-100 active:scale-95" title="WhatsApp">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.301-.15-1.767-.872-2.04-.971s-.473-.15-.673.15-.771.971-.944 1.171-.345.225-.646.075c-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.676-2.083s-.019-.462.131-.611c.135-.134.301-.351.452-.526.15-.175.2-.3.301-.5s.05-.375-.025-.525-.673-1.62-.922-2.22c-.242-.584-.488-.504-.672-.513s-.377-.011-.577-.011-.527.075-.802.375c-.276.3-.3.3-.3.725s.326.85.376.925 1.1 1.767 2.667 2.443a9.6 9.6 0 001.077.4c.375.118.718.102.986.062.3-.044.872-.351 1.021-.692s.15-.633.105-.692-.175-.15-.476-.3zM12.193 0C5.458 0 0 5.458 0 12.193a12.1 12.1 0 001.667 6.136L.076 24l5.811-1.522a12.1 12.1 0 0018.113-10.285C24 5.458 18.542 0 12.193 0z" />
                    </svg>
                  </a>
                </div>
              </div>
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
                    <h3 className="text-xl font-black leading-tight text-slate-900">Vende aqui? <br /><span className="text-emerald-600 italic font-medium">Receba orçamentos.</span></h3>
                    <p className="mt-2 text-[10px] text-emerald-600 uppercase tracking-[0.25em] font-black">Inscrições Abertas</p>
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

      {/* ─── COMO FUNCIONA ─── */}
      <section
        id="como-funciona"
        className="border-b border-slate-100 bg-slate-50 py-16 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="animate-fade-in-up flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Simples, direto e sem intermediários.
              </h2>
            </div>
            <p className="max-w-sm text-lg leading-relaxed text-slate-500 font-light">
              Você diz o que precisa, nossos parceiros locais recebem
              sua solicitação e as propostas chegam no seu WhatsApp.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {howItWorks.map((item, index) => (
              <article
                key={item.step}
                className={`animate-fade-in-up delay-${index + 1} group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60`}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-500 font-light">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPRADORES PARCEIROS (Suporte VIP) ─── */}
      <section id="compradores" className="bg-white py-16 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="relative isolate overflow-hidden rounded-2xl bg-emerald-50/50 px-6 py-12 text-center sm:px-16 sm:py-32 border border-emerald-100 shadow-xl shadow-emerald-500/5">
            {/* Ambient glow sutil */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_70%)]" />

            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-xl shadow-emerald-500/10 border border-emerald-100/50 text-emerald-600">
              <LifeBuoy className="h-10 w-10 animate-spin-slow" />
            </div>

            <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Não achou o que procurava?
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-500 font-light">
              Se o item for muito específico ou difícil de achar, não se preocupe. Solicite ajuda da nossa <strong className="text-slate-900 font-bold">Equipe de Apoio</strong> — suporte humano para encontrar exatamente o que você precisa.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://wa.me/558599999999?text=Olá! Não encontrei o que procurava no myLupa, podem me ajudar?"
                target="_blank"
                rel="noreferrer"
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-pp-orange px-10 py-5 text-[10px] font-bold tracking-widest uppercase text-white shadow-xl shadow-pp-orange/20 transition-all hover:scale-105 hover:bg-pp-orange-hover active:scale-95 sm:w-auto"
              >
                Pedir suporte humano
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <p className="mt-8 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              * Atendimento direto via WhatsApp em nossa Região Piloto
            </p>
          </div>
        </div>
      </section>


      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-2.5 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Piloto Ativo — Fase de Testes
            </span>
          </div>

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

          <div className="mt-12 flex justify-center gap-10">
            <Link href="/balaio" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-600 transition-colors">Oportunidades</Link>
            <Link href="/mypromos" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-600 transition-colors">Vitrine (myPromos)</Link>
            <Link href="/parceiro/fornecer" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-600 transition-colors">Seja Parceiro</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
