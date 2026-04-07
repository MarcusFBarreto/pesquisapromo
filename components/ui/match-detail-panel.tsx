"use client";

import { MatchedOffer } from "@/lib/match-service";
import { getSupplierName } from "@/lib/offers-store";
import { ShoppingBag, ShieldCheck } from "lucide-react";

export function MatchDetailPanel({ match }: { match: MatchedOffer | null }) {
  if (!match) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4 shadow-inner">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <p className="text-sm font-bold text-slate-400">Nenhum item selecionado</p>
        <p className="text-[10px] uppercase tracking-widest text-slate-300 mt-2">Clique em um match à esquerda para ver os detalhes</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white overflow-y-auto animate-fade-in">
      {/* Detail Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 bg-slate-50/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pp-orange/10 text-pp-orange border border-pp-orange/20">
          <span className="text-lg">🎯</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 truncate pr-4">Análise da Oferta</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Análise de Similaridade</p>
        </div>
      </div>

      <div className="p-6">
        <div className="w-full aspect-video rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm relative overflow-hidden">
           <ShoppingBag className="w-16 h-16 text-slate-200 relative z-10" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 mb-4 shadow-sm">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">{match.matchScore}% de Relevância</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{match.title}</h2>
        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{match.matchReason}</p>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 shadow-sm">
           <div className="flex items-baseline gap-3 mb-1">
             <span className="text-3xl font-black text-slate-900">R$ {match.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             <span className="text-sm text-slate-400 line-through">R$ {match.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Possível economia mapeada</p>
        </div>

        <div className="border-t border-slate-100 pt-6">
           <div className="flex items-start gap-4">
             <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">Fornecido por {getSupplierName(match.supplierSlug)}</p>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Nossa IA encontrou esse fornecedor como uma ótima opção para a sua solicitação. O registro de interesse foi efetuado. Aguarde novidades diretamente pelo seu WhatsApp.
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
