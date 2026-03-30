"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getPartnerBySlug } from "@/lib/partner-data";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DemandList } from "@/components/ui/demand-list";
import type { Demand } from "@/lib/mock-demands";

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
      <main className="flex min-h-screen items-center justify-center bg-pp-dark">
        <p className="text-white/40">Parceiro não encontrado.</p>
      </main>
    );
  }

  const newCount = demands.filter((d) => d.status === "new").length;
  const respondedCount = demands.filter((d) => d.status === "responded").length;

  return (
    <main className="min-h-screen bg-pp-dark">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-pp-dark backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Pesquisa<span className="text-pp-orange">Promo</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDemands}
              className="text-xs font-medium text-white/40 transition hover:text-white/70"
              title="Atualizar demandas"
            >
              🔄 Atualizar
            </button>
            <Link
              href={`/parceiros/${slug}`}
              className="flex items-center gap-2 rounded-full bg-pp-teal px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pp-teal-hover hover:shadow-lg hover:shadow-pp-teal/20"
            >
              <span>Ver meu perfil</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60 transition hover:border-white/30 hover:text-white"
            >
              Sair
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HEADER ─── */}
      <section className="border-b border-white/[0.06] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          {/* PERFIL LINK BOX (NEW) */}
          <div className="mb-8 rounded-2xl border border-pp-teal/20 bg-pp-teal/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-pp-teal/20 rounded-full flex items-center justify-center text-pp-teal">
                <span className="text-xl">🌐</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-pp-teal-soft">Seu link público</p>
                <p className="text-sm font-mono text-white/60">pesquisapromo.com/parceiros/{slug}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const link = `${window.location.origin}/parceiros/${slug}`;
                navigator.clipboard.writeText(link);
                alert("Link do seu perfil copiado!");
              }}
              className="text-xs font-bold text-pp-teal bg-white px-4 py-2 rounded-lg hover:bg-pp-surface transition text-center border border-pp-teal/10"
            >
              Copiar Link
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-pp-teal animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-teal-soft">
                  Painel ao vivo
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {partner.name}
              </h1>
              <p className="mt-1 text-sm text-white/40">
                {partner.category} · {partner.city}/{partner.region}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center">
                <p className="text-2xl font-bold text-pp-orange">{newCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Novas
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center">
                <p className="text-2xl font-bold text-pp-teal">{respondedCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Atendidas
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center">
                <p className="text-2xl font-bold text-white">{demands.length}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Total
                </p>
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
      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <p className="text-xs text-white/25">
            Painel exclusivo para parceiros verificados · Atualiza automaticamente a cada 10s
          </p>
        </div>
      </footer>
    </main>
  );
}
