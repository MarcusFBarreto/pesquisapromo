"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSearchSuggestions, resolveCityDestination } from "@/lib/pesquisapromo-search";
import { SearchSuggestions } from "./search-suggestions";

type Props = {
  placeholder?: string;
  initialValue?: string;
  showTaxiShortcut?: boolean;
};

export function SearchBar({
  placeholder = "Buscar na cidade...",
  initialValue = "",
  showTaxiShortcut = true,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const suggestions = useMemo(() => getSearchSuggestions(value), [value]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;

    const destination = resolveCityDestination(query);

    if (destination) {
      router.push(destination.targetRoute);
      return;
    }

    router.push(`/busca?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="relative">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border border-emerald-100 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="h-14 rounded-2xl bg-slate-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] mobile-btn-soft-dark solar-shimmer-effect"
          >
            Buscar
          </button>
          {showTaxiShortcut ? (
            <button
              type="button"
              onClick={() => router.push(`/taxi-virtual?q=${encodeURIComponent(value.trim())}`)}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 transition-all hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 active:scale-[0.98] shadow-sm"
            >
              Táxi Virtual
            </button>
          ) : null}
        </div>
      </form>
      {value.trim() ? (
        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-20">
          <SearchSuggestions suggestions={suggestions} />
        </div>
      ) : null}
    </div>
  );
}
