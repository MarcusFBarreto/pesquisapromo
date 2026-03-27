import type { OfferInput, PriceHistoryPoint, VerifiedDiscountResult } from "./pesquisapromo-types";

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function getRecentHistory(history: PriceHistoryPoint[], sampleSize = 4): PriceHistoryPoint[] {
  return [...history].sort((a, b) => a.date.localeCompare(b.date)).slice(-sampleSize);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getVerifiedDiscount(input: OfferInput): VerifiedDiscountResult {
  const recentHistory = getRecentHistory(input.history);
  const evidenceCount = recentHistory.length;
  const recentAveragePrice = average(recentHistory.map((point) => point.price));

  if (!recentAveragePrice || evidenceCount < 2) {
    return {
      verifiedDiscount: false,
      verifiedDiscountLabel: "Evidência insuficiente",
      confidence: "baixa",
      recentAveragePrice,
      percentBelowRecent: null,
      evidenceCount,
      rankingScore: input.rating ?? 0,
    };
  }

  const percentBelowRecent = round(((recentAveragePrice - input.currentPrice) / recentAveragePrice) * 100);
  const hasMeaningfulDrop = percentBelowRecent >= 8;
  const hasEnoughEvidence = evidenceCount >= 4;

  let verifiedDiscount = false;
  let verifiedDiscountLabel = "Preço recente estável";
  let confidence: "alta" | "media" | "baixa" = "baixa";

  if (hasMeaningfulDrop && hasEnoughEvidence) {
    verifiedDiscount = true;
    verifiedDiscountLabel = "Desconto verificado";
    confidence = "alta";
  } else if (hasMeaningfulDrop) {
    verifiedDiscountLabel = "Queda real com evidência parcial";
    confidence = "media";
  } else if (percentBelowRecent > 0) {
    verifiedDiscountLabel = "Preço abaixo do recente";
    confidence = "media";
  }

  const rankingScore =
    (verifiedDiscount ? 100 : 0) +
    Math.max(percentBelowRecent, 0) * 2 +
    evidenceCount * 5 +
    (input.rating ?? 0) * 3;

  return {
    verifiedDiscount,
    verifiedDiscountLabel,
    confidence,
    recentAveragePrice: round(recentAveragePrice),
    percentBelowRecent: round(percentBelowRecent),
    evidenceCount,
    rankingScore: round(rankingScore),
  };
}

export function rankOffers<T extends OfferInput>(offers: T[]) {
  return offers
    .map((offer) => ({
      ...offer,
      ...getVerifiedDiscount(offer),
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore);
}
