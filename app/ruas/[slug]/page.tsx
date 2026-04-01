import Link from "next/link";
import { notFound } from "next/navigation";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { districts, getDistrict, getDistrictsByType } from "@/lib/exploration-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getDistrictsByType("ruas").map(({ slug }) => ({ slug }));
}

export default async function StreetPage({ params }: PageProps) {
  const { slug } = await params;
  const district = getDistrict("ruas", slug);

  if (!district) {
    notFound();
  }

  const nearbyDistricts = districts.filter(
    (item) => item.slug !== district.slug && item.type === "ruas",
  );

  return (
    <main className="min-h-screen bg-slate-50/30 px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <PesquisaPromoHeader />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="sticky top-20 z-50">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between glass-container-mobile sm:bg-white/92 sm:shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                Placa da rua
              </span>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 md:text-sm mobile-text-anchor">
                {district.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-[9px] font-black uppercase tracking-widest text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
              >
                Voltar ao mapa
              </Link>
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-[9px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-600 mobile-btn-soft-dark solar-shimmer-effect"
              >
                Sair da rua
              </Link>
            </div>
          </div>
        </div>

        <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-10 glass-container-mobile sm:bg-white sm:shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mobile-text-anchor">
            {district.count}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            {district.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-500 font-light mobile-text-anchor">
            {district.intro}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--pp-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-orange)]">
                Clima da rua
              </p>
              <p className="mt-2 text-base leading-8 text-[var(--pp-muted)]">
                {district.pulse}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--pp-blue)] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Em destaque
              </p>
              <p className="mt-2 text-base leading-8 text-white/88">
                {district.highlight}
              </p>
            </div>
          </div>
        </header>

        {district.slug === "testes" ? (
          <section className="rounded-2xl border border-[var(--pp-blue)]/20 bg-[linear-gradient(135deg,_rgba(25,76,160,0.08),_rgba(229,93,58,0.08))] p-6 shadow-[0_16px_40px_rgba(16,37,74,0.05)] md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
                  Cidade teste paralela
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                  Entre no laboratorio separado
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--pp-muted)] md:text-base">
                  Quando quisermos ousar mais, sem mexer na cidade principal, este
                  atalho leva para o segundo site de experimentos.
                </p>
              </div>

              <Link
                href="http://localhost:3001"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[var(--pp-blue)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]"
              >
                Abrir cidade teste
              </Link>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xl md:p-6 glass-container-mobile sm:bg-slate-50/50">
          <div className="mb-6 flex items-center justify-between rounded-[1.5rem] bg-white px-5 py-4 border border-slate-100 shadow-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600 mobile-text-anchor">
                Caminhando por aqui
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 font-light mobile-text-anchor">
                Lojas de um lado e do outro, como se você estivesse seguindo pela
                via.
              </p>
            </div>
            <span className="hidden rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white md:inline-flex">
              {district.title}
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 hidden h-full w-5 -translate-x-1/2 rounded-full bg-[rgba(25,76,160,0.1)] lg:block" />
            <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 rounded-full bg-[var(--pp-blue)]/40 lg:block" />

            <div className="flex flex-col gap-6">
              {district.shops.map((shop, index) => {
                const leftSide = index % 2 === 0;

                return (
                  <div
                    key={shop.name}
                    className={`relative grid gap-4 lg:grid-cols-[1fr_auto_1fr] ${
                      leftSide ? "" : ""
                    }`}
                  >
                    <div className={leftSide ? "lg:block" : "lg:hidden"} />

                    {leftSide ? (
                      <>
                        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm glass-container-mobile sm:bg-white sm:shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xl font-bold tracking-tight text-slate-900">{shop.name}</p>
                              <p className="mt-1 text-xs text-slate-400 font-medium mobile-text-anchor">
                                {shop.street}
                              </p>
                            </div>
                            <span className="inline-flex rounded-full bg-pp-orange/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-pp-orange border border-pp-orange/20">
                              {shop.badge}
                            </span>
                          </div>

                          <p className="mt-5 text-sm leading-relaxed text-slate-500 font-light mobile-text-anchor">
                            {shop.vibe}
                          </p>

                          {shop.address ? (
                            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300 mobile-text-anchor">
                              {shop.address}
                            </p>
                          ) : null}

                          <div className="mt-6 rounded-[1.3rem] bg-slate-50/80 border border-slate-100 p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mobile-text-anchor">
                              Oferta chamando atenção
                            </p>
                            <p className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{shop.offer}</p>
                          </div>

                          {shop.slug ? (
                            <Link
                              href={`/lojas/${shop.slug}`}
                              className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-600 mobile-btn-soft-dark solar-shimmer-effect"
                            >
                              Entrar na lojinha
                            </Link>
                          ) : null}
                        </article>

                        <div className="relative hidden items-center justify-center lg:flex">
                          <span className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-slate-900/90 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-xl">
                            {index + 1}
                          </span>
                        </div>

                        <div className="hidden lg:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden lg:block" />

                        <div className="relative hidden items-center justify-center lg:flex">
                          <span className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-pp-orange text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-xl">
                            {index + 1}
                          </span>
                        </div>

                        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm glass-container-mobile sm:bg-white sm:shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xl font-bold tracking-tight text-slate-900">{shop.name}</p>
                              <p className="mt-1 text-xs text-slate-400 font-medium mobile-text-anchor">
                                {shop.street}
                              </p>
                            </div>
                            <span className="inline-flex rounded-full bg-pp-orange/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-pp-orange border border-pp-orange/20">
                              {shop.badge}
                            </span>
                          </div>

                          <p className="mt-5 text-sm leading-relaxed text-slate-500 font-light mobile-text-anchor">
                            {shop.vibe}
                          </p>

                          {shop.address ? (
                            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300 mobile-text-anchor">
                              {shop.address}
                            </p>
                          ) : null}

                          <div className="mt-6 rounded-[1.3rem] bg-slate-50/80 border border-slate-100 p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mobile-text-anchor">
                              Oferta chamando atenção
                            </p>
                            <p className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{shop.offer}</p>
                          </div>

                          {shop.slug ? (
                            <Link
                              href={`/lojas/${shop.slug}`}
                              className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-600 mobile-btn-soft-dark solar-shimmer-effect"
                            >
                              Entrar na lojinha
                            </Link>
                          ) : null}
                        </article>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {nearbyDistricts.length > 0 ? (
          <section className="rounded-2xl border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
              Continue passeando
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {nearbyDistricts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.type}/${item.slug}`}
                  className="rounded-[1.5rem] border border-[var(--pp-line)] bg-[var(--pp-surface)] p-5 transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,37,74,0.08)]"
                >
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--pp-muted)]">
                    {item.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="flex justify-center pb-6 pt-2">
          <Link
            href="/"
            className="inline-flex rounded-full bg-slate-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-600 mobile-btn-soft-dark solar-shimmer-effect"
          >
            Voltar
          </Link>
        </div>
      </section>
    </main>
  );
}
