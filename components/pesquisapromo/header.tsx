"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, Search, Telescope, User, Info, MessageSquare, ChevronRight, Tag } from "lucide-react";

export function PesquisaPromoHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: Search, label: "Buscar na Cidade", href: "/busca" },
    { icon: Telescope, label: "Oportunidades", href: "/balaio" },
    { icon: Tag, label: "Vitrine (myPromos)", href: "/mypromos" },
    { icon: User, label: "Portal do Parceiro", href: "/parceiro/login" },
    { icon: Info, label: "Sobre o Piloto", href: "/sobre" },
    { icon: MessageSquare, label: "Fale Conosco", href: "/contato" },
  ];

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
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50/80 px-2 py-1 border border-slate-100 shrink-0 shadow-sm sm:gap-1 sm:px-1.5 sm:py-0.5 sm:bg-slate-50/50 sm:shadow-none">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] sm:h-1 sm:w-1 sm:shadow-none" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 sm:text-[8px] sm:tracking-[0.05em] sm:text-slate-400">
                Piloto de Testes
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 md:flex">
            <Link href="/mypromos" className="flex items-center gap-2 text-slate-900 hover:text-pp-orange transition-colors">
              <Tag className="h-3 w-3" />
              myPromos
            </Link>
            <Link href="/balaio" className="hover:text-slate-900 transition-colors">Oportunidades</Link>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={toggleSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 transition-all active:scale-90 md:hidden"
            aria-label="Abrir Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ─── MOBILE SIDEBAR ─── */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 pointer-events-none ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />

        {/* Panel */}
        <div 
          className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out border-l border-slate-100 flex flex-col ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-50 px-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navegação</p>
            <button 
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between rounded-xl p-4 text-slate-600 transition-all hover:bg-slate-50 hover:text-pp-orange group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-pp-orange/10 group-hover:text-pp-orange transition-colors">
                        <item.icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-bold tracking-tight">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-pp-orange/40 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-50 p-6 bg-slate-50/50">
             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">myLupa v1.1.5</p>
             <p className="text-[9px] text-slate-400 leading-relaxed font-light">
               Sua demanda nas mãos certas em Horizonte.
             </p>
          </div>
        </div>
      </div>
    </>
  );
}
