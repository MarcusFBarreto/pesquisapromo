"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getPartnerBySlug } from "@/lib/partner-data";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DemandList } from "@/components/ui/demand-list";
import type { Demand } from "@/lib/mock-demands";
import { 
  RefreshCw, 
  ExternalLink, 
  LogOut, 
  Copy, 
  Globe, 
  Zap, 
  CheckCircle2, 
  BarChart3 
} from "lucide-react";

export default function PartnerDashboard() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [partner, setPartner] = useState<any>(null);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync partner data
  useEffect(() => {
    async function loadPartner() {
      // 1. Try hardcoded
      let p = getPartnerBySlug(slug);
      if (p) {
        setPartner(p);
      } else {
        // 2. Try Firestore
        try {
          const docRef = doc(db, "partners", slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPartner(docSnap.data());
          }
        } catch (err) {
          console.error("Erro ao carregar parceiro:", err);
        }
      }
    }
    loadPartner();
  }, [slug]);

  const fetchDemands = useCallback(async () => {
    try {
      const res = await fetch(`/api/demands/${slug}`);
      const data = await res.json();
      if (data.demands) {
        // Parse date strings back to Date objects
        setDemands(
          data.demands.map((d: Demand & { createdAt: string }) => ({
            ...d,
            createdAt: new Date(d.createdAt),
          }))
        );
      }
    } catch (err) {
      console.error("Erro ao buscar demandas:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch on mount and poll every 10 seconds for new demands
  useEffect(() => {
    fetchDemands();
    const interval = setInterval(fetchDemands, 10000);
    return () => clearInterval(interval);
  }, [fetchDemands]);

  if (!partner) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando parceiro...</p>
        </div>
      </main>
    );
  }

  const newCount = demands.filter((d) => d.status === "new").length;
  const respondedCount = demands.filter((d) => d.status === "responded").length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-emerald-500 bg-white">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Pesquisa<span className="text-pp-orange">Promo</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchDemands}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:text-emerald-600"
              title="Atualizar demandas"
            >
              <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <Link
              href={`/parceiros/${slug}`}
              className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-600 shadow-lg shadow-slate-900/10"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Meu Perfil</span>
            </Link>
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HEADER ─── */}
      <section className="px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-5xl">
          {/* PERFIL LINK BOX (SOLAR) */}
          <div className="mb-10 rounded-2xl border border-emerald-100 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-emerald-500/[0.03]">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Seu link público</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">pesquisapromo.com/parceiros/{slug}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const link = `${window.location.origin}/parceiros/${slug}`;
                navigator.clipboard.writeText(link);
                alert("Link do seu perfil copiado!");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-6 py-3 text-xs font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100"
            >
              <Copy className="h-4 w-4" />
              Copiar Link
            </button>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between px-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">
                  Painel ao vivo
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                {partner.name}
              </h1>
              <p className="mt-2 text-base text-slate-500 font-light">
                {partner.category} · {partner.city}/{partner.region}
              </p>
            </div>

            {/* Quick stats (Solar version) */}
            <div className="flex gap-4">
              <div className="rounded-2xl bg-white border border-slate-100 p-4 min-w-[100px] text-center shadow-sm">
                <p className="text-2xl font-black text-pp-orange">{newCount}</p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <Zap className="h-3 w-3 text-pp-orange" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Novas</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-4 min-w-[100px] text-center shadow-sm">
                <p className="text-2xl font-black text-emerald-600">{respondedCount}</p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Atendidas</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 min-w-[100px] text-center shadow-lg shadow-slate-900/10">
                <p className="text-2xl font-black text-white">{demands.length}</p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <BarChart3 className="h-3 w-3 text-white/40" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEMAND LIST ─── */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="animate-pulse text-white/40">Carregando demandas...</p>
          </div>
        ) : (
          <DemandList demands={demands} partnerName={partner.name} partnerSlug={slug} />
        )}
      </section>

      {/* ─── FOOTER MINI ─── */}
      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            Painel exclusivo para parceiros verificados · Atualiza automaticamente a cada 10s
          </p>
        </div>
      </footer>
    </main>
  );
}
