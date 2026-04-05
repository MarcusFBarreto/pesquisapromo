import Link from "next/link";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { ProductCard } from "@/components/pesquisapromo/product-card";
import { getOffersByShopSlug } from "@/lib/pesquisapromo-city-data";

export default function ComparadorDeGeladeirasPage() {
  const offers = getOffersByShopSlug("comparador-de-geladeiras");

  return (
    <main className="min-h-screen bg-slate-50">
      <PesquisaPromoHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500">Consultoria de Eletro</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Comparador de Geladeiras</h1>
          <p className="mt-3 text-slate-600">
            Uma leitura sóbria para comparar modelos, preços atuais e quedas reais dentro da própria loja.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/busca" className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900">
              Pesquisar Ofertas
            </Link>
            <Link href="/mypromos" className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900">
              Ver Vitrine
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Frost Free</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Duplex</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Inverter</span>
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
