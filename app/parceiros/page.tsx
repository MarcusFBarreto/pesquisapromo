import Link from "next/link";
import { getAllPartners } from "@/lib/partner-data";
import { adminDb } from "@/lib/firebase-admin";

async function getDynamicPartners() {
  try {
    const snapshot = await adminDb.collection("partners").get();
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      isDynamic: true
    }));
  } catch (error) {
    console.error("Error fetching dynamic partners:", error);
    return [];
  }
}

export default async function PartnersDirectoryPage() {
  const staticPartners = getAllPartners();
  const dynamicPartners = await getDynamicPartners();
  
  // Combine and deduplicate by slug (static takes precedence)
  const allPartnersMap = new Map();
  
  // Add dynamic first (will be overwritten if slug exists in static)
  dynamicPartners.forEach((p: any) => {
    allPartnersMap.set(p.slug, {
      ...p,
      tagline: p.tagline || `Especialista em ${p.category}`,
      featured: p.featured || false
    });
  });

  staticPartners.forEach((p) => {
    allPartnersMap.set(p.slug, p);
  });

  const allPartners = Array.from(allPartnersMap.values());

  return (
    <div className="min-h-screen bg-pp-cream">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-pp-dark backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Pesquisa<span className="text-pp-orange">Promo</span>
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

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-pp-ink sm:text-5xl">Nossos Parceiros</h1>
          <p className="mt-4 text-lg text-pp-muted">
            Encontre as melhores lojas e serviços de Horizonte verificados pelo PesquisaPromo.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allPartners.map((partner) => (
            <Link
              href={`/parceiros/${partner.slug}`}
              key={partner.slug}
              className="group flex flex-col rounded-[2rem] border border-pp-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-pp-teal hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-pp-surface px-2.5 py-0.5 text-xs font-semibold text-pp-teal">
                  {partner.category}
                </span>
                {partner.featured && (
                  <span className="text-xs font-bold text-pp-orange">★ Destaque</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-pp-ink group-hover:text-pp-teal transition">{partner.name}</h3>
              <p className="mt-2 text-sm text-pp-muted line-clamp-2 leading-relaxed">
                {partner.tagline}
              </p>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-pp-line">
                <span className="text-xs text-pp-muted">{partner.city}/{partner.region}</span>
                <span className="text-xs font-bold text-pp-teal group-hover:underline">Ver Perfil →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
