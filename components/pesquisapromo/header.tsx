import Link from "next/link";

export function PesquisaPromoHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl animate-fade-in">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 sm:gap-4 shrink-0 whitespace-nowrap">
          {/* Logo Solar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-emerald-500 bg-white shrink-0">
            <div className="h-2 w-2 rounded-full bg-pp-orange" />
          </div>
          
          {/* Marca e Badge */}
          <span className="text-lg font-bold tracking-tight text-slate-900 leading-none shrink-0">
            Pesquisa<span className="text-pp-orange">Promo</span>
          </span>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50/80 px-2 py-1 border border-slate-100 shrink-0 shadow-sm sm:gap-1 sm:px-1.5 sm:py-0.5 sm:bg-slate-50/50 sm:shadow-none">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] sm:h-1 sm:w-1 sm:shadow-none" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 sm:text-[8px] sm:tracking-[0.05em] sm:text-slate-400">
              Piloto: Horizonte, CE
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 md:flex">
          <Link href="/busca" className="hover:text-slate-900 transition-colors">Buscar na cidade</Link>
          <Link href="/taxi-virtual" className="hover:text-slate-900 transition-colors">Táxi Virtual</Link>
        </nav>
      </div>
    </header>
  );
}
