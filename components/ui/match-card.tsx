"use client";

import { MatchedOffer } from "@/lib/match-service";
import { getSupplierName } from "@/lib/offers-store";
import { Tag, Sparkles, ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";

export function MatchCard({ match, isSelected }: { match: MatchedOffer, isSelected?: boolean }) {
  return (
    <article className={`group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border bg-white transition-all animate-fade-in-up hover:border-pp-orange hover:shadow-xl ${isSelected ? 'border-pp-orange shadow-lg ring-2 ring-pp-orange/20 ring-offset-2' : 'border-emerald-100 shadow-sm'}`}>
      {/* Decorative Badge */}
      <div className="absolute -top-2 -left-2 bg-pp-orange text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
        <Sparkles className="h-2 w-2 animate-pulse" />
        Match!
      </div>

      <div className={`h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-500 ${isSelected ? 'bg-emerald-50 text-emerald-500' : ''}`}>
        <ShoppingBag className="h-8 w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
            {match.matchScore}% relevante
          </span>
          <span className="text-[8px] font-bold text-slate-400 truncate">{match.matchReason}</span>
        </div>

        <h3 className={`text-sm font-black text-slate-900 truncate transition-colors group-hover:text-pp-orange ${isSelected ? 'text-pp-orange' : ''}`}>
          {match.title}
        </h3>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-900 leading-none">R$ {match.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-slate-300 line-through">R$ {match.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">Fornecido por {getSupplierName(match.supplierSlug)}</p>
        </div>
      </div>
    </article>
  );
}
