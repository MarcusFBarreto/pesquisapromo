import Link from "next/link";
import { notFound } from "next/navigation";
import { getPartnerBySlug, getAllPartners } from "@/lib/partner-data";
import { getDemandsForPartner } from "@/lib/mock-demands";
import { DemandList } from "@/components/ui/demand-list";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPartners().map(({ slug }) => ({ slug }));
}

export default async function PartnerDashboard({ params }: PageProps) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) {
    notFound();
  }

  const demands = getDemandsForPartner(partner.category);
  const newCount = demands.filter((d) => d.status === "new").length;
  const respondedCount = demands.filter((d) => d.status === "responded").length;

  return (
    <main className="min-h-screen bg-pp-dark">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-pp-dark backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Pesquisa<span className="text-pp-orange">Promo</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/parceiros/${slug}`}
              className="text-xs font-medium text-white/40 transition hover:text-white/70"
            >
              Meu perfil
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60 transition hover:border-white/30 hover:text-white"
            >
              Início
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HEADER ─── */}
      <section className="border-b border-white/[0.06] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-pp-teal" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-teal-soft">
                  Painel do parceiro
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {partner.name}
              </h1>
              <p className="mt-1 text-sm text-white/40">
                {partner.category} · {partner.city}/{partner.region}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center">
                <p className="text-2xl font-bold text-pp-orange">{newCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Novas
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center">
                <p className="text-2xl font-bold text-pp-teal">{respondedCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Atendidas
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center">
                <p className="text-2xl font-bold text-white">{demands.length}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEMAND LIST ─── */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        <DemandList demands={demands} partnerName={partner.name} partnerSlug={slug} />
      </section>

      {/* ─── FOOTER MINI ─── */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <p className="text-xs text-white/25">
            Painel exclusivo para parceiros verificados do PesquisaPromo.
          </p>
        </div>
      </footer>
    </main>
  );
}
