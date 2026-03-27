import Link from "next/link";
import {
  formatCurrency,
  getVerificationMeta,
  getOffersByArea,
  getShop,
  getShopsByArea,
  type Area,
} from "@/lib/city-data";
import { VerifiedDiscountBadge } from "@/components/verified-discount-badge";

export function AreaView({ area }: { area: Area }) {
  const shops = getShopsByArea(area.slug);
  const offers = getOffersByArea(area.slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-[var(--city-bg)] px-6 py-8 text-[var(--city-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="sticky top-4 z-20">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--city-line)] bg-white/92 p-4 shadow-[0_18px_50px_rgba(14,29,63,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-[var(--city-blue)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                {area.kind.slice(0, -1)}
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]">
                {area.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex rounded-full border border-[var(--city-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]"
              >
                Voltar ao portal
              </Link>
              <Link
                href="/taxi-virtual"
                className="inline-flex rounded-full bg-[var(--city-blue)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                Chamar taxi
              </Link>
            </div>
          </div>
        </div>

        <header className="grid gap-5 rounded-[2.2rem] border border-[var(--city-line)] bg-white p-7 shadow-[0_30px_90px_rgba(14,29,63,0.08)] lg:grid-cols-[1.1fr_0.9fr] lg:p-9">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-blue)]">
              {area.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              {area.name}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--city-muted)]">
              {area.description}
            </p>
          </div>

          <div className="rounded-[1.8rem] bg-[var(--city-soft)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-orange)]">
              Clima da area
            </p>
            <p className="mt-3 text-base leading-8 text-[var(--city-muted)]">{area.mood}</p>
            <div className="mt-5 rounded-[1.4rem] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--city-ink)]">{area.subtitle}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_20px_60px_rgba(14,29,63,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-blue)]">
              Lojinhas desta area
            </p>
            <div className="mt-5 grid gap-4">
              {shops.map((shop) => (
                <Link
                  key={shop.slug}
                  href={shop.route}
                  className="rounded-[1.5rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_36px_rgba(14,29,63,0.06)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-xl font-semibold tracking-[-0.03em]">{shop.name}</p>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        getVerificationMeta(shop.verification).className
                      }`}
                    >
                      {getVerificationMeta(shop.verification).label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">{shop.summary}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--city-muted)]">
                    {shop.address}
                  </p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_20px_60px_rgba(14,29,63,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-blue)]">
              Ofertas em foco
            </p>
            <div className="mt-5 grid gap-4">
              {offers.map((offer) => (
                <div key={offer.id} className="rounded-[1.5rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold tracking-[-0.03em]">{offer.title}</p>
                      <p className="mt-1 text-sm text-[var(--city-muted)]">
                        {getShop(offer.shopSlug)?.name} · {offer.storeName}
                      </p>
                    </div>
                    <VerifiedDiscountBadge discount={offer.discount} />
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{formatCurrency(offer.currentPrice)}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">{offer.discount.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
