"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  getOffers, 
  OfferSort, 
  OfferFilters, 
  getSupplierName,
  mockOffers
} from "@/lib/offers-store";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { 
  ArrowLeft, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  Tag, 
  ShoppingBag, 
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function MyPromosPage() {
  const [sort, setSort] = useState<OfferSort>("promo");
  const [filters, setFilters] = useState<OfferFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  const offers = useMemo(() => {
    let result = getOffers(sort, filters);
    if (searchQuery) {
      result = result.filter(o => 
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [sort, filters, searchQuery]);

  // Derive filter options from mock data
  const brands = Array.from(new Set(mockOffers.map(o => o.brand)));
  const producers = Array.from(new Set(mockOffers.map(o => o.producer)));
  const suppliers = Array.from(new Set(mockOffers.map(o => o.supplierSlug)));

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <PesquisaPromoHeader />

      {/* ─── TITLE SECTION ─── */}
      <section className="border-b border-slate-100 bg-white px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-pp-orange flex items-center justify-center text-white shadow-lg shadow-pp-orange/20">
                  <Tag className="h-5 w-5" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">myPromos</h1>
              </div>
              <p className="text-sm text-slate-400 font-medium">As melhores ofertas verificadas de Horizonte.</p>
            </div>

            <div className="flex flex-wrap gap-3">
               <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-pp-orange transition-colors" />
                 <input 
                  type="text"
                  placeholder="Buscar oferta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full md:w-64 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold outline-none focus:border-pp-orange focus:ring-4 focus:ring-pp-orange/5 transition-all"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTERS & GRID ─── */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          
          {/* SIDEBAR FILTERS (Solar Sharp) */}
          <aside className="space-y-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-900">
                <Filter className="h-4 w-4 text-pp-orange" />
                <span className="text-[10px] font-black uppercase tracking-widest">Filtros Avançados</span>
              </div>

              {/* Sort */}
              <div className="space-y-4 mb-10">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Ordenar por</label>
                <div className="grid gap-2">
                  <button 
                    onClick={() => setSort("promo")}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition ${sort === "promo" ? "bg-slate-900 text-white shadow-md" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                  >
                    <span>Maiores Descontos</span>
                    <Sparkles className={`h-3 w-3 ${sort === "promo" ? "text-amber-400" : "text-slate-200"}`} />
                  </button>
                  <button 
                    onClick={() => setSort("price_asc")}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition ${sort === "price_asc" ? "bg-slate-900 text-white shadow-md" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                  >
                    <span>Menor Preço</span>
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  </button>
                  <button 
                    onClick={() => setSort("date")}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition ${sort === "date" ? "bg-slate-900 text-white shadow-md" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                  >
                    <span>Faltando Pouco</span>
                    <Calendar className="h-3 w-3 opacity-30" />
                  </button>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-4 mb-10">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Marca</label>
                <select 
                  className="w-full h-11 rounded-xl bg-slate-50 border border-slate-100 px-3 text-xs font-bold text-slate-600 outline-none"
                  onChange={(e) => setFilters({...filters, brand: e.target.value || undefined})}
                  value={filters.brand || ""}
                >
                  <option value="">Todas as Marcas</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Supplier Filter */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Fornecedor</label>
                <div className="grid gap-2">
                  <button 
                    onClick={() => setFilters({...filters, supplierSlug: undefined})}
                    className={`text-left px-4 py-2 text-[10px] font-bold rounded-lg transition ${!filters.supplierSlug ? "bg-emerald-50 text-emerald-700" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    Todos
                  </button>
                  {suppliers.map(slug => (
                    <button 
                      key={slug}
                      onClick={() => setFilters({...filters, supplierSlug: slug})}
                      className={`text-left px-4 py-2 text-[10px] font-bold rounded-lg transition ${filters.supplierSlug === slug ? "bg-emerald-50 text-emerald-700" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      {getSupplierName(slug)}
                    </button>
                  ))}
                </div>
              </div>

              {filters && Object.keys(filters).length > 0 && (
                <button 
                  onClick={() => setFilters({})}
                  className="mt-8 w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-pp-orange transition-colors"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </aside>

          {/* MAIN GRID */}
          <div className="flex-1">
            {offers.length === 0 ? (
              <div className="rounded-3xl border border-slate-100 bg-white py-32 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                  <Search className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-sm font-medium text-slate-400">Nenhuma oferta encontrada com esses filtros.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {offers.map((offer) => (
                  <article 
                    key={offer.id}
                    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:border-emerald-100"
                  >
                    {/* Placeholder and Discount Badge */}
                    <div className="aspect-[4/3] bg-slate-50 relative flex items-center justify-center overflow-hidden">
                       <ShoppingBag className="h-12 w-12 text-slate-100 transition-transform group-hover:scale-110" />
                       <div className="absolute top-4 left-4 bg-pp-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                         -{offer.discountPercentage}%
                       </div>
                       
                       {/* Floating UI for Price Drop */}
                       <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                          <p className="text-[9px] font-black text-emerald-600 uppercase">Queda Real</p>
                       </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {offer.brand}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                          {offer.category}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-black text-slate-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
                        {offer.title}
                      </h3>
                      
                      <p className="text-xs text-slate-400 font-light line-clamp-2 mb-6">
                        {offer.description}
                      </p>

                      <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                        <div>
                          <p className="text-[10px] font-medium text-slate-300 line-through">De R$ {offer.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="text-xl font-black text-slate-900">R$ {offer.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Fim em:</p>
                          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Calendar className="h-3 w-3 text-pp-orange" />
                            <span className="text-[10px] font-black">
                              {offer.endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Supplier */}
                      <div className="mt-6 flex items-center justify-between gap-4">
                         <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                             <ShoppingBag className="h-3 w-3 text-emerald-600" />
                           </div>
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{getSupplierName(offer.supplierSlug)}</span>
                         </div>
                         
                         <Link 
                          href="#" 
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md transition-all hover:bg-emerald-500 hover:scale-110 active:scale-95"
                         >
                            <ChevronRight className="h-4 w-4" />
                         </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">myPromos © 2026</p>
        </div>
      </footer>
    </main>
  );
}
