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
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
          >
            Buscar
          </button>
          {showTaxiShortcut ? (
            <button
              type="button"
              onClick={() => router.push(`/taxi-virtual?q=${encodeURIComponent(value.trim())}`)}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900"
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
