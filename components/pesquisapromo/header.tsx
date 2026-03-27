import Link from "next/link";

export function PesquisaPromoHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          PesquisaPromo
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/busca">Buscar na cidade</Link>
          <Link href="/taxi-virtual">Táxi Virtual</Link>
        </nav>
      </div>
    </header>
  );
}
