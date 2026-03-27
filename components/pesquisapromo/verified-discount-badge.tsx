import type { VerifiedDiscountResult } from "@/lib/pesquisapromo-types";

type Props = Pick<
  VerifiedDiscountResult,
  "verifiedDiscount" | "verifiedDiscountLabel" | "percentBelowRecent" | "confidence"
> & {
  compact?: boolean;
};

export function VerifiedDiscountBadge({
  verifiedDiscount,
  verifiedDiscountLabel,
  percentBelowRecent,
  confidence,
  compact = false,
}: Props) {
  const title = verifiedDiscount ? "Desconto verificado" : verifiedDiscountLabel;
  const subtitle =
    verifiedDiscount && percentBelowRecent
      ? `${percentBelowRecent}% abaixo do preço recente`
      : "Baseado no histórico desta loja";

  return (
    <div
      className={
        compact
          ? "inline-flex flex-col rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left"
          : "flex flex-col rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left"
      }
    >
      <span className="text-sm font-semibold text-emerald-800">{title}</span>
      <span className="text-xs text-emerald-700">{subtitle}</span>
      {!compact ? <span className="mt-1 text-[11px] text-emerald-700/80">Confiança: {confidence}</span> : null}
    </div>
  );
}
