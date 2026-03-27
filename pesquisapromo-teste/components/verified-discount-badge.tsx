import type { DiscountAssessment } from "@/lib/verified-discount";

const toneClasses: Record<DiscountAssessment["status"], string> = {
  verified: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "recent-low": "border-amber-200 bg-amber-50 text-amber-800",
  insufficient: "border-slate-200 bg-slate-100 text-slate-700",
};

export function VerifiedDiscountBadge({ discount }: { discount: DiscountAssessment }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses[discount.status]}`}>
      <span>{discount.label}</span>
      {discount.percentage ? <span>{discount.percentage}%</span> : null}
    </div>
  );
}
