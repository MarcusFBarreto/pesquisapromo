import Link from "next/link";
import { getFeaturedPartners } from "@/lib/partner-data";
import { HeroDemandForm } from "@/components/ui/hero-demand-form";
import { MerchantCTA } from "@/components/ui/merchant-cta";

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
  { icon: "🤝", text: "Parceiros locais REALMENTE interessados em atender você." },
  { icon: "⚡", text: "Excelente para cotações rápidas e comparativas." },
  { icon: "🔍", text: "Não está encontrando algo? Consulte nossa rede de parceiros — eles têm de um tudo." },
] as const;

export default function Home() {

  return (
    <main className="min-h-screen">
      {/* ─── NAVBAR ─── */}
      <nav className="animate-fade-in sticky top-0 z-50 border-b border-white/[0.06] bg-pp-dark backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="text-lg font-semibold tracking-tight text-white">
                Pesquisa<span className="text-pp-orange">Promo</span>
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-pp-teal/10 px-2 py-0.5 border border-pp-teal/20">
                <div className="pulse-dot h-1.5 w-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-pp-teal-soft">
                  Piloto: Horizonte, CE
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#parceiros"
              className="text-sm font-medium text-white/60 transition hover:text-white"
            >
              Parceiros
            </a>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-white/60 transition hover:text-white"
            >
              Como funciona
            </a>
            <div className="flex items-center gap-4">
              <Link
                href="/parceiro/login"
                className="text-xs font-semibold text-white/30 transition hover:text-white/60"
              >
                Acesso Parceiro
              </Link>
              <span className="text-white/10">|</span>
              <Link
                href="/parceiro/fornecer"
                className="text-[10px] font-medium text-white/20 transition hover:text-white/40"
              >
                Quer fornecer?
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO: CAPTURA DE DEMANDA ─── */}
      <section className="relative overflow-hidden bg-pp-dark pb-20 pt-16 lg:pb-28 lg:pt-24">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-pp-teal opacity-[0.07] blur-[120px]" />
          <div className="absolute -left-24 bottom-0 h-[400px] w-[400px] rounded-full bg-pp-orange opacity-[0.05] blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-10 lg:items-end">
          {/* Left: Copy + Form */}
          <div className="animate-fade-in-up flex flex-col">
            <div>
              <p className="section-label mb-5 text-pp-teal-soft">
                Lojas virtuais, promoções reais
              </p>

              <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
                Precisa de algo?{" "}
                <span className="text-pp-orange">
                  Diga e receba propostas.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-white/55 sm:text-lg">
                Descreva o que você precisa — produto, serviço ou orçamento — e
                parceiros da sua região respondem com propostas reais. Sem
                intermediário, sem enrolação.
              </p>
            </div>

            {/* Demand capture form */}
            <div className="mt-8 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
              <label className="section-label text-white/40">
                O que você está precisando?
              </label>
              <HeroDemandForm />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 text-xs">
                <a href="#compradores" className="group flex items-center gap-1.5 text-white/50 transition hover:text-white">
                  <span aria-hidden="true" className="opacity-70 group-hover:opacity-100">🕵️‍♂️</span>
                  <span>Busca algo mais específico? <strong>Conte com nossa equipe</strong></span>
                </a>
                <span className="hidden text-white/20 sm:block">•</span>
                <Link href="/solicitar" className="group flex items-center gap-1.5 text-pp-orange/80 transition hover:text-pp-orange">
                  <span aria-hidden="true" className="opacity-70 group-hover:opacity-100">⚡</span>
                  <span>Tô com pressa, <strong>vamos nessa!</strong></span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Trust card + numbers */}
          <div className="animate-fade-in-up delay-2 flex flex-col gap-5">
            {/* Trust card */}
            <div className="glass-card rounded-[1.75rem] p-6">
              <p className="section-label text-pp-teal-soft">
                Por que usar
              </p>
              <div className="mt-4 grid gap-3">
                {trustSignals.map((signal) => (
                  <div
                    key={signal.text}
                    className="flex items-start gap-3 rounded-[1.25rem] bg-white/[0.05] p-4 transition-colors hover:bg-white/[0.08]"
                  >
                    <span className="shrink-0 text-xl leading-none">{signal.icon}</span>
                    <p className="text-sm font-medium leading-relaxed text-white/80">
                      {signal.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Merchant CTA (Relocated here) */}
            <div className="glass-card rounded-[1.75rem] border border-pp-teal/20 p-6 transition-all hover:bg-white/[0.06]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pp-teal/10 text-2xl">🏢</span>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">Vende em Horizonte? <br/><span className="text-pp-teal-soft">Receba orçamentos.</span></p>
                    <p className="mt-1 text-[10px] text-white/30 uppercase tracking-widest font-bold">Junte-se à nossa rede verificada</p>
                  </div>
                </div>
                <Link 
                  href="/parceiro/fornecer"
                  className="group flex items-center justify-between rounded-xl bg-pp-teal px-5 py-3 text-xs font-bold text-white transition-all hover:bg-pp-teal-hover shadow-lg shadow-pp-teal/20"
                >
                  Ver como participar
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section
        id="como-funciona"
        className="border-b border-pp-line bg-pp-surface py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="animate-fade-in-up flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col">
              <span className="text-4xl" aria-hidden="true">
                🎯
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-pp-ink sm:text-3xl lg:text-4xl">
                Simples, direto e sem intermediário.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-pp-muted">
              Você diz o que precisa, nossos parceiros locais recebem
              sua solicitação e as propostas chegam no seu WhatsApp.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
            {howItWorks.map((item, index) => (
              <article
                key={item.step}
                className={`animate-fade-in-up delay-${index + 1} group rounded-[1.75rem] border border-pp-line bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-pp-dark text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-pp-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-pp-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARCEIROS EM DESTAQUE ─── */}
      <section id="parceiros" className="relative overflow-hidden bg-pp-dark py-20 lg:py-24">
        {/* Ambient glow matching the Hero */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pp-teal/5 via-pp-dark to-pp-dark" />
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pp-teal to-pp-orange opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="animate-fade-in-up flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col">
              <span className="text-4xl" aria-hidden="true">
                🤝
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
                Conheça quem atende na sua região.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/50">
              Nossos parceiros são verificados por nós. Eles recebem
              suas demandas e respondem com propostas reais.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {getFeaturedPartners().map((partner, index) => (
              <Link
                href={`/parceiros/${partner.slug}`}
                key={partner.slug}
                className={`animate-fade-in-up delay-${index + 1} group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/20`}
              >
                <div className="mb-3 inline-flex rounded-full bg-pp-orange/15 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-pp-orange">
                    {partner.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold leading-snug text-white">
                  {partner.name}
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  {partner.tagline}
                </p>

                <div className="mt-4 space-y-1.5">
                  {partner.services.slice(0, 3).map((service) => (
                    <div key={service} className="flex items-center gap-2">
                      <div className="h-1 w-1 shrink-0 rounded-full bg-pp-teal/40" />
                      <span className="text-xs text-white/40 truncate">{service}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    {partner.city}/{partner.region}
                  </span>
                  <span className="rounded-full bg-pp-orange px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition group-hover:bg-pp-orange-hover group-hover:shadow-lg group-hover:shadow-pp-orange/20">
                    Conhecer
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/parceiros"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <span>Ver todos os parceiros</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COMPRADORES PARCEIROS ─── */}
      <section id="compradores" className="bg-pp-cream py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-pp-dark px-6 py-16 text-center sm:px-16 sm:py-24">
            {/* Ambient glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pp-teal/20 via-pp-dark to-pp-dark" />
            
            <span className="text-5xl" aria-hidden="true">🕵️‍♂️</span>
            <h2 className="mt-6 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Não achou o que procurava?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Se o item for muito específico ou difícil de achar, não se preocupe. Você pode solicitar ajuda da nossa <strong className="text-white">Equipe de Apoio para Buscas</strong> — você continua no controle para decidir, mas recebe um suporte valioso para encontrar o que precisa.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://wa.me/558199999999?text=Olá! Não encontrei o que procurava no PesquisaPromo, podem me ajudar a achar?"
                target="_blank"
                rel="noreferrer"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-pp-orange px-8 py-4 text-sm font-bold tracking-tight text-white shadow-lg shadow-pp-orange/20 transition-all hover:scale-105 hover:bg-pp-orange-hover active:scale-95 sm:w-auto"
              >
                Pedir ajuda da equipe
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
            <p className="mt-6 text-xs text-white/40">
              * Diga o que precisa direto no nosso WhatsApp de suporte.
            </p>
          </div>
        </div>
      </section>


      {/* ─── FOOTER ─── */}
      <footer className="bg-pp-dark py-14">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2">
            <div className="pulse-dot" />
            <span className="text-xs font-medium text-white/60">
              Cidade piloto ativa — Horizonte, Ceará
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-pp-teal bg-pp-dark-surface">
              <div className="h-2 w-2 rounded-full bg-pp-orange" />
            </div>
            <p className="text-sm font-semibold text-white/80">
              Pesquisa<span className="text-pp-orange">Promo</span>
            </p>
          </div>

          <p className="mt-4 text-xs leading-6 text-white/30">
            Lojas virtuais, promoções reais. Pesquisa local de preços, pedidos
            de orçamento e ofertas com contexto.
          </p>

          <div className="mt-8 flex justify-center gap-8">
            <Link href="/busca" className="text-xs font-medium text-white/40 transition hover:text-white/70">Buscar Ofertas</Link>
            <a href="#como-funciona" className="text-xs font-medium text-white/40 transition hover:text-white/70">Como Funciona</a>
            <Link href="/parceiros" className="text-xs font-medium text-white/40 transition hover:text-white/70">Lojas Parceiras</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
