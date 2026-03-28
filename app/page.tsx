import Link from "next/link";
import { districts, featuredDeals } from "@/lib/exploration-data";

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
  { label: "Parceiros", value: "10+" },
  { label: "Cidade piloto", value: "Horizonte/CE" },
  { label: "Ofertas verificadas", value: "Sim" },
] as const;

export default function Home() {
  const visibleDistricts = districts.filter((d) => d.slug !== "testes");

  return (
    <main className="min-h-screen">
      {/* ─── NAVBAR ─── */}
      <nav className="animate-fade-in sticky top-0 z-50 border-b border-white/[0.06] bg-pp-dark backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Pesquisa<span className="text-pp-orange">Promo</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/busca"
              className="text-sm font-medium text-white/60 transition hover:text-white"
            >
              Buscar
            </Link>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-white/60 transition hover:text-white"
            >
              Como funciona
            </a>
            <a
              href="#explorar"
              className="text-sm font-medium text-white/60 transition hover:text-white"
            >
              Explorar
            </a>
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

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-10">
          {/* Left: Copy + Form */}
          <div className="animate-fade-in-up flex flex-col justify-center">
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

            {/* Demand capture form */}
            <div className="mt-8 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
              <label className="section-label text-white/40">
                O que você está precisando?
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="demand-input"
                  className="h-14 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-6 text-base text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-4 focus:ring-pp-teal/20"
                  placeholder="Ex.: cimento 50 sacos, conserto de ar-condicionado, orçamento de pintura..."
                />
                <button
                  id="demand-submit"
                  className="h-14 shrink-0 rounded-full bg-pp-orange px-8 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover hover:shadow-lg hover:shadow-pp-orange/20 active:scale-[0.98]"
                >
                  Receber propostas
                </button>
              </div>
              <p className="mt-3 text-xs leading-6 text-white/30">
                Gratuito. Seus dados ficam com você. Parceiros respondem direto.
              </p>
            </div>
          </div>

          {/* Right: Trust card + numbers */}
          <div className="animate-fade-in-up delay-2 flex flex-col gap-5">
            {/* Trust card */}
            <div className="glass-card rounded-[1.75rem] p-6">
              <p className="section-label text-pp-teal-soft">
                Por que usar
              </p>
              <div className="mt-4 grid gap-4">
                {trustSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="flex items-center justify-between rounded-[1.25rem] bg-white/[0.05] px-4 py-3"
                  >
                    <span className="text-sm text-white/50">
                      {signal.label}
                    </span>
                    <span className="text-base font-semibold text-white">
                      {signal.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick trust line */}
            <div className="glass-card flex items-start gap-4 rounded-[1.75rem] p-5">
              <div className="pulse-dot mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white/80">
                  Piloto ativo em Horizonte, Ceará
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Parceiros reais já estão recebendo demandas e respondendo com
                  propostas verificáveis.
                </p>
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
          <div className="animate-fade-in-up text-center">
            <p className="section-label text-pp-teal">Como funciona</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-pp-ink sm:text-4xl">
              Simples, direto e sem intermediário.
            </h2>
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

      {/* ─── EXPLORAR A CIDADE (Bridge CTA) ─── */}
      <section id="explorar" className="bg-pp-cream py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="animate-fade-in-up rounded-[1.75rem] bg-pp-dark p-8 text-center md:p-12">
            <p className="section-label text-pp-teal-soft">
              Enquanto espera
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Que tal ver o que está rolando na cidade?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/50">
              Temos promoções reais e verificadas de parceiros em{" "}
              <strong className="text-pp-orange">Horizonte/CE</strong>.
              Passeie pelas ruas, visite vitrines e descubra oportunidades.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleDistricts.map((district, index) => (
              <Link
                href={`/${district.type}/${district.slug}`}
                key={district.slug}
                className={`animate-fade-in-up delay-${index + 1} group rounded-[1.75rem] border border-pp-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="section-label text-pp-teal">
                    {district.type === "ruas" ? "Rua" : "Avenida"}
                  </span>
                  <span className="text-xs font-medium text-pp-muted">
                    {district.count}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug text-pp-ink group-hover:text-pp-teal transition">
                  {district.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-pp-muted">
                  {district.subtitle}
                </p>

                {/* Mini bar decoration */}
                <div className="mt-5 flex items-end gap-1.5">
                  <div className="h-6 w-3 rounded-t-md bg-pp-teal/15" />
                  <div className="h-10 w-4 rounded-t-md bg-pp-teal/25" />
                  <div className="h-8 w-3 rounded-t-md bg-pp-orange/20" />
                  <div className="h-12 w-4 rounded-t-md bg-pp-teal/40" />
                  <div className="h-5 w-3 rounded-t-md bg-pp-teal/15" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMOÇÕES VERIFICADAS ─── */}
      <section className="border-t border-pp-line bg-pp-surface py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="animate-fade-in-up flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label text-pp-orange">
                Promoções verificadas
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-pp-ink sm:text-3xl">
                Preço de verdade, não etiqueta chamativa.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-pp-muted">
              Aqui, promoção boa tem contexto. A gente olha o histórico da
              própria loja para separar queda real de falsa queima.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredDeals.map((deal, index) => (
              <article
                key={deal.item}
                className={`animate-fade-in-up delay-${index + 1} group rounded-[1.75rem] border border-pp-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="mb-4 inline-flex rounded-full bg-pp-orange/10 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-pp-orange">
                    {deal.note}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug text-pp-ink">
                  {deal.item}
                </h3>
                <p className="mt-1 text-sm text-pp-muted">
                  {deal.store}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-2xl font-bold text-pp-dark">
                    {deal.price}
                  </span>
                  <button className="rounded-full border border-pp-dark px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-pp-dark transition hover:bg-pp-dark hover:text-white">
                    Ver oferta
                  </button>
                </div>
              </article>
            ))}
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

          <div className="mt-6 flex justify-center gap-6">
            <Link
              href="/busca"
              className="text-xs font-medium text-white/40 transition hover:text-white/70"
            >
              Buscar
            </Link>
            <a
              href="#como-funciona"
              className="text-xs font-medium text-white/40 transition hover:text-white/70"
            >
              Como funciona
            </a>
            <a
              href="#explorar"
              className="text-xs font-medium text-white/40 transition hover:text-white/70"
            >
              Explorar
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
