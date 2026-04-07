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
  ClockIcon,
  LinkIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  UserMinusIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { auth } from "@/lib/firebase";
import { Demand } from "@/lib/mock-demands";
import { slugify } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'demands' | 'partners' | 'admins'>('demands');
  const [demands, setDemands] = useState<Demand[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user || !user.isAdmin) {
        router.push("/parceiro/login");
        return;
      }
      fetchData();
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [user, authLoading, router]);

  if (authLoading || (user && !user.isAdmin)) {
    return (
      <div className="min-h-screen bg-pp-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-pp-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-pp-muted font-bold animate-pulse">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) return null;

  const fetchData = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const [demRes, appRes, adminRes] = await Promise.all([
        fetch('/api/admin/demands', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/partners', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/admins', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const demData = await demRes.json();
      const appData = await appRes.json();
      const adminData = await adminRes.json();

      if (demData.demands) setDemands(demData.demands);
      if (appData.applications) setApplications(appData.applications);
      if (adminData.admins) setAdminList(adminData.admins);
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppStatus = async (applicationId: string, status: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/partners', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleGenerateMagicLink = async (email: string, slug?: string, name?: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/magic-link', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          email, 
          type: 'partner', 
          name, 
          metadata: { partnerSlug: slug } 
        })
      });
      const data = await res.json();
      if (data.magicLink) {
        navigator.clipboard.writeText(data.magicLink);
        alert("Link Mágico copiado e e-mail enviado ao parceiro! ✨");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao gerar link mágico:", error);
      return false;
    }
  };

  const handleManualInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    
    setIsInviting(true);
    const success = await handleGenerateMagicLink(inviteEmail, slugify(inviteName), inviteName);
    if (success) {
      setInviteEmail("");
      setInviteName("");
      fetchData(); // Refresh list to show new partner if they were created
    }
    setIsInviting(false);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setIsAddingAdmin(true);
    try {
       const token = await auth.currentUser?.getIdToken();
       const res = await fetch('/api/admin/admins', {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ email: newAdminEmail })
       });
       if (res.ok) {
         setNewAdminEmail("");
         fetchData();
       }
    } catch (error) {
       console.error("Erro ao adicionar admin:", error);
    }
    setIsAddingAdmin(false);
  };

  const handleRemoveAdmin = async (email: string) => {
    if (email === user?.email) {
      alert("Você não pode remover a si mesmo.");
      return;
    }
    if (!window.confirm(`Remover acesso administrativo de ${email}?`)) return;
    
    try {
       const token = await auth.currentUser?.getIdToken();
       const res = await fetch(`/api/admin/admins?email=${email}`, {
         method: 'DELETE',
         headers: { 'Authorization': `Bearer ${token}` }
       });
       if (res.ok) fetchData();
    } catch (error) {
       console.error("Erro ao remover admin:", error);
    }
  };

  const handleDeleteDemand = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta demanda definitivamente?")) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/demands?id=${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
            <button 
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${activeTab === 'admins' ? 'bg-pp-orange text-white' : 'text-white/60 hover:text-white'}`}
            >
              Equipe
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
        <div className="mb-10 bg-pp-dark rounded-2xl p-8 lg:p-10 relative overflow-hidden">
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
                      <p className="mt-1 text-xs text-white/50 leading-relaxed">Historicamente, as demandas por materiais de construção em nossa Área Piloto crescem 25% no próximo mês. Recomendado reforçar parcerias nesta categoria.</p>
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
        ) : activeTab === 'partners' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-pp-ink">Aprovações e Convites</h2>

            {/* QUICK INVITE FORM */}
            <div className="bg-pp-dark p-8 rounded-[40px] border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                 <LinkIcon className="h-20 w-20 text-pp-orange" />
               </div>
               
               <div className="relative z-10">
                 <h3 className="text-white font-bold italic mb-6">CONVIDAR NOVO PARCEIRO <span className="text-pp-orange text-[10px] font-normal not-italic opacity-60 ml-2 uppercase tracking-widest">Acesso Direto</span></h3>
                 
                 <form onSubmit={handleManualInvite} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <input 
                     type="text" 
                     placeholder="Nome da Empresa/Parceiro"
                     value={inviteName}
                     onChange={(e) => setInviteName(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:border-pp-orange outline-none transition"
                     required
                   />
                   <input 
                     type="email" 
                     placeholder="E-mail do Parceiro"
                     value={inviteEmail}
                     onChange={(e) => setInviteEmail(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:border-pp-orange outline-none transition"
                     required
                   />
                   <button 
                     type="submit"
                     disabled={isInviting}
                     className="bg-pp-orange text-white rounded-2xl font-bold text-sm hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                   >
                     {isInviting ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                        <>
                          <LinkIcon className="h-5 w-5" />
                          Gerar Link de Convite
                        </>
                     )}
                   </button>
                 </form>
                 <p className="mt-4 text-[10px] text-white/40 italic">O link será automaticamente copiado e um perfil básico será criado se o parceiro ainda não existir.</p>
               </div>
            </div>
            
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
                            onClick={() => handleGenerateMagicLink(app.email, slugify(app.name))}
                            className="w-full flex items-center justify-center gap-2 bg-white text-pp-teal border border-pp-teal/30 py-3 rounded-2xl font-bold text-[10px] uppercase hover:bg-pp-teal/5 transition"
                          >
                            <LinkIcon className="h-4 w-4" />
                            Gerar Link Pro
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
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-pp-ink">Administração da Equipe</h2>
              <span className="text-[10px] font-bold text-pp-orange bg-pp-orange/10 px-3 py-1 rounded-full uppercase tracking-widest border border-pp-orange/20">Acesso Restrito</span>
            </div>

            {/* ADD ADMIN FORM */}
            <div className="bg-white p-8 rounded-[40px] border border-pp-line shadow-sm border-pp-orange/20">
               <h3 className="text-pp-ink font-bold italic mb-6">ADICIONAR NOVO ADMINISTRADOR</h3>
               <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4">
                 <div className="flex-1 relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pp-muted">
                     <UserPlusIcon className="h-5 w-5" />
                   </div>
                   <input 
                     type="email" 
                     placeholder="Digite o e-mail do novo administrador..."
                     value={newAdminEmail}
                     onChange={(e) => setNewAdminEmail(e.target.value)}
                     className="w-full bg-pp-cream border border-pp-line rounded-2xl pl-12 pr-6 py-4 text-sm text-pp-ink focus:border-pp-orange outline-none transition"
                     required
                   />
                 </div>
                 <button 
                   type="submit"
                   disabled={isAddingAdmin}
                   className="bg-pp-dark text-white rounded-2xl px-8 font-bold text-sm hover:bg-pp-ink transition flex items-center justify-center gap-2"
                 >
                   {isAddingAdmin ? "Adicionando..." : "Autorizar Admin"}
                 </button>
               </form>
               <p className="mt-4 text-[10px] text-pp-muted italic flex items-center gap-2">
                 <ShieldCheckIcon className="h-4 w-4 text-pp-teal" />
                 Administradores podem aprovar parceiros, ver todas as demandas e gerenciar a equipe.
               </p>
            </div>

            {/* ADMIN LIST */}
            <div className="grid gap-4">
              <p className="text-xs font-bold text-pp-muted uppercase tracking-widest ml-1">Membros da Equipe ({adminList.length})</p>
              {adminList.map((admin) => (
                <div key={admin.email} className="bg-white p-6 rounded-3xl border border-pp-line flex items-center justify-between group hover:border-pp-orange transition">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-pp-orange/10 text-pp-orange rounded-xl flex items-center justify-center font-bold">
                       {admin.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pp-ink">{admin.email}</p>
                      <p className="text-[10px] text-pp-muted uppercase tracking-wider">Membro desde {new Date(admin.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {admin.email !== user?.email && (
                    <button 
                      onClick={() => handleRemoveAdmin(admin.email)}
                      className="p-2 text-pp-muted hover:text-red-500 hover:bg-red-50 transition rounded-xl"
                      title="Remover Acesso"
                    >
                      <UserMinusIcon className="h-5 w-5" />
                    </button>
                  )}
                  {admin.email === user?.email && (
                    <span className="text-[10px] font-bold text-pp-teal bg-pp-teal/10 px-2 py-1 rounded-md">VOCÊ</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
