"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSearchSuggestions, resolveDestination } from "@/lib/city-data";

type Props = {
  label: string;
  title: string;
  description: string;
  placeholder: string;
  submitLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const kindLabel = {
  area: "Area",
  shop: "Lojinha",
  offer: "Oferta",
} as const;

export function CityNavigator({
  label,
  title,
  description,
  placeholder,
  submitLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const suggestions = getSearchSuggestions(query);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();

    if (!normalized) {
      return;
    }

    const destination = resolveDestination(normalized);

    if (destination) {
      router.push(destination.route);
      return;
    }

    router.push(`/busca?q=${encodeURIComponent(normalized)}`);
  }

  return (
    <section className="rounded-[2rem] border border-[var(--city-line)] bg-white/88 p-5 shadow-[0_24px_80px_rgba(14,29,63,0.08)] backdrop-blur md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--city-blue)]">
        {label}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--city-ink)]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--city-muted)]">
        {description}
      </p>

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="min-h-14 flex-1 rounded-[1.2rem] border border-[var(--city-line)] bg-[var(--city-soft)] px-5 text-base outline-none transition placeholder:text-slate-400 focus:border-[var(--city-blue)] focus:bg-white"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="inline-flex min-h-14 items-center justify-center rounded-[1.2rem] bg-[var(--city-blue)] px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--city-blue-deep)]"
            >
              {submitLabel}
            </button>
            {secondaryHref && secondaryLabel ? (
              <button
                type="button"
                onClick={() => router.push(secondaryHref)}
                className="inline-flex min-h-14 items-center justify-center rounded-[1.2rem] border border-[var(--city-line)] bg-white px-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--city-ink)] transition hover:border-[var(--city-blue)]"
              >
                {secondaryLabel}
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={`${suggestion.kind}-${suggestion.title}-${suggestion.route}`}
              type="button"
              onClick={() => router.push(suggestion.route)}
              className="flex items-start justify-between gap-3 rounded-[1.2rem] border border-transparent bg-[var(--city-soft)] px-4 py-3 text-left transition hover:border-[var(--city-blue)] hover:bg-white"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--city-ink)]">{suggestion.title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--city-muted)]">{suggestion.subtitle}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--city-blue)]">
                {kindLabel[suggestion.kind]}
              </span>
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
