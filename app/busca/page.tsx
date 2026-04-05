import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { ProductCard } from "@/components/pesquisapromo/product-card";
import { SearchBar } from "@/components/pesquisapromo/search-bar";
import { SearchResultCard } from "@/components/pesquisapromo/search-result-card";
import { searchCityNavigation } from "@/lib/pesquisapromo-search";

export default function BuscaPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q ?? "";
  const result = searchCityNavigation(query);

  return (
    <main className="min-h-screen bg-slate-50">
      <PesquisaPromoHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500 mobile-text-anchor">Busca de Ofertas</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 tracking-tight">Encontramos o que você procura</h1>
          <p className="mt-3 text-slate-600 mobile-text-anchor">
            Use a busca para encontrar ofertas diretas ou descobrir novos parceiros.
          </p>
        </div>

        <div className="mt-8 max-w-3xl">
          <SearchBar initialValue={query} />
        </div>

        {result.bestPath ? (
          <section className="mt-10">
            <p className="text-sm font-medium text-slate-500 mobile-text-anchor uppercase tracking-widest text-[10px]">Melhor Correspondência</p>
            <div className="mt-4 grid gap-4">
              <SearchResultCard destination={result.bestPath} />
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <p className="text-sm font-medium text-slate-500 mobile-text-anchor uppercase tracking-widest text-[10px]">Parceiros Disponíveis</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {result.destinations.map((destination) => (
              <SearchResultCard key={`${destination.type}-${destination.id}`} destination={destination} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-sm font-medium text-slate-500 mobile-text-anchor uppercase tracking-widest text-[10px]">Ofertas diretas</p>
          <div className="mt-4 grid gap-4">
            {result.relatedOffers.map((offer) => (
              <ProductCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
