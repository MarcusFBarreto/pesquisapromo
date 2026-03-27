import Link from "next/link";
import { notFound } from "next/navigation";
import { VerifiedDiscountBadge } from "@/components/verified-discount-badge";
import {
  formatCurrency,
  getOffer,
  getOffersByShop,
  getShop,
  getVerificationMeta,
} from "@/lib/city-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ShopPage({ params }: PageProps) {
  const { slug } = await params;
  const shop = getShop(slug);

  if (!shop) {
    notFound();
  }

  const featuredOffer = shop.featuredOfferId ? getOffer(shop.featuredOfferId) : undefined;
  const offers = getOffersByShop(shop.slug);
  const verification = getVerificationMeta(shop.verification);

  return (
    <main className="min-h-screen bg-[var(--city-bg)] px-6 py-8 text-[var(--city-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="sticky top-4 z-20">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--city-line)] bg-white/92 p-4 shadow-[0_18px_50px_rgba(14,29,63,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-[var(--city-blue)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                Lojinha
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]">
                {shop.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${shop.areaKind}/${shop.areaSlug}`}
                className="inline-flex rounded-full border border-[var(--city-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]"
              >
                Voltar para a area
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

        <header className="grid gap-6 rounded-[2.2rem] border border-[var(--city-line)] bg-white p-7 shadow-[0_30px_90px_rgba(14,29,63,0.08)] lg:grid-cols-[1fr_0.95fr] lg:p-9">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-blue)]">
              {shop.style === "comparative"
                ? "Comparacao com contexto"
                : shop.style === "spotlight"
                  ? "Destaque da vez"
                  : shop.style === "utility"
                    ? "Servico util e oficial"
                    : "Vitrine clara"}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              {shop.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--city-muted)]">{shop.detail}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${verification.className}`}>
                {verification.label}
              </span>
              <span className="rounded-full border border-[var(--city-line)] bg-[var(--city-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--city-muted)]">
                {shop.address}
              </span>
            </div>
          </div>

          {featuredOffer ? (
            <div className="rounded-[1.8rem] bg-[var(--city-soft)] p-5">
              <VerifiedDiscountBadge discount={featuredOffer.discount} />
              <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{featuredOffer.title}</p>
              <p className="mt-2 text-sm text-[var(--city-muted)]">{featuredOffer.storeName}</p>
              <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
                {formatCurrency(featuredOffer.currentPrice)}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">{featuredOffer.discount.detail}</p>
            </div>
          ) : (
            <div className="rounded-[1.8rem] bg-[var(--city-soft)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--city-blue)]">
                Fonte principal
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{shop.sourceLabel}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">{verification.detail}</p>
              <a
                href={shop.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-[var(--city-blue)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
              >
                Abrir fonte
              </a>
            </div>
          )}
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_20px_60px_rgba(14,29,63,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-orange)]">
              {offers.length > 0 ? "Leitura da oferta" : "Leitura do servico"}
            </p>

            {offers.length === 0 ? (
              <div className="mt-5 grid gap-4">
                {shop.serviceHighlights?.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5"
                  >
                    <p className="text-xl font-semibold">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            ) : shop.slug === "comparador-de-geladeiras" ? (
              <div className="mt-5 grid gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="rounded-[1.5rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-semibold">{offer.title}</p>
                        <p className="mt-1 text-sm text-[var(--city-muted)]">{offer.storeName} · nota {offer.rating.toFixed(1)}</p>
                      </div>
                      <VerifiedDiscountBadge discount={offer.discount} />
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-[1.2rem] bg-white px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]">Preco atual</p>
                        <p className="mt-2 text-2xl font-semibold">{formatCurrency(offer.currentPrice)}</p>
                      </div>
                      <div className="rounded-[1.2rem] bg-white px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]">Historico</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--city-muted)]">{offer.previousLabel}</p>
                      </div>
                      <div className="rounded-[1.2rem] bg-white px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]">Leitura</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--city-muted)]">{offer.discount.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                {offers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className={`rounded-[1.6rem] border border-[var(--city-line)] p-5 ${
                      index === 0 && shop.style === "spotlight"
                        ? "bg-[linear-gradient(135deg,rgba(239,169,74,0.22),rgba(255,255,255,0.96))]"
                        : "bg-[var(--city-soft)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-semibold tracking-[-0.03em]">{offer.title}</p>
                        <p className="mt-1 text-sm text-[var(--city-muted)]">{offer.storeName}</p>
                      </div>
                      <VerifiedDiscountBadge discount={offer.discount} />
                    </div>
                    <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{formatCurrency(offer.currentPrice)}</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">{offer.note}</p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_20px_60px_rgba(14,29,63,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-blue)]">
              O que esta sendo valorizado aqui
            </p>
            <div className="mt-5 grid gap-3">
              {offers.length > 0 ? (
                <div className="rounded-[1.3rem] bg-[var(--city-soft)] p-4">
                  <p className="text-sm font-semibold text-[var(--city-ink)]">Baseado no historico desta loja</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                    O selo de desconto verificado so aparece quando a queda e real dentro desta mesma vitrine.
                  </p>
                </div>
              ) : null}
              <div className="rounded-[1.3rem] bg-[var(--city-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">
                  {offers.length > 0 ? "Queda real acima do ruido" : "Fonte e confianca"}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  {offers.length > 0
                    ? "Bons precos existem. Queda comprovada e outra conversa. O prototipo tenta separar as duas coisas."
                    : verification.detail}
                </p>
              </div>
              <div className="rounded-[1.3rem] bg-[var(--city-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">
                  {offers.length > 0 ? "Menor preco recente nesta loja" : "Origem publica"}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  {offers.length > 0
                    ? "Quando o valor bate o piso recente da propria loja, a confianca cresce."
                    : shop.sourceLabel}
                </p>
              </div>
              {shop.contact ? (
                <div className="rounded-[1.3rem] bg-[var(--city-soft)] p-4">
                  <p className="text-sm font-semibold text-[var(--city-ink)]">Contato encontrado</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">{shop.contact}</p>
                </div>
              ) : null}
              <a
                href={shop.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-[var(--city-line)] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]"
              >
                Ver fonte publica
              </a>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
