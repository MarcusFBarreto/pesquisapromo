import Link from "next/link";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { ProductCard } from "@/components/pesquisapromo/product-card";
import { getOffersByShopSlug } from "@/lib/pesquisapromo-city-data";

export default function AchadoDoDiaPage() {
  const offers = getOffersByShopSlug("achado-do-dia");
  const mainOffer = offers[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <PesquisaPromoHeader />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <p className="text-sm font-medium text-amber-700">Lojinha da Rua dos Testes</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Achado do Dia</h1>
          <p className="mt-3 text-slate-700">
            Um achado que vale a pena hoje, validado primeiro no laboratório vivo da cidade.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/ruas/testes" className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-slate-900">
              Voltar para a Rua dos Testes
            </Link>
            <Link href="/lojas/lojinha-alfa" className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-slate-900">
              Ver sandbox oficial
            </Link>
          </div>
        </div>

        {mainOffer ? (
          <section className="mt-8">
            <ProductCard offer={mainOffer} />
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Menor preço recente nesta loja</p>
              <p className="mt-2">Volte amanhã para um novo achado.</p>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
