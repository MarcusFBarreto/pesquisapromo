"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ChartBarIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  CheckBadgeIcon, 
  XCircleIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { Demand } from "@/lib/mock-demands";
import { slugify } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'demands' | 'partners'>('demands');
  const [demands, setDemands] = useState<Demand[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [demRes, appRes] = await Promise.all([
        fetch('/api/admin/demands'),
        fetch('/api/admin/partners')
      ]);
      
      const demData = await demRes.json();
      const appData = await appRes.json();

      if (demData.demands) setDemands(demData.demands);
      if (appData.applications) setApplications(appData.applications);
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppStatus = async (applicationId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDeleteDemand = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta demanda definitivamente?")) return;
    try {
      const res = await fetch(`/api/admin/demands?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao deletar demanda:", error);
    }
  };

  return (
    <div className="min-h-screen bg-pp-cream">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 border-b border-pp-line bg-pp-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🛡️</span>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">ADMIN <span className="text-pp-orange">PP</span></span>
          </div>
          <nav className="flex gap-4">
            <button 
              onClick={() => setActiveTab('demands')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${activeTab === 'demands' ? 'bg-pp-orange text-white' : 'text-white/60 hover:text-white'}`}
            >
              Demandas
            </button>
            <button 
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${activeTab === 'partners' ? 'bg-pp-orange text-white' : 'text-white/60 hover:text-white'}`}
            >
              Aprovações
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-pp-line shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pp-teal/10 text-pp-teal rounded-xl">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-pp-muted font-bold uppercase tracking-wider">Total Demandas</p>
                <p className="text-2xl font-bold text-pp-ink">{demands.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-pp-line shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pp-orange/10 text-pp-orange rounded-xl">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-pp-muted font-bold uppercase tracking-wider">Parceiros Pendentes</p>
                <p className="text-2xl font-bold text-pp-ink">{applications.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-pp-line shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pp-dark text-white rounded-xl">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-pp-muted font-bold uppercase tracking-wider">Status do Sistema</p>
                <p className="text-sm font-bold text-pp-teal">Online Blaze 🚀</p>
              </div>
            </div>
          </div>
        </div>

        {/* MARKET INTELLIGENCE (NEW) */}
        <div className="mb-10 bg-pp-dark rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <ChartBarIcon className="h-32 w-32 text-pp-teal" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-pp-teal animate-pulse" />
              <h2 className="text-xl font-bold text-white tracking-tight italic">MARKET INTELLIGENCE <span className="text-pp-orange text-sm font-normal not-italic opacity-60">Insights de Demanda</span></h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Opportunities */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Oportunidades Críticas (Gaps)</p>
                <div className="grid gap-3">
                  {/* Logic: Find categories in demands that don't have enough approved partners */}
                  {Array.from(new Set(demands.flatMap(d => d.matchedCategories))).slice(0, 3).map(cat => {
                    const approvedPartnersInCat = applications.filter(a => a.status === 'approved' && a.category === cat).length;
                    if (approvedPartnersInCat < 2) {
                      return (
                        <div key={cat} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-white">{cat}</p>
                            <p className="text-[10px] text-pp-teal-soft font-medium uppercase">Demanda Alta · Pouca Oferta</p>
                          </div>
                          <Link href="/parceiro/cadastro" className="text-pp-orange text-[10px] font-bold uppercase hover:underline">Recrutar +</Link>
                        </div>
                      );
                    }
                    return null;
                  }).filter(Boolean).length === 0 && (
                    <p className="text-xs text-white/30 italic">Nenhum gap crítico identificado no momento.</p>
                  )}
                </div>
              </div>
              
              {/* Trends */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tendências e Sazonalidade</p>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <p className="text-sm font-bold text-white">Próxima Onda: Construção Civil</p>
                      <p className="mt-1 text-xs text-white/50 leading-relaxed">Historicamente, as demandas por materiais de construção em Horizonte crescem 25% no próximo mês. Recomendado reforçar parcerias nesta categoria.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <p className="text-sm font-bold text-white">Disfunção de Concorrência</p>
                      <p className="mt-1 text-xs text-white/50 leading-relaxed">Categoria "Alimentação" possui excesso de fornecedores para a demanda atual. Sugestão: Incentivar ofertas exclusivas para equilibrar o mercado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {activeTab === 'demands' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-pp-ink">Visão Global de Demandas</h2>
              <span className="text-xs text-pp-muted bg-white px-3 py-1 rounded-full border border-pp-line">Atualização Live</span>
            </div>
            
            <div className="grid gap-4">
              {demands.map((demand) => (
                <div key={demand.id} className="bg-white p-6 rounded-3xl border border-pp-line hover:border-pp-teal transition group">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold bg-pp-surface px-2 py-1 rounded-lg text-pp-muted">#{demand.id.slice(-6)}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                          demand.status === 'new' ? 'bg-pp-teal/10 text-pp-teal' : 'bg-pp-orange/10 text-pp-orange'
                        }`}>
                          {demand.status === 'new' ? 'Aguardando' : 'Atendida'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-pp-ink group-hover:text-pp-teal transition">{demand.request}</h3>
                      <p className="mt-2 text-sm text-pp-muted leading-relaxed line-clamp-2">{demand.details}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {demand.matchedCategories.map(cat => (
                          <span key={cat} className="text-[10px] bg-pp-cream border border-pp-line px-2 py-0.5 rounded-md text-pp-ink">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-64 border-l border-pp-line md:pl-6 shrink-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-pp-teal" />
                          <span className="text-sm font-bold text-pp-ink">{demand.name}</span>
                        </div>
                        <a 
                          href={`https://wa.me/55${demand.whatsapp}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-pp-teal hover:underline text-sm font-semibold"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          WhatsApp: {demand.whatsapp}
                        </a>
                        <div className="flex items-center gap-2 text-pp-muted text-xs">
                          <ClockIcon className="h-4 w-4" />
                          {new Date(demand.createdAt).toLocaleString('pt-BR')}
                        </div>
                        <button 
                          onClick={() => handleDeleteDemand(demand.id)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-[10px] font-bold uppercase transition pt-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Excluir Demanda
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-pp-ink">Novas Afiliações de Parceiros</h2>
            
            <div className="grid gap-6">
              {applications.length === 0 ? (
                <div className="bg-white/50 border-2 border-dashed border-pp-line rounded-3xl p-20 text-center">
                  <p className="text-pp-muted">Nenhuma solicitação pendente no momento.</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className={`bg-white p-8 rounded-3xl border ${app.status === 'pending' ? 'border-pp-orange/30 shadow-pp-orange/5 shadow-lg' : 'border-pp-line opacity-70'} transition`}>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 bg-pp-orange/10 text-pp-orange rounded-2xl flex items-center justify-center">
                            <BuildingStorefrontIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-pp-ink">{app.name}</h3>
                            <p className="text-sm text-pp-muted">CNPJ: {app.cnpj}</p>
                          </div>
                          <span className={`ml-auto px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            app.status === 'approved' ? 'bg-pp-teal text-white' : 
                            app.status === 'rejected' ? 'bg-pp-dark text-white/50' : 'bg-pp-orange text-white'
                          }`}>
                            {app.status === 'approved' ? 'Aprovado' : app.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-pp-surface p-4 rounded-2xl">
                            <p className="text-[10px] font-bold text-pp-muted uppercase mb-1">Categoria Principal</p>
                            <p className="text-sm font-bold text-pp-ink">{app.category}</p>
                          </div>
                          <div className="bg-pp-surface p-4 rounded-2xl">
                            <p className="text-[10px] font-bold text-pp-muted uppercase mb-1">WhatsApp Comercial</p>
                            <p className="text-sm font-bold text-pp-teal font-mono">{app.whatsapp}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-pp-muted uppercase mb-2">Marcas e Descrição</p>
                          <p className="text-sm italic text-pp-ink bg-pp-cream p-4 rounded-2xl border border-pp-line">
                            "{app.description || 'Sem descrição fornecida'}"
                          </p>
                        </div>
                      </div>

                      {app.status === 'approved' && (
                        <div className="md:w-64 flex flex-col gap-3 justify-center border-l border-pp-line md:pl-6">
                          <p className="text-[10px] font-bold text-pp-muted uppercase">Perfil Público</p>
                          <a 
                            href={`/parceiros/${slugify(app.name)}`}
                            target="_blank"
                            className="flex items-center gap-2 text-pp-teal text-sm font-bold hover:underline"
                          >
                            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            Ver página
                          </a>
                          <button 
                            onClick={() => {
                              const link = `${window.location.origin}/parceiros/${slugify(app.name)}`;
                              navigator.clipboard.writeText(link);
                              alert("Link copiado para a área de transferência!");
                            }}
                            className="flex items-center gap-2 bg-pp-surface text-pp-ink px-4 py-2 rounded-xl text-xs font-bold border border-pp-line hover:bg-pp-cream transition"
                          >
                            Copiar Link
                          </button>
                        </div>
                      )}
                      {app.status === 'pending' && (
                        <div className="md:w-48 flex flex-col gap-3 justify-center">
                          <button 
                            onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                            className="w-full flex items-center justify-center gap-2 bg-pp-teal text-white py-4 rounded-2xl font-bold text-sm hover:bg-pp-teal-hover transition shadow-lg shadow-pp-teal/20"
                          >
                            <CheckBadgeIcon className="h-5 w-5" />
                            Aprovar
                          </button>
                          <button 
                            onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                            className="w-full flex items-center justify-center gap-2 bg-white text-pp-dark border border-pp-line py-4 rounded-2xl font-bold text-sm hover:bg-pp-surface transition"
                          >
                            <XCircleIcon className="h-5 w-5" />
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


function BuildingStorefrontIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21V10.5m0 0L7.5 4.5M13.5 10.5l6 6M4.5 9v11.25A1.875 1.875 0 0 0 6.375 22h11.25a1.875 1.875 0 0 0 1.875-1.875V9M4.5 9l3-4.875a1.125 1.125 0 0 1 1.05-.625h7.8a1.125 1.125 0 0 1 1.05.625L19.5 9M4.5 9h15" />
    </svg>
  );
}
