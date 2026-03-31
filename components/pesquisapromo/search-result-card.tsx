import Link from "next/link";
import type { CityDestination } from "@/lib/pesquisapromo-types";

export function SearchResultCard({ destination }: { destination: CityDestination }) {
  return (
    <Link
      href={destination.targetRoute}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-xl glass-container-mobile sm:bg-white sm:shadow-sm"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mobile-text-anchor">{destination.type}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900 tracking-tight">{destination.name}</h3>
      <p className="mt-2 text-sm text-slate-500 font-light leading-relaxed mobile-text-anchor">{destination.summary}</p>
    </Link>
  );
}
