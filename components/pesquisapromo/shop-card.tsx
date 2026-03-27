import Link from "next/link";
import type { Shop } from "@/lib/pesquisapromo-types";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      href={shop.targetRoute}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">Lojinha</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">{shop.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{shop.summary}</p>
      <span className="mt-4 inline-block text-sm font-medium text-slate-900">Ver a lojinha</span>
    </Link>
  );
}
