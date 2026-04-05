import Link from "next/link";
import { notFound } from "next/navigation";
import { districts, getTestShopBySlug } from "@/lib/exploration-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const verificationCopy = {
  oficial: {
    label: "Oficial",
    tone:
      "border-[rgba(25,76,160,0.18)] bg-[rgba(25,76,160,0.08)] text-[var(--pp-blue)]",
    detail:
      "Esta porta representa um serviço oficial ou um atalho público do ecossistema.",
  },
  "mais verificavel": {
    label: "Mais verificavel",
    tone:
      "border-[rgba(229,93,58,0.18)] bg-[rgba(229,93,58,0.1)] text-[var(--pp-orange)]",
    detail:
      "Encontramos sinais publicos mais consistentes, como endereco, eixo comercial ou fonte aberta.",
  },
  "nao verificado": {
    label: "Nao verificado",
    tone:
      "border-[var(--pp-line)] bg-[var(--pp-surface)] text-[var(--pp-muted)]",
    detail:
      "A vitrine existe como simulacao editorial e ainda nao tem sinais fortes de validacao.",
  },
} as const;

export async function generateStaticParams() {
  return districts.flatMap((district) =>
    district.shops
      .filter((shop) => shop.slug)
      .map((shop) => ({ slug: shop.slug as string })),
  );
}

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params;
  const result = getTestShopBySlug(slug);

  if (!result) {
    notFound();
  }

  const { district, shop } = result;
  const verificationKey = shop.verification ?? "nao verificado";
  const verification = verificationCopy[verificationKey];
  const infoBlocks =
    shop.services && shop.services.length > 0
      ? shop.services
      : [
          "Card de oferta com selo e CTA principal",
          "Mini vitrine com variacao de preco simulada",
          "Caixa de missao para testar gamificacao leve",
        ];

  return (
    <main className="min-h-screen bg-slate-50/30 px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="sticky top-4 z-50">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between glass-container-mobile sm:bg-white/92 sm:shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                Lojinha aberta
              </span>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 md:text-sm mobile-text-anchor">
                {shop.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/parceiros"
                className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-[9px] font-black uppercase tracking-widest text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
              >
                Ver todos os parceiros
              </Link>
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-[9px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-600 mobile-btn-soft-dark solar-shimmer-effect"
              >
                Sair da lojinha
              </Link>
            </div>
          </div>
        </div>

        <header className="grid gap-6 rounded-2xl border border-[var(--pp-line)] bg-white p-6 shadow-[0_20px_60px_rgba(16,37,74,0.05)] lg:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pp-orange mobile-text-anchor">
              {district.title}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              {shop.name}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-500 font-light mobile-text-anchor">
              {shop.vibe}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span
                className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${verification.tone}`}
              >
                {verification.label}
              </span>
              {shop.address ? (
                <span className="inline-flex rounded-full border border-[var(--pp-line)] bg-[var(--pp-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-muted)]">
                  {shop.address}
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.8rem] bg-slate-50/50 p-6 border border-slate-100 glass-container-mobile sm:bg-slate-50/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mobile-text-anchor">
              {shop.services?.length ? "Serviço em foco" : "Oferta em destaque"}
            </p>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
              {shop.offer}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 font-light mobile-text-anchor">
              {verification.detail}
            </p>

            {shop.contact ? (
              <p className="mt-4 text-sm leading-7 text-[var(--pp-muted)]">
                Contato encontrado: {shop.contact}
              </p>
            ) : null}

            {shop.sourceLabel ? (
              <p className="mt-3 text-sm leading-7 text-[var(--pp-muted)]">
                Fonte publica: {shop.sourceLabel}
              </p>
            ) : null}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
              {shop.services?.length ? "Atalhos desta porta" : "Area de testes"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              {shop.services?.length
                ? "Um ponto mais útil e direto dentro deste setor."
                : "Um canto seguro para experimentar."}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--pp-muted)]">
              {shop.services?.length
                ? "Aqui entram caminhos que resolvem, organizam e ajudam a pessoa a chegar mais rapido no que precisa."
                : "Este piloto pode receber novos cards, filtros, botões, selos e pequenas experiências sem atrapalhar o restante do ecossistema."}
            </p>

            <div className="mt-6 grid gap-3">
              {infoBlocks.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.3rem] bg-[var(--pp-surface)] px-4 py-4 text-sm leading-7 text-[var(--pp-muted)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-orange)]">
              Leitura da vitrine
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[1.3rem] bg-[var(--pp-surface)] p-4">
                <p className="text-sm font-semibold text-[var(--pp-ink)]">
                  Nivel atual
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--pp-muted)]">
                  {verification.detail}
                </p>
              </div>

              <div className="rounded-[1.3rem] bg-[var(--pp-surface)] p-4">
                <p className="text-sm font-semibold text-[var(--pp-ink)]">
                  Origem do Destaque
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--pp-muted)]">
                  {district.title}
                </p>
              </div>

              {shop.address ? (
                <div className="rounded-[1.3rem] bg-[var(--pp-surface)] p-4">
                  <p className="text-sm font-semibold text-[var(--pp-ink)]">
                    Endereco de referencia
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--pp-muted)]">
                    {shop.address}
                  </p>
                </div>
              ) : null}

              {shop.sourceLabel ? (
                <div className="rounded-[1.3rem] bg-[var(--pp-surface)] p-4">
                  <p className="text-sm font-semibold text-[var(--pp-ink)]">
                    Origem publica
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--pp-muted)]">
                    {shop.sourceLabel}
                  </p>
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
