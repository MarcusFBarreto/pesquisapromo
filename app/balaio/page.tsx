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
  ChevronRight 
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

const BalaioCard = ({ demand }: { demand: Demand }) => {
  const [claiming, setClaiming] = useState(false);
  const [myClaim, setMyClaim] = useState(false);

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
    <article className={`group relative rounded-[2rem] border p-8 transition-all duration-500 glass-container-mobile ${
      myClaim 
        ? "bg-emerald-50 border-emerald-200 shadow-xl shadow-emerald-500/5 scale-[1.02] sm:bg-emerald-50" 
        : "bg-white border-slate-200 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-slate-200/50 sm:bg-white"
    }`}>
      {/* Badge e Views */}
      <div className="flex items-center justify-between mb-8">
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
          demand.status === "pending" 
            ? "bg-emerald-500 text-white shadow-sm" 
            : myClaim
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}>
          {demand.status === "pending" ? "Disponível" : myClaim ? "Resgatado" : "Em Negociação"}
        </span>
        
        <div className="flex items-center gap-2 text-slate-400">
          <Eye className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black font-mono tracking-tight mobile-text-anchor">{demand.viewCount || 0}</span>
        </div>
      </div>

      {/* Título e Descrição */}
      <h3 className={`text-xl font-bold mb-4 tracking-tight leading-tight transition-colors mobile-text-anchor ${
        myClaim ? "text-emerald-700" : "text-slate-900 group-hover:text-emerald-600"
      }`}>
        {demand.request}
      </h3>
      <p className="text-slate-500 text-sm font-light leading-relaxed mb-10 line-clamp-2 mobile-text-anchor">
        {demand.details || "O cliente não forneceu detalhes adicionais nesta solicitação."}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6 mb-12 pt-8 border-t border-slate-100/50">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase text-slate-400 font-extrabold tracking-[0.2em] mobile-text-anchor">
            Cidade/Região
          </span>
          <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold mobile-text-anchor">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            Horizonte
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase text-slate-400 font-extrabold tracking-[0.2em] mobile-text-anchor">
            Tempo Decorrido
          </span>
          <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold mobile-text-anchor">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            {demand.createdAt 
              ? formatDistanceToNow(demand.createdAt.toDate(), { locale: ptBR, addSuffix: true }) 
              : "agora"}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button 
        onClick={handleClaim}
        disabled={demand.status !== "pending" || claiming}
        className={`w-full py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 solar-shimmer-effect ${
          demand.status === "pending"
            ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-900/10 active:scale-95 mobile-btn-soft-dark"
            : myClaim
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
        }`}
      >
        {claiming ? "Carregando..." : myClaim ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Ver Negociação
          </>
        ) : demand.status === "pending" ? (
          <>
            Capturar Oportunidade
            <ChevronRight className="w-4 h-4" />
          </>
        ) : (
          "Já Ocupada"
        )}
      </button>
    </article>
  );
};

export default function BalaioPage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "demands"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Demand[];
      setDemands(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <PesquisaPromoHeader />

      {/* Background Decorativo Sutil */}
      <div className="fixed inset-0 bg-[radial-gradient(at_top_right,rgba(16,185,129,0.03),transparent_50%)] pointer-events-none" />

      {/* Header do Balaio */}
      <header className="relative max-w-6xl mx-auto mb-12 px-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 rounded-[2.5rem] border border-slate-200 bg-white/60 p-8 shadow-xl backdrop-blur-xl glass-container-mobile sm:bg-white/80 sm:shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.25em] leading-none mobile-text-anchor">
                Mercado em Tempo Real
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight mobile-text-anchor">
              Balaio de <span className="text-emerald-600 italic font-serif">Demandas</span>
            </h1>
            <p className="text-slate-500 mt-6 text-lg font-light max-w-xl leading-relaxed mobile-text-anchor">
              Acompanhe as necessidades dos clientes em tempo real. <br className="hidden md:block" />
              Capture oportunidades e expanda seu terreno.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-slate-900/10 hover:bg-emerald-600 mobile-btn-soft-dark solar-shimmer-effect">
              <Filter className="w-4 h-4 text-emerald-400 group-hover:text-white" />
              Filtrar Categorias
            </button>
          </div>
        </div>
      </header>

      {/* Grid de Cards (Estilo Light PREMIUM) */}
      <main className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 pb-20">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-96 bg-white/40 rounded-[2rem] animate-pulse border border-slate-100 backdrop-blur-sm" />
          ))
        ) : demands.length === 0 ? (
          <div className="col-span-full py-40 text-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/40 backdrop-blur-sm">
            <p className="text-slate-400 font-light text-xl mobile-text-anchor">Nenhum chamado aberto no momento.</p>
            <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest mobile-text-anchor">Assim que um cliente pedir algo, ele aparecerá aqui.</p>
          </div>
        ) : (
          demands.map((demand) => (
            <BalaioCard key={demand.id} demand={demand} />
          ))
        )}
      </main>
      
      {/* Footer / Stats */}
      <footer className="max-w-6xl mx-auto mt-32 text-center pb-20 border-t border-slate-100 pt-12">
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          Ambiente Seguro PesquisaPromo
        </p>
        <p className="text-slate-500 text-xs mt-3 font-light">
          Horizonte, Ceará. Todos os direitos reservados aos parceiros verificados.
        </p>
      </footer>
    </div>
  );
}
