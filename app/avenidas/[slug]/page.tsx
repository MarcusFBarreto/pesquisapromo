import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="min-h-screen bg-[var(--pp-cream)] px-6 py-8 text-[var(--pp-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="sticky top-4 z-20">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--pp-line)] bg-[var(--pp-blue)]/94 p-4 text-white shadow-[0_18px_40px_rgba(16,37,74,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--pp-blue)]">
                Placa da avenida
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white md:text-base">
                {district.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/18"
              >
                Voltar ao mapa
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)] transition hover:bg-white/90"
              >
                Sair da avenida
              </Link>
            </div>
          </div>
        </div>

        <header className="rounded-[2rem] border border-[var(--pp-line)] bg-[var(--pp-blue)] p-6 text-white shadow-[0_20px_60px_rgba(16,37,74,0.12)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            {district.count}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {district.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
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
              className="rounded-[1.75rem] border border-[var(--pp-line)] bg-white p-5 shadow-[0_16px_40px_rgba(16,37,74,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold">{shop.name}</p>
                  <p className="mt-1 text-sm text-[var(--pp-muted)]">{shop.street}</p>
                </div>
                <span className="inline-flex rounded-full bg-[rgba(229,93,58,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-orange)]">
                  {shop.badge}
                </span>
              </div>

              <p className="mt-5 text-sm leading-8 text-[var(--pp-muted)]">
                {shop.vibe}
              </p>

              <div className="mt-4 rounded-[1.3rem] bg-[var(--pp-surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)]">
                  Oferta chamando atencao
                </p>
                <p className="mt-2 text-lg font-medium">{shop.offer}</p>
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
