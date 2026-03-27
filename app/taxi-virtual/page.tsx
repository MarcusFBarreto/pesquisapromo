import Link from "next/link";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { SearchBar } from "@/components/pesquisapromo/search-bar";
import { SearchResultCard } from "@/components/pesquisapromo/search-result-card";
import { searchCityNavigation } from "@/lib/pesquisapromo-search";

export default function TaxiVirtualPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q ?? "";
  const result = searchCityNavigation(query);

  return (
    <main className="min-h-screen bg-slate-50">
      <PesquisaPromoHeader />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Táxi Virtual</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Para onde vamos?</h1>
          <p className="mt-3 text-slate-600">
            Digite seu destino e use o atalho para chegar ao melhor ponto da cidade.
          </p>
          <div className="mt-6">
            <SearchBar
              initialValue={query}
              placeholder="Digite seu destino"
              showTaxiShortcut={false}
            />
          </div>
        </div>

        {result.bestPath ? (
          <section className="mt-10">
            <p className="text-sm font-medium text-slate-500">Levar até lá</p>
            <div className="mt-4 grid gap-4">
              <SearchResultCard destination={result.bestPath} />
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Explorar ou ir direto</p>
            <p className="mt-2">
              Você pode chamar o Táxi para chegar rápido ou voltar ao portal e seguir pelas ruas.
            </p>
            <div className="mt-4">
              <Link href="/" className="font-medium text-slate-900">
                Voltar ao portal da cidade
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
