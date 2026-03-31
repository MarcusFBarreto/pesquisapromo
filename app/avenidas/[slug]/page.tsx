import Link from "next/link";
import { notFound } from "next/navigation";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import {
  districts,
  getDistrict,
  getDistrictsByType,
} from "@/lib/exploration-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getDistrictsByType("avenidas").map(({ slug }) => ({ slug }));
}

export default async function AvenuePage({ params }: PageProps) {
  const { slug } = await params;
  const district = getDistrict("avenidas", slug);

  if (!district) {
    notFound();
  }

  const nearbyDistricts = districts.filter(
    (item) => item.slug !== district.slug && item.type !== "avenidas",
  );

  return (
    <main className="min-h-screen bg-slate-50/30 px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <PesquisaPromoHeader />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="sticky top-20 z-50">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-emerald-500/20 bg-emerald-600/90 p-4 text-white shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between sm:bg-emerald-600 sm:shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                Placa da avenida
              </span>
              <p className="text-xs font-black uppercase tracking-widest text-white md:text-sm mobile-text-anchor">
                {district.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-full border border-white/20 bg-white/10 px-4 text-[9px] font-black uppercase tracking-widest text-white transition hover:bg-white/20"
              >
                Voltar ao mapa
              </Link>
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-full bg-white px-4 text-[9px] font-black uppercase tracking-widest text-emerald-600 transition hover:bg-white/90"
              >
                Sair da avenida
              </Link>
            </div>
          </div>
        </div>

        <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl md:p-10 glass-container-mobile sm:bg-white sm:shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mobile-text-anchor">
            {district.count}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            {district.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-500 font-light mobile-text-anchor">
            {district.intro}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Clima da avenida
              </p>
              <p className="mt-2 text-base leading-8 text-white/88">
                {district.pulse}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 text-[var(--pp-ink)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-orange)]">
                Em destaque
              </p>
              <p className="mt-2 text-base leading-8 text-[var(--pp-muted)]">
                {district.highlight}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          {district.shops.map((shop) => (
            <article
              key={shop.name}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm glass-container-mobile sm:bg-white sm:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold tracking-tight text-slate-900">{shop.name}</p>
                  <p className="mt-1 text-xs text-slate-400 font-medium mobile-text-anchor">{shop.street}</p>
                </div>
                <span className="inline-flex rounded-full bg-pp-orange/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-pp-orange border border-pp-orange/20">
                  {shop.badge}
                </span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-500 font-light mobile-text-anchor">
                {shop.vibe}
              </p>

              <div className="mt-6 rounded-[1.3rem] bg-slate-50/80 border border-slate-100 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mobile-text-anchor">
                  Oferta chamando atenção
                </p>
                <p className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{shop.offer}</p>
              </div>
            </article>
          ))}
        </section>

        {nearbyDistricts.length > 0 ? (
          <section className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
              Vire a esquina
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
      </section>
    </main>
  );
}
