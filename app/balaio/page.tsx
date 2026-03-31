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
    <div className={`group relative rounded-2xl border p-8 transition-all duration-500 ${
      myClaim 
        ? "bg-emerald-50 border-emerald-200 shadow-xl shadow-emerald-500/5 scale-[1.02]" 
        : "bg-white border-slate-200 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-slate-200/50"
    }`}>
      {/* Badge e Views */}
      <div className="flex items-center justify-between mb-8">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
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
          <span className="text-[11px] font-bold font-mono tracking-tight">{demand.viewCount || 0}</span>
        </div>
      </div>

      {/* Título e Descrição */}
      <h3 className={`text-xl font-bold mb-3 tracking-tight transition-colors ${
        myClaim ? "text-emerald-700" : "text-slate-900 group-hover:text-emerald-600"
      }`}>
        {demand.request}
      </h3>
      <p className="text-slate-500 text-sm font-light leading-relaxed mb-10 line-clamp-2">
        {demand.details || "O cliente não forneceu detalhes adicionais nesta solicitação."}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6 mb-12 pt-8 border-t border-slate-50">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">
            Cidade/Região
          </span>
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            Horizonte
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">
            Tempo Decorrido
          </span>
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-medium">
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
        className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 ${
          demand.status === "pending"
            ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-900/10 active:scale-95"
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
    </div>
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
    <div className="min-h-screen bg-white text-slate-900 p-4 md:p-8 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background Decorativo Sutil */}
      <div className="fixed inset-0 bg-[radial-gradient(at_top_right,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />

      {/* Header do Balaio */}
      <header className="relative max-w-6xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] leading-none">
                Mercado em Tempo Real
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Balaio de <span className="text-emerald-600 italic">Demandas</span>
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-light max-w-xl">
              Acompanhe as necessidades dos clientes em tempo real. <br className="hidden md:block" />
              Capture oportunidades e expanda sua carteira de negócios.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 shadow-sm">
              <Filter className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              Filtrar por Categoria
            </button>
          </div>
        </div>
      </header>

      {/* Grid de Cards (Estilo Light SaaS) */}
      <main className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-72 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
          ))
        ) : demands.length === 0 ? (
          <div className="col-span-full py-32 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-light text-lg">Nenhum chamado aberto no momento.</p>
            <p className="text-slate-500 text-sm mt-2">Assim que um cliente pedir algo, ele aparecerá aqui.</p>
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
