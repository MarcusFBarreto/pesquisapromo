import Link from "next/link";
import { getAllPartners } from "@/lib/partner-data";
import { adminDb } from "@/lib/firebase-admin";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";

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
    <div className="min-h-screen bg-slate-50/50">
      <PesquisaPromoHeader />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Nossos Parceiros</h1>
          <p className="mt-4 text-lg text-slate-500 font-light mobile-text-anchor">
            Encontre as melhores lojas e serviços de Horizonte verificados pelo PesquisaPromo.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allPartners.map((partner) => (
            <Link
              href={`/parceiros/${partner.slug}`}
              key={partner.slug}
              className="group flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl glass-container-mobile sm:bg-white sm:shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  {partner.category}
                </span>
                {partner.featured && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-pp-orange">★ Destaque</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition tracking-tight">{partner.name}</h3>
              <p className="mt-2 text-sm text-slate-500 font-light mobile-text-anchor line-clamp-2 leading-relaxed">
                {partner.tagline}
              </p>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100 mt-6">
                <span className="text-xs text-slate-400 font-medium mobile-text-anchor">{partner.city}/{partner.region}</span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600 group-hover:underline">Ver Perfil →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
