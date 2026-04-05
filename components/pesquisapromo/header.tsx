"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Menu, X, Home, Search, Telescope, User, MessageSquare, ChevronRight, Tag } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Tag, label: "Vitrine (myPromos)", href: "/mypromos" },
  { icon: Search, label: "Pesquisar Ofertas", href: "/busca" },
  { icon: Telescope, label: "Oportunidades", href: "/balaio" },
  { icon: User, label: "Portal do Parceiro", href: "/parceiro/login" },
  { icon: MessageSquare, label: "Fale Conosco", href: "/contato" },
] as const;

export function PesquisaPromoHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl animate-fade-in sm:bg-white/80 sm:backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2 sm:gap-4 shrink-0 whitespace-nowrap">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-emerald-500 bg-white shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-pp-orange" />
            </div>
            
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none shrink-0">
              my<span className="text-pp-orange">Lupa</span>
            </span>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 border border-emerald-100 shrink-0 shadow-sm sm:gap-1 sm:px-1.5 sm:py-0.5 sm:bg-emerald-50/50 sm:shadow-none">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] sm:h-1 sm:w-1 sm:shadow-none" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600 sm:text-[8px] sm:tracking-[0.05em] sm:text-emerald-500">
                Área Piloto
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 md:flex">
            <Link href="/mypromos" className="flex items-center gap-2 text-slate-900 hover:text-emerald-600 transition-colors">
              <Tag className="h-3 w-3" />
              myPromos
            </Link>
            <Link href="/busca" className="hover:text-slate-900 transition-colors">Pesquisa</Link>
            <Link href="/balaio" className="hover:text-slate-900 transition-colors">Oportunidades</Link>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button 
            type="button"
            onClick={openSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 transition-all active:scale-90 md:hidden"
            aria-label="Abrir Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ─── MOBILE SIDEBAR (Overlay) ─── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* Panel */}
          <aside className="absolute right-0 top-0 h-full w-[280px] max-w-[85vw] bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-slide-in-right">
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-50 px-6 shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navegação</p>
              <button 
                type="button"
                onClick={closeSidebar}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Fechar Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sidebar Content */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        onClick={closeSidebar}
                        className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-slate-600 transition-all active:bg-emerald-50 active:text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-xs font-bold tracking-tight">{item.label}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-200" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t border-slate-50 p-6 bg-slate-50/50 shrink-0">
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">myLupa v2.1.0</p>
               <p className="text-[9px] text-slate-400 leading-relaxed font-light">
                 Sua demanda nas mãos certas.
               </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
