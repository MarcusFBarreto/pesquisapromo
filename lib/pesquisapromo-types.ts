export type CityDestinationType = "street" | "avenue" | "shop" | "offer";

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  rating?: number;
}

export interface CityDestination {
  id: string;
  type: CityDestinationType;
  name: string;
  slug: string;
  summary: string;
  keywords: string[];
  targetRoute: string;
}

export interface OfferInput {
  id: string;
  productId: string;
  storeId: string;
  streetSlug: string;
  shopSlug: string;
  title: string;
  currentPrice: number;
  previousPrice?: number;
  rating?: number;
  history: PriceHistoryPoint[];
}

export interface VerifiedDiscountResult {
  verifiedDiscount: boolean;
  verifiedDiscountLabel: string;
  confidence: "alta" | "media" | "baixa";
  recentAveragePrice: number | null;
  percentBelowRecent: number | null;
  evidenceCount: number;
  rankingScore: number;
}

export interface Offer extends OfferInput, VerifiedDiscountResult {}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  streetSlug: string;
  kind: "comparison" | "daily-deal" | "general";
  summary: string;
  keywords: string[];
  targetRoute: string;
}

export interface Street {
  id: string;
  name: string;
  slug: string;
  kind: "street" | "avenue" | "travessa";
  summary: string;
  keywords: string[];
  targetRoute: string;
}

export interface SearchIntentResult {
  query: string;
  normalizedQuery: string;
  bestPath: CityDestination | null;
  destinations: CityDestination[];
  relatedOffers: Offer[];
  relatedShops: Shop[];
  relatedStreets: Street[];
}
