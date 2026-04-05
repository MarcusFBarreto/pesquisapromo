"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export function HeroDemandForm() {
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Force client-side mount to avoid hydration mismatch with stale SSR cache
  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    router.push(`/solicitar?q=${encodeURIComponent(inputValue.trim())}`);
  }

  if (!mounted) {
    return (
      <div className="h-14 w-full animate-pulse rounded-full bg-slate-100" />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <input
        id="demand-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="h-14 flex-1 rounded-full border border-emerald-100 bg-white px-6 text-base text-slate-900 font-semibold outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm sm:h-14"
        placeholder="O que você quer myLupar? (ex: peça rara, urgência)"
        required
      />
      <button
        id="demand-submit"
        type="submit"
        className="h-14 shrink-0 rounded-full bg-pp-orange px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-pp-orange-hover hover:shadow-xl hover:shadow-pp-orange/20 active:scale-[0.98] sm:h-14 mobile-btn-soft solar-shimmer-effect"
      >
        myLupar Agora
      </button>
    </form>
  );
}
