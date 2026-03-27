import Link from "next/link";
import { CityNavigator } from "@/components/city-navigator";
import { VerifiedDiscountBadge } from "@/components/verified-discount-badge";
import {
  areas,
  getOffer,
  getShop,
  getTopOffers,
  getVerificationMeta,
  shops,
} from "@/lib/city-data";

export default function Home() {
  const topOffers = getTopOffers(4);
  const flagshipOffer = getOffer("geladeira-brastemp");

  return (
    <main className="min-h-screen px-6 py-8 text-[var(--city-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-5 rounded-[2.2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(8,19,42,0.92),rgba(20,53,108,0.9))] p-6 text-white shadow-[0_40px_120px_rgba(14,29,63,0.28)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                PesquisaPromo Teste
              </p>
              <p className="mt-2 text-sm text-white/72">Lojas virtuais, promocoes reais.</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/48">
                Piloto local · Horizonte, Ceara
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/busca"
                className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Buscar
              </Link>
              <Link
                href="/taxi-virtual"
                className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--city-blue)]"
              >
                Taxi Virtual
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white md:text-7xl">
                Entre na cidade e veja o que realmente baixou.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                Um portal que separa duas vontades do usuario com clareza: passear
                pelas areas certas ou ir direto ao melhor caminho, sem perder o
                contexto da oferta.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
                <span className="rounded-full border border-white/14 bg-white/10 px-3 py-2">
                  Ecosistema misto
                </span>
                <span className="rounded-full border border-white/14 bg-white/10 px-3 py-2">
                  Fontes publicas + camadas verificaveis
                </span>
                <span className="rounded-full border border-white/14 bg-white/10 px-3 py-2">
                  Rua dos Servicos incluida
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <article className="rounded-[1.8rem] border border-white/14 bg-white/10 p-5 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/62">
                  Modo 1
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Explorar a cidade</p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Descobrir ruas, entrar em lojinhas e sentir o mapa fazer sentido.
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-white/14 bg-[rgba(239,169,74,0.18)] p-5 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/62">
                  Modo 2
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Ir direto</p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Buscar, chamar o taxi e chegar na area, na lojinha ou na oferta certa.
                </p>
              </article>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <CityNavigator
            label="Ir direto"
            title="Busque um item, uma lojinha ou uma rua"
            description="Geladeira leva para a Rua da Casa. Tenis encontra a Rua dos Calcados. Achado aponta a travessa certa. O portal ja nasce sabendo para onde voce provavelmente quer ir."
            placeholder="Ex.: geladeira, tenis, achado, promocoes, fone"
            submitLabel="Encontrar caminho"
            secondaryHref="/taxi-virtual"
            secondaryLabel="Chamar taxi"
          />

          {flagshipOffer ? (
            <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,29,63,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-orange)]">
                Pilar central
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Desconto verificado
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">
                Nem todo preco baixo merece hype. Aqui o selo aparece quando a queda
                faz sentido dentro do historico da propria loja.
              </p>
              <div className="mt-5 rounded-[1.7rem] bg-[var(--city-soft)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{flagshipOffer.title}</p>
                    <p className="mt-1 text-sm text-[var(--city-muted)]">
                      {getShop(flagshipOffer.shopSlug)?.name}
                    </p>
                  </div>
                  <VerifiedDiscountBadge discount={flagshipOffer.discount} />
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--city-muted)]">
                  {flagshipOffer.discount.detail}
                </p>
              </div>
            </article>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,29,63,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-blue)]">
              Explorar a cidade
            </p>
            <div className="mt-5 grid gap-4">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={area.route}
                  className="group rounded-[1.6rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_44px_rgba(14,29,63,0.07)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--city-blue)]">
                        {area.eyebrow}
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{area.name}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--city-orange)]">
                      {area.kind.slice(0, -1)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">{area.subtitle}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,29,63,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-blue)]">
              Destaques da cidade
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {topOffers.map((offer) => (
                <Link
                  key={offer.id}
                  href={getShop(offer.shopSlug)?.route ?? "/"}
                  className="rounded-[1.6rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_44px_rgba(14,29,63,0.07)]"
                >
                  <VerifiedDiscountBadge discount={offer.discount} />
                  <p className="mt-4 text-lg font-semibold leading-7">{offer.title}</p>
                  <p className="mt-2 text-sm text-[var(--city-muted)]">{offer.storeName}</p>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      maximumFractionDigits: offer.currentPrice % 1 === 0 ? 0 : 2,
                    }).format(offer.currentPrice)}
                  </p>
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,29,63,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-orange)]">
              Lojinhas em alta
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {shops.slice(0, 4).map((shop) => (
                <Link
                  key={shop.slug}
                  href={shop.route}
                  className="rounded-[1.6rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_44px_rgba(14,29,63,0.07)]"
                >
                  <p className="text-xl font-semibold tracking-[-0.04em]">{shop.name}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">{shop.summary}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--city-line)] bg-[linear-gradient(135deg,rgba(239,169,74,0.22),rgba(255,255,255,0.94))] p-6 shadow-[0_24px_80px_rgba(14,29,63,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-blue)]">
              Como isso se explica
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[1.4rem] bg-white/90 p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">1. Encontrar o contexto</p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  Primeiro a cidade te ajuda a saber onde vale a pena entrar.
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-white/90 p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">2. Ler a loja</p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  Cada lojinha nasce com uma intencao: comparar, destacar ou descobrir.
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-white/90 p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">3. Decidir com confianca</p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  O desconto verificado aparece quando a queda foi real dentro da propria loja.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,29,63,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-blue)]">
              Horizonte real dentro do laboratorio
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--city-muted)]">
              Este piloto ja mistura camadas diferentes: negocios encontrados em
              fontes publicas, lojas mais verificaveis e servicos oficiais do
              municipio para testar um ecossistema menos ficticio.
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[1.4rem] bg-[var(--city-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">Nao verificados</p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  Camada generica usada quando a cidade ainda esta ganhando corpo.
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[var(--city-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">Mais verificaveis</p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  Dados publicos com endereco, CNPJ, telefone ou fonte mais consistente.
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[var(--city-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--city-ink)]">Oficiais</p>
                <p className="mt-2 text-sm leading-7 text-[var(--city-muted)]">
                  Orgaos publicos e utilidades ancorados em paginas institucionais.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_24px_80px_rgba(14,29,63,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-orange)]">
              Lojinhas locais e status
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {shops.slice(0, 6).map((shop) => {
                const verification = getVerificationMeta(shop.verification);

                return (
                  <Link
                    key={shop.slug}
                    href={shop.route}
                    className="rounded-[1.5rem] border border-[var(--city-line)] bg-[var(--city-soft)] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_36px_rgba(14,29,63,0.06)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="text-lg font-semibold tracking-[-0.03em]">{shop.name}</p>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${verification.className}`}>
                        {verification.label}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--city-muted)]">{shop.summary}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--city-muted)]">
                      {shop.sourceLabel}
                    </p>
                  </Link>
                );
              })}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
