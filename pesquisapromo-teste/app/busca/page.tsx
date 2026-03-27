import Link from "next/link";
import { getVerificationMeta, searchCity } from "@/lib/city-data";
import { VerifiedDiscountBadge } from "@/components/verified-discount-badge";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const result = searchCity(q);

  return (
    <main className="min-h-screen bg-[var(--city-bg)] px-6 py-8 text-[var(--city-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_20px_70px_rgba(14,29,63,0.08)] md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-blue)]">
            Busca da cidade
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {q ? `Resultados para "${q}"` : "Comece por um termo"}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--city-muted)]">
            A busca tenta sugerir a melhor rua, a melhor lojinha e as ofertas com contexto.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex rounded-full border border-[var(--city-line)] bg-[var(--city-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]">
              Voltar ao portal
            </Link>
            <Link href="/taxi-virtual" className="inline-flex rounded-full bg-[var(--city-blue)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Ir para o taxi
            </Link>
          </div>
        </header>

        {result.bestRoute ? (
          <section className="rounded-[2rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-orange)]">
              Melhor caminho sugerido
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-2xl font-semibold tracking-[-0.04em]">{result.bestRoute.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">{result.bestRoute.subtitle}</p>
              </div>
              <Link href={result.bestRoute.route} className="inline-flex rounded-full bg-[var(--city-blue)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Seguir este caminho
              </Link>
            </div>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-5 shadow-[0_16px_44px_rgba(14,29,63,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-blue)]">
              Areas
            </p>
            <div className="mt-4 grid gap-3">
              {result.areaMatches.map((area) => (
                <Link key={area.slug} href={area.route} className="rounded-[1.3rem] bg-[var(--city-soft)] px-4 py-3">
                  <p className="font-semibold">{area.name}</p>
                  <p className="mt-1 text-sm text-[var(--city-muted)]">{area.subtitle}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-5 shadow-[0_16px_44px_rgba(14,29,63,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-blue)]">
              Lojinhas
            </p>
            <div className="mt-4 grid gap-3">
              {result.shopMatches.map((shop) => (
                <Link key={shop.slug} href={shop.route} className="rounded-[1.3rem] bg-[var(--city-soft)] px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-semibold">{shop.name}</p>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${getVerificationMeta(shop.verification).className}`}>
                      {getVerificationMeta(shop.verification).label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--city-muted)]">{shop.summary}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--city-muted)]">{shop.address}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-5 shadow-[0_16px_44px_rgba(14,29,63,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-blue)]">
              Ofertas
            </p>
            <div className="mt-4 grid gap-3">
              {result.offerMatches.map((offer) => (
                <Link key={offer.id} href={`/lojas/${offer.shopSlug}`} className="rounded-[1.3rem] bg-[var(--city-soft)] px-4 py-3">
                  <VerifiedDiscountBadge discount={offer.discount} />
                  <p className="mt-3 font-semibold">{offer.title}</p>
                  <p className="mt-1 text-sm text-[var(--city-muted)]">{offer.discount.detail}</p>
                </Link>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
