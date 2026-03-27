import Link from "next/link";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { ProductCard } from "@/components/pesquisapromo/product-card";
import { getOffersByShopSlug } from "@/lib/pesquisapromo-city-data";

export default function OutletDoTenisPage() {
  const offers = getOffersByShopSlug("outlet-do-tenis");

  return (
    <main className="min-h-screen bg-slate-50">
      <PesquisaPromoHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500">Lojinha da Rua dos Calçados</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Outlet do Tênis</h1>
          <p className="mt-3 text-slate-600">
            Uma vitrine enxuta para olhar modelos, preço atual e sinais de queda real quando houver.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/ruas/calcados" className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900">
              Voltar para a Rua dos Calçados
            </Link>
            <Link href="/busca?q=tênis" className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900">
              Buscar mais opções
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {offers.map((offer) => (
            <ProductCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </main>
  );
}
