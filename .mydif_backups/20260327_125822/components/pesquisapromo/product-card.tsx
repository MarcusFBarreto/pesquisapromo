import { getStoreById } from "@/lib/pesquisapromo-city-data";
import type { Offer } from "@/lib/pesquisapromo-types";
import { PriceHistoryHint } from "./price-history-hint";
import { VerifiedDiscountBadge } from "./verified-discount-badge";

export function ProductCard({ offer }: { offer: Offer }) {
  const store = getStoreById(offer.storeId);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">{store?.name ?? "Loja parceira"}</p>
          <h3 className="text-lg font-semibold text-slate-900">{offer.title}</h3>
          <p className="text-sm text-slate-600">Avaliação: {offer.rating?.toFixed(1) ?? "—"}</p>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold text-slate-900">R$ {offer.currentPrice.toFixed(2)}</span>
            {offer.previousPrice ? (
              <span className="text-sm text-slate-400 line-through">R$ {offer.previousPrice.toFixed(2)}</span>
            ) : null}
          </div>
        </div>
        <div className="min-w-[220px]">
          <VerifiedDiscountBadge
            verifiedDiscount={offer.verifiedDiscount}
            verifiedDiscountLabel={offer.verifiedDiscountLabel}
            percentBelowRecent={offer.percentBelowRecent}
            confidence={offer.confidence}
          />
        </div>
      </div>
      <div className="mt-4">
        <PriceHistoryHint
          recentAveragePrice={offer.recentAveragePrice}
          evidenceCount={offer.evidenceCount}
        />
      </div>
      <div className="mt-4">
        <button className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">Ver oferta</button>
      </div>
    </article>
  );
}
