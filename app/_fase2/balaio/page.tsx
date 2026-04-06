"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  increment 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Eye, 
  Filter, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Search,
  PlusCircle,
  LayoutGrid,
  List
} from "lucide-react";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";

interface Demand {
  id: string;
  request: string;
  details?: string;
  name?: string;
  whatsapp: string;
  status: string;
  createdAt: any;
  expiresAt?: any;
  viewCount?: number;
  claimedBy?: string;
  matchedCategories?: string[];
}

const BalaioCard = ({ demand, viewMode = "list" }: { demand: Demand; viewMode?: "list" | "grid" }) => {
  const [claiming, setClaiming] = useState(false);
  const [myClaim, setMyClaim] = useState(false);

  // Sistema de Cores Solar (Accents)
  const getAccent = () => {
    const accents = [
      { name: "emerald", bg: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-200", shadow: "shadow-emerald-500/10", glow: "group-hover:shadow-emerald-400/20" },
      { name: "amber", bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-200", shadow: "shadow-amber-500/10", glow: "group-hover:shadow-amber-400/20" },
      { name: "violet", bg: "bg-violet-500", text: "text-violet-600", border: "border-violet-200", shadow: "shadow-violet-500/10", glow: "group-hover:shadow-violet-400/20" },
      { name: "rose", bg: "bg-rose-500", text: "text-rose-600", border: "border-rose-200", shadow: "shadow-rose-500/10", glow: "group-hover:shadow-rose-400/20" },
    ];
    // Rotação simples baseada no ID para dar "vida"
    const index = (demand.id.length + (demand.viewCount || 0)) % accents.length;
    return accents[index];
  };

  const accent = getAccent();

  // Simulação de ID de parceiro para o Piloto
  useEffect(() => {
    const partnerId = localStorage.getItem("partner_id_mock");
    if (!partnerId) {
      localStorage.setItem("partner_id_mock", "p_" + Math.random().toString(36).substr(2, 9));
    }
  }, []);

  useEffect(() => {
    const partnerId = localStorage.getItem("partner_id_mock");
    if (demand.claimedBy === partnerId) {
      setMyClaim(true);
    } else {
      setMyClaim(false);
    }
  }, [demand.claimedBy]);

  // Incrementa a visualização ao montar o card
  useEffect(() => {
    const incrementView = async () => {
      try {
        const docRef = doc(db, "demands", demand.id);
        await updateDoc(docRef, {
          viewCount: increment(1)
        });
      } catch (err) {
        console.error("Erro ao incrementar views:", err);
      }
    };
    
    const timer = setTimeout(incrementView, 2000);
    return () => clearTimeout(timer);
  }, [demand.id]);

  const handleClaim = async () => {
    if (demand.status !== "pending") return;
    
    setClaiming(true);
    try {
      const partnerId = localStorage.getItem("partner_id_mock");
      const docRef = doc(db, "demands", demand.id);
      await updateDoc(docRef, {
        status: "negotiating",
        claimedAt: new Date(),
        claimedBy: partnerId
      });
      alert("Sucesso! Oportunidade resgatada para sua carteira.");
    } catch (err) {
      console.error("Erro ao resgatar demanda:", err);
      alert("Falha técnica. Tente novamente.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <article className={`group relative transition-all duration-500 glass-container-mobile ${
      viewMode === "grid" ? "rounded-lg p-3 text-center" : "rounded-xl p-5"
    } border ${
      myClaim 
        ? "bg-emerald-50 border-emerald-200 shadow-lg scale-[1.02] sm:bg-emerald-50" 
        : `bg-white border-slate-200 shadow-xl ${accent.shadow} ${accent.glow} sm:bg-white`
    }`}>
      {/* Glow Decorativo de Fundo */}
      <div className={`absolute -inset-px rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${accent.bg}`} />

      {/* Badge e Views (Compact) */}
      <div className={`relative flex items-center justify-between ${viewMode === "grid" ? "mb-2" : "mb-4"}`}>
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] ${
          demand.status === "pending" 
            ? `${accent.bg} text-white` 
            : myClaim
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}>
          {demand.status === "pending" ? "Disp." : "Ocup."}
        </span>
        
        <div className="flex items-center gap-1 text-slate-400">
          <Eye className="w-2.5 h-2.5" />
          <span className="text-[9px] font-black font-mono tracking-tight mobile-text-anchor">{demand.viewCount || 0}</span>
        </div>
      </div>

      {/* Título e Descrição (Compact) */}
      <h3 className={`${viewMode === "grid" ? "text-sm" : "text-lg"} font-bold mb-1 tracking-tight leading-snug transition-colors mobile-text-anchor line-clamp-1 ${
        myClaim ? "text-emerald-700" : `text-slate-900 group-hover:${accent.text}`
      }`}>
        {demand.request}
      </h3>
      {viewMode !== "grid" && (
        <p className="text-slate-500 text-xs font-light leading-relaxed mb-6 line-clamp-2 mobile-text-anchor">
          {demand.details || "Sem detalhes adicionais."}
        </p>
      )}

      {/* Info Grid (Tight) */}
      <div className={`${viewMode === "grid" ? "hidden" : "grid grid-cols-2 shadow-sm bg-slate-50/50 rounded-xl p-2.5 mb-8"} gap-4 pt-4 border-t border-slate-100/50`}>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] uppercase text-slate-400 font-extrabold tracking-[0.15em] mobile-text-anchor">
            Região
          </span>
          <div className="flex items-center gap-1 text-slate-700 text-[10px] font-bold mobile-text-anchor">
            <MapPin className={`w-3 h-3 ${accent.text}`} />
            Área Piloto
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] uppercase text-slate-400 font-extrabold tracking-[0.15em] mobile-text-anchor">
            Tempo
          </span>
          <div className="flex items-center gap-1 text-slate-700 text-[10px] font-bold mobile-text-anchor">
            <Clock className={`w-3 h-3 ${accent.text}`} />
            {demand.createdAt 
              ? formatDistanceToNow(demand.createdAt.toDate(), { locale: ptBR, addSuffix: true }) 
              : "agora"}
          </div>
        </div>
      </div>

      {/* CTA Button (Compact) */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleClaim}
          disabled={demand.status !== "pending" || claiming}
          className={`flex-1 ${viewMode === "grid" ? "py-2.5 text-[9px]" : "py-4 text-[10px]"} rounded-full font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 solar-shimmer-effect ${
            demand.status === "pending"
              ? `bg-slate-900 text-white group-hover:${accent.bg} shadow-md active:scale-95 mobile-btn-soft-dark`
              : myClaim
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
          }`}
        >
          {claiming ? "..." : myClaim ? (viewMode === "grid" ? "Ver" : "Ver Negociação") : demand.status === "pending" ? (viewMode === "grid" ? "Capt." : "Capturar") : "Ocup."}
        </button>

        <button 
          title="Denunciar Fake"
          className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 transition-all active:scale-90"
          onClick={() => {
            if(confirm("Deseja denunciar esta demanda como falsa ou spam?")) {
              alert("Denúncia enviada para moderação.");
            }
          }}
        >
          <Filter className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </article>
  );
};

export default function BalaioPage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    const q = query(
      collection(db, "demands"), 
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((d: any) => d.status === "pending") as Demand[]; // Somente verificados
      setDemands(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/20 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <PesquisaPromoHeader />

      {/* Background Decorativo Discreto */}
      <div className="fixed inset-0 bg-[radial-gradient(at_top_right,rgba(16,185,129,0.02),transparent_50%)] pointer-events-none" />

      {/* Header da myLupa (Compacto/Vitrine) */}
      <header className="relative max-w-6xl mx-auto mb-6 px-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border border-slate-100 bg-white/40 p-6 shadow-sm backdrop-blur-xl glass-container-mobile sm:bg-white/60">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
            <h1 className="text-xl md:text-4xl font-black tracking-tighter text-slate-900 leading-none mobile-text-anchor flex items-center gap-2">
              myLupa <span className="text-emerald-500 text-sm font-black uppercase tracking-[0.2em] mb-auto">v1.1</span>
            </h1>
            <p className="text-[10px] uppercase font-extrabold tracking-[0.15em] text-slate-400 mobile-text-anchor">
              Onde vendedores encontram oportunidades
            </p>
          </div>
        </div>
      </header>

      {/* Grid de Cards (Alta Densidade) */}
      <main className={`relative max-w-6xl mx-auto grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-4 px-6 pb-32`}>
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className={`${viewMode === "grid" ? "h-40" : "h-64"} bg-white/40 rounded-xl animate-pulse border border-slate-100 backdrop-blur-sm`} />
          ))
        ) : demands.length === 0 ? (
          <div className="col-span-full py-40 text-center rounded-xl border border-dashed border-slate-200 bg-white/20 backdrop-blur-sm">
            <p className="text-slate-400 font-light text-lg mobile-text-anchor">Vazio no momento.</p>
          </div>
        ) : (
          demands.map((demand) => (
            <BalaioCard key={demand.id} demand={demand} viewMode={viewMode} />
          ))
        )}
      </main>

      {/* Painel de Comandos (Minimalista / Rodapé) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50">
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/10 p-2 shadow-2xl flex items-center gap-2">
          {/* Botão de Toggle List/Grid */}
          <button 
            onClick={() => setViewMode(prev => prev === "list" ? "grid" : "list")}
            className={`h-10 w-10 flex items-center justify-center rounded-full border transition-all ${
              viewMode === "grid" 
                ? "bg-emerald-500 border-white/20 text-slate-900" 
                : "bg-white/5 border-white/10 text-emerald-400 hover:text-white"
            }`}>
            {viewMode === "list" ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>

          {/* Barra de Busca Minimalista */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar na myLupa..." 
              className="w-full h-11 bg-white/5 border border-white/10 rounded-full pl-11 pr-4 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
            />
          </div>

          {/* Ação Primária (Placeholder) */}
          <button className="h-11 px-6 rounded-full bg-emerald-500 text-slate-900 text-[11px] font-black uppercase tracking-[0.1em] hover:bg-emerald-400 active:scale-95 transition-all flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Criar</span>
          </button>
        </div>
        
        {/* Indicador de Swipe/Scroll Sutil */}
        <div className="mt-3 flex justify-center">
          <div className="h-1 w-12 rounded-full bg-slate-300/20" />
        </div>
      </div>
      
      {/* Footer / Stats */}
      <footer className="max-w-6xl mx-auto mt-32 text-center pb-20 border-t border-slate-100 pt-12">
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          myLupa <span className="mx-2 text-slate-300">|</span> Inteligência de Mercado Local
        </p>
        <p className="text-slate-500 text-xs mt-3 font-light">
          Área Piloto, Ceará. {new Date().getFullYear()} — Inteligência de Mercado.
        </p>
      </footer>
    </div>
  );
}
