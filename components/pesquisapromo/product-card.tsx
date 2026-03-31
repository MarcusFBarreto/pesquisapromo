import Link from "next/link";
import { getShopBySlug, getStoreById } from "@/lib/pesquisapromo-city-data";
import type { Offer } from "@/lib/pesquisapromo-types";
import { PriceHistoryHint } from "./price-history-hint";
import { VerifiedDiscountBadge } from "./verified-discount-badge";

export function ProductCard({ offer }: { offer: Offer }) {
  const store = getStoreById(offer.storeId);
  const shop = getShopBySlug(offer.shopSlug);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm glass-container-mobile sm:bg-white sm:shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mobile-text-anchor">{store?.name ?? "Loja parceira"}</p>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{offer.title}</h3>
          <p className="text-xs text-slate-400 font-medium mobile-text-anchor">Avaliação: {offer.rating?.toFixed(1) ?? "—"}</p>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-2xl font-black text-slate-900 tracking-tight">R$ {offer.currentPrice.toFixed(2)}</span>
            {offer.previousPrice ? (
              <span className="text-sm text-slate-300 line-through font-light">R$ {offer.previousPrice.toFixed(2)}</span>
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
        {shop ? (
          <Link
            href={shop.targetRoute}
            className="inline-flex rounded-xl bg-slate-900 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] mobile-btn-soft-dark solar-shimmer-effect"
          >
            Ver oferta
          </Link>
        ) : (
          <button
            className="rounded-xl bg-slate-300 px-4 py-3 text-sm font-medium text-slate-600"
            disabled
          >
            Oferta indisponivel
          </button>
        )}
      </div>
    </article>
  );
}
