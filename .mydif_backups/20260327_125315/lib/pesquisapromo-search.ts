import { cityDestinations, getOffersByShopSlug, offers, shops, streets } from "./pesquisapromo-city-data";
import type { CityDestination, SearchIntentResult } from "./pesquisapromo-types";

function normalize(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function includesNormalized(source: string, query: string) {
  return normalize(source).includes(normalize(query));
}

export function getSearchSuggestions(query: string): CityDestination[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return cityDestinations.slice(0, 6);
  }

  return cityDestinations
    .filter((destination) => {
      return (
        includesNormalized(destination.name, normalizedQuery) ||
        includesNormalized(destination.summary, normalizedQuery) ||
        destination.keywords.some((keyword) => includesNormalized(keyword, normalizedQuery))
      );
    })
    .slice(0, 8);
}

export function resolveCityDestination(query: string): CityDestination | null {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  if (normalizedQuery.includes("geladeira")) {
    return cityDestinations.find((item) => item.slug === "comparador-de-geladeiras") ?? null;
  }

  if (normalizedQuery.includes("tenis") || normalizedQuery.includes("tênis")) {
    return cityDestinations.find((item) => item.slug === "outlet-do-tenis") ?? null;
  }

  if (normalizedQuery.includes("achado")) {
    return cityDestinations.find((item) => item.slug === "achado-do-dia") ?? null;
  }

  if (normalizedQuery.includes("promoc")) {
    return cityDestinations.find((item) => item.slug === "grandes-promocoes") ?? null;
  }

  if (normalizedQuery.includes("fone")) {
    return cityDestinations.find((item) => item.slug === "outlet-do-tenis") ?? null;
  }

  return getSearchSuggestions(query)[0] ?? null;
}

export function searchCityNavigation(query: string): SearchIntentResult {
  const normalizedQuery = normalize(query);
  const destinations = getSearchSuggestions(query);
  const bestPath = resolveCityDestination(query);

  const relatedOffers = offers.filter((offer) => {
    return (
      includesNormalized(offer.title, normalizedQuery) ||
      includesNormalized(offer.streetSlug, normalizedQuery) ||
      includesNormalized(offer.shopSlug, normalizedQuery)
    );
  });

  const relatedShops = shops.filter((shop) => {
    return (
      includesNormalized(shop.name, normalizedQuery) ||
      includesNormalized(shop.summary, normalizedQuery) ||
      shop.keywords.some((keyword) => includesNormalized(keyword, normalizedQuery))
    );
  });

  const relatedStreets = streets.filter((street) => {
    return (
      includesNormalized(street.name, normalizedQuery) ||
      includesNormalized(street.summary, normalizedQuery) ||
      street.keywords.some((keyword) => includesNormalized(keyword, normalizedQuery))
    );
  });

  if (bestPath?.slug === "comparador-de-geladeiras" && relatedOffers.length === 0) {
    relatedOffers.push(...getOffersByShopSlug("comparador-de-geladeiras"));
  }

  if (bestPath?.slug === "achado-do-dia" && relatedOffers.length === 0) {
    relatedOffers.push(...getOffersByShopSlug("achado-do-dia"));
  }

  return {
    query,
    normalizedQuery,
    bestPath,
    destinations,
    relatedOffers: relatedOffers.slice(0, 6),
    relatedShops: relatedShops.slice(0, 4),
    relatedStreets: relatedStreets.slice(0, 4),
  };
}
