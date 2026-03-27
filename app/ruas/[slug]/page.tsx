import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="min-h-screen bg-[var(--pp-cream)] px-6 py-8 text-[var(--pp-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="sticky top-4 z-20">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--pp-line)] bg-white/92 p-4 shadow-[0_18px_40px_rgba(16,37,74,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-[var(--pp-blue)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                Placa da rua
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)] md:text-base">
                {district.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex rounded-full border border-[var(--pp-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)] transition hover:border-[var(--pp-blue)]"
              >
                Voltar ao mapa
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full bg-[var(--pp-blue)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]"
              >
                Sair da rua
              </Link>
            </div>
          </div>
        </div>

        <header className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_20px_60px_rgba(16,37,74,0.05)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
            {district.count}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {district.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--pp-muted)]">
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
          <section className="rounded-[2rem] border border-[var(--pp-blue)]/20 bg-[linear-gradient(135deg,_rgba(25,76,160,0.08),_rgba(229,93,58,0.08))] p-6 shadow-[0_16px_40px_rgba(16,37,74,0.05)] md:p-7">
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

        <section className="rounded-[2rem] border border-[var(--pp-line)] bg-[linear-gradient(180deg,_#f8f4ec,_#f3eee5)] p-4 shadow-[0_20px_60px_rgba(16,37,74,0.05)] md:p-6">
          <div className="mb-6 flex items-center justify-between rounded-[1.5rem] bg-white px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--pp-blue)]">
                Caminhando por aqui
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--pp-muted)]">
                Lojas de um lado e do outro, como se voce estivesse seguindo pela
                via.
              </p>
            </div>
            <span className="hidden rounded-full bg-[rgba(25,76,160,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)] md:inline-flex">
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
                        <article className="rounded-[1.75rem] border border-[var(--pp-line)] bg-white p-5 shadow-[0_16px_40px_rgba(16,37,74,0.04)]">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-2xl font-semibold">{shop.name}</p>
                              <p className="mt-1 text-sm text-[var(--pp-muted)]">
                                {shop.street}
                              </p>
                            </div>
                            <span className="inline-flex rounded-full bg-[rgba(229,93,58,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-orange)]">
                              {shop.badge}
                            </span>
                          </div>

                          <p className="mt-5 text-sm leading-8 text-[var(--pp-muted)]">
                            {shop.vibe}
                          </p>

                          {shop.address ? (
                            <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--pp-muted)]">
                              {shop.address}
                            </p>
                          ) : null}

                          <div className="mt-4 rounded-[1.3rem] bg-[var(--pp-surface)] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)]">
                              Oferta chamando atencao
                            </p>
                            <p className="mt-2 text-lg font-medium">{shop.offer}</p>
                          </div>

                          {shop.slug ? (
                            <Link
                              href={`/lojas/${shop.slug}`}
                              className="mt-4 inline-flex rounded-full bg-[var(--pp-blue)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]"
                            >
                              Entrar na lojinha
                            </Link>
                          ) : null}
                        </article>

                        <div className="relative hidden items-center justify-center lg:flex">
                          <span className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[var(--pp-blue)] text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(16,37,74,0.12)]">
                            {index + 1}
                          </span>
                        </div>

                        <div className="hidden lg:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden lg:block" />

                        <div className="relative hidden items-center justify-center lg:flex">
                          <span className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[var(--pp-orange)] text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(16,37,74,0.12)]">
                            {index + 1}
                          </span>
                        </div>

                        <article className="rounded-[1.75rem] border border-[var(--pp-line)] bg-white p-5 shadow-[0_16px_40px_rgba(16,37,74,0.04)]">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-2xl font-semibold">{shop.name}</p>
                              <p className="mt-1 text-sm text-[var(--pp-muted)]">
                                {shop.street}
                              </p>
                            </div>
                            <span className="inline-flex rounded-full bg-[rgba(229,93,58,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-orange)]">
                              {shop.badge}
                            </span>
                          </div>

                          <p className="mt-5 text-sm leading-8 text-[var(--pp-muted)]">
                            {shop.vibe}
                          </p>

                          {shop.address ? (
                            <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--pp-muted)]">
                              {shop.address}
                            </p>
                          ) : null}

                          <div className="mt-4 rounded-[1.3rem] bg-[var(--pp-surface)] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)]">
                              Oferta chamando atencao
                            </p>
                            <p className="mt-2 text-lg font-medium">{shop.offer}</p>
                          </div>

                          {shop.slug ? (
                            <Link
                              href={`/lojas/${shop.slug}`}
                              className="mt-4 inline-flex rounded-full bg-[var(--pp-blue)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]"
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
          <section className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
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
            className="inline-flex rounded-full bg-[var(--pp-blue)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#123a7e]"
          >
            Voltar
          </Link>
        </div>
      </section>
    </main>
  );
}
