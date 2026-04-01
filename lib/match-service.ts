import { Offer, mockOffers } from "./offers-store";

export interface MatchedOffer extends Offer {
  matchScore: number; // 0 to 100
  matchReason: string;
}

/**
 * Apollo Match Engine (v0)
 * Uses keyword correlation and category overlap to find matches.
 */
export function findMatchesForDemand(demandText: string, category?: string): MatchedOffer[] {
  const cleanDemand = demandText.toLowerCase();
  
  return mockOffers
    .map(offer => {
      let score = 0;
      let reasons: string[] = [];

      // 1. Category Overlap
      if (category && offer.category === category) {
        score += 40;
        reasons.push("Mesma categoria");
      }

      // 2. Keyword matching in title
      const titleWords = offer.title.toLowerCase().split(" ");
      const matchedWords = titleWords.filter(word => word.length > 3 && cleanDemand.includes(word));
      
      if (matchedWords.length > 0) {
        score += Math.min(60, matchedWords.length * 20);
        reasons.push(`Palavras-chave: ${matchedWords.join(", ")}`);
      }

      // 3. Brand matching
      if (cleanDemand.includes(offer.brand.toLowerCase())) {
        score += 30;
        reasons.push(`Marca identificada: ${offer.brand}`);
      }

      return {
        ...offer,
        matchScore: Math.min(100, score),
        matchReason: reasons.join(" · ")
      };
    })
    .filter(match => match.matchScore >= 40) // Threshold for a "BOOM"
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); // Top 3 matches
}
