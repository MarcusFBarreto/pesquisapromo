import Link from "next/link";
import type { CityDestination } from "@/lib/pesquisapromo-types";

export function SearchSuggestions({ suggestions }: { suggestions: CityDestination[] }) {
  if (!suggestions.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
      {suggestions.map((suggestion) => (
        <Link
          key={`${suggestion.type}-${suggestion.id}`}
          href={suggestion.targetRoute}
          className="block rounded-xl px-3 py-3 transition hover:bg-slate-50"
        >
          <p className="text-sm font-medium text-slate-900">{suggestion.name}</p>
          <p className="text-xs text-slate-500">{suggestion.summary}</p>
        </Link>
      ))}
    </div>
  );
}
