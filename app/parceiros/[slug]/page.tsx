import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPartners, getPartnerBySlug } from "@/lib/partner-data";
import { PartnerDemandCTA } from "@/components/ui/partner-demand-cta";

type PageProps = {
  params: Promise<{ slug: string }>;
};

import { adminDb } from "@/lib/firebase-admin";

export async function generateStaticParams() {
  return getAllPartners().map(({ slug }) => ({ slug }));
}

export default async function PartnerPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Try hardcoded data first (for legacy/featured partners)
  let partner = getPartnerBySlug(slug);

  // 2. If not found, try Firestore
  if (!partner) {
    try {
      const snapshot = await adminDb.collection("partners").doc(slug).get();
      if (snapshot.exists) {
        const data = snapshot.data()!;
        partner = {
          slug: data.slug,
          name: data.name,
          tagline: data.tagline || `Sua loja de ${data.category}`,
          category: data.category,
          city: data.city || "Piloto",
          region: data.region || "CE",
          description: data.description || "",
          services: data.services || [],
          contact: {
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
          },
          featured: data.featured || false,
        };
      }
    } catch (error) {
      console.error("Error fetching partner from Firestore:", error);
    }
  }

  if (!partner) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-pp-cream">
      {/* ─── NAVBAR (same as home) ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-pp-dark backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              my<span className="text-pp-orange">Lupa</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition hover:border-white/30 hover:text-white"
          >
            Voltar ao início
          </Link>
        </div>
      </nav>

      {/* ─── PARTNER HEADER ─── */}
      <section className="bg-pp-dark pb-16 pt-12 lg:pb-20 lg:pt-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="animate-fade-in-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-pp-teal" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-pp-teal-soft">
                Parceiro verificado
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {partner.name}
            </h1>
            <p className="mt-3 text-lg text-white/60">
              {partner.tagline}
            </p>
            <p className="mt-1 text-sm text-white/35">
              {partner.city}/{partner.region} · {partner.category}
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="-mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: About + Services */}
          <div className="animate-fade-in-up delay-1 space-y-6">
            {/* About */}
            <div className="rounded-[1.75rem] border border-pp-line bg-white p-7 shadow-sm">
              <p className="section-label text-pp-teal">Sobre</p>
              <p className="mt-4 text-base leading-8 text-pp-muted">
                {partner.description}
              </p>
            </div>

            {/* Services */}
            <div className="rounded-[1.75rem] border border-pp-line bg-white p-7 shadow-sm">
              <p className="section-label text-pp-teal">
                O que oferece
              </p>
              <div className="mt-4 grid gap-3">
                {partner.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 rounded-[1rem] bg-pp-cream px-4 py-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pp-teal/10">
                      <div className="h-2 w-2 rounded-full bg-pp-teal" />
                    </div>
                    <span className="text-sm text-pp-ink">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact + CTA */}
          <div className="animate-fade-in-up delay-2 space-y-6">
            {/* Contact */}
            <div className="rounded-[1.75rem] border border-pp-line bg-white p-7 shadow-sm">
              <p className="section-label text-pp-orange">Contato</p>
              <div className="mt-4 space-y-3">
                {partner.contact.phone && (
                  <div className="flex items-center gap-3 rounded-[1rem] bg-pp-cream px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-pp-muted">
                      Tel
                    </span>
                    <span className="text-sm font-medium text-pp-ink">
                      {partner.contact.phone}
                    </span>
                  </div>
                )}
                {partner.contact.whatsapp && (
                  <a
                    href={`https://wa.me/${partner.contact.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-[1rem] bg-pp-teal/5 px-4 py-3 transition hover:bg-pp-teal/10"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-pp-teal">
                      WhatsApp
                    </span>
                    <span className="text-sm font-medium text-pp-teal">
                      Abrir conversa
                    </span>
                  </a>
                )}
                {partner.contact.email && (
                  <div className="flex items-center gap-3 rounded-[1rem] bg-pp-cream px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-pp-muted">
                      Email
                    </span>
                    <span className="text-sm font-medium text-pp-ink">
                      {partner.contact.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-[1.75rem] bg-pp-dark p-7">
              <p className="section-label text-pp-teal-soft">
                Precisa de algo?
              </p>
              <h3 className="mt-3 text-xl font-bold text-white">
                Envie sua demanda
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/45">
                Diga o que precisa e {partner.name} recebe
                sua solicitação para responder com uma proposta.
              </p>
              <PartnerDemandCTA partnerName={partner.name} partnerSlug={partner.slug} />
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-3 rounded-[1.75rem] border border-pp-line bg-white p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-pp-teal bg-pp-dark">
                <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
              </div>
              <div>
                <p className="text-xs font-semibold text-pp-ink">
                  Parceiro verificado myLupa
                </p>
                <p className="text-xs text-pp-muted">
                  Verificado pela nossa equipe em {partner.city}/{partner.region}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER MINI ─── */}
      <footer className="mt-20 bg-pp-dark py-10">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Link href="/" className="text-sm font-semibold text-white/60 transition hover:text-white">
            ← Voltar ao myLupa
          </Link>
          <p className="mt-3 text-xs text-white/25">
            Lojas virtuais, promoções reais. Área Piloto.
          </p>
        </div>
      </footer>
    </main>
  );
}
