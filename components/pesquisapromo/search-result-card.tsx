import Link from "next/link";
import type { CityDestination } from "@/lib/pesquisapromo-types";

export function SearchResultCard({ destination }: { destination: CityDestination }) {
  return (
    <Link
      href={destination.targetRoute}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">{destination.type}</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">{destination.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{destination.summary}</p>
    </Link>
  );
}
