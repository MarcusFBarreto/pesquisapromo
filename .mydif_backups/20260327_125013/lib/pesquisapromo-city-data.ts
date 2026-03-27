import { rankOffers } from "./pesquisapromo-verified-discount";
import type { CityDestination, Offer, OfferInput, Shop, Store, Street } from "./pesquisapromo-types";

export const stores: Store[] = [
  { id: "loja-frio-certo", name: "Frio Certo", slug: "frio-certo", rating: 4.8 },
  { id: "casa-nova", name: "Casa Nova", slug: "casa-nova", rating: 4.6 },
  { id: "passo-firme", name: "Passo Firme", slug: "passo-firme", rating: 4.7 },
  { id: "som-de-bolso", name: "Som de Bolso", slug: "som-de-bolso", rating: 4.5 },
  { id: "cozinha-pratica", name: "Cozinha Prática", slug: "cozinha-pratica", rating: 4.4 },
];

export const streets: Street[] = [
  {
    id: "avenida-grandes-promocoes",
    name: "Avenida Grandes Promoções",
    slug: "avenida-grandes-promocoes",
    kind: "avenue",
    summary: "Destaques fortes da cidade, com ofertas priorizadas por evidência e confiança.",
    keywords: ["promoções", "promocoes", "descontos", "ofertas", "avenida"],
    targetRoute: "/avenidas/avenida-grandes-promocoes",
  },
  {
    id: "rua-da-casa",
    name: "Rua da Casa",
    slug: "rua-da-casa",
    kind: "street",
    summary: "Eletrodomésticos e itens de casa com foco em utilidade real.",
    keywords: ["geladeira", "air fryer", "casa", "cozinha", "eletrodomésticos", "eletrodomesticos"],
    targetRoute: "/ruas/rua-da-casa",
  },
  {
    id: "rua-dos-calcados",
    name: "Rua dos Calçados",
    slug: "rua-dos-calcados",
    kind: "street",
    summary: "Tênis, sandálias e vitrines para quem quer comparar antes de decidir.",
    keywords: ["tênis", "tenis", "calçados", "calcados", "sapato"],
    targetRoute: "/ruas/rua-dos-calcados",
  },
  {
    id: "travessa-dos-achadinhos",
    name: "Travessa dos Achadinhos",
    slug: "travessa-dos-achadinhos",
    kind: "travessa",
    summary: "Uma vitrine mais ágil, com achados em destaque e retorno diário.",
    keywords: ["achado", "achadinhos", "oferta do dia", "achado do dia"],
    targetRoute: "/ruas/travessa-dos-achadinhos",
  },
];

export const shops: Shop[] = [
  {
    id: "comparador-de-geladeiras",
    name: "Comparador de Geladeiras",
    slug: "comparador-de-geladeiras",
    streetSlug: "rua-da-casa",
    kind: "comparison",
    summary: "Compara modelos e destaca quedas reais de preço dentro da própria loja.",
    keywords: ["geladeira", "refrigerador", "frost free", "duplex"],
    targetRoute: "/lojas/comparador-de-geladeiras",
  },
  {
    id: "achado-do-dia",
    name: "Achado do Dia",
    slug: "achado-do-dia",
    streetSlug: "travessa-dos-achadinhos",
    kind: "daily-deal",
    summary: "Uma oferta central com leitura rápida e sinais de confiança.",
    keywords: ["achado", "oferta do dia", "desconto verificado"],
    targetRoute: "/lojas/achado-do-dia",
  },
  {
    id: "outlet-do-tenis",
    name: "Outlet do Tênis",
    slug: "outlet-do-tenis",
    streetSlug: "rua-dos-calcados",
    kind: "general",
    summary: "Tênis em vitrines comparáveis, com leitura rápida de preço recente.",
    keywords: ["tenis", "corrida", "casual", "esportivo"],
    targetRoute: "/lojas/outlet-do-tenis",
  },
];

const offerInputs: OfferInput[] = [
  {
    id: "geladeira-brastemp-1",
    productId: "geladeira-brastemp-bro85",
    storeId: "loja-frio-certo",
    streetSlug: "rua-da-casa",
    shopSlug: "comparador-de-geladeiras",
    title: "Geladeira Brastemp Frost Free 375L",
    currentPrice: 2899,
    previousPrice: 3499,
    rating: 4.8,
    history: [
      { date: "2026-02-28", price: 3499 },
      { date: "2026-03-05", price: 3449 },
      { date: "2026-03-12", price: 3399 },
      { date: "2026-03-19", price: 3299 },
      { date: "2026-03-26", price: 2899 },
    ],
  },
  {
    id: "geladeira-electrolux-2",
    productId: "geladeira-electrolux-if43",
    storeId: "casa-nova",
    streetSlug: "rua-da-casa",
    shopSlug: "comparador-de-geladeiras",
    title: "Geladeira Electrolux Inverter 390L",
    currentPrice: 3199,
    previousPrice: 3249,
    rating: 4.6,
    history: [
      { date: "2026-03-03", price: 3259 },
      { date: "2026-03-10", price: 3249 },
      { date: "2026-03-17", price: 3229 },
      { date: "2026-03-24", price: 3219 },
      { date: "2026-03-26", price: 3199 },
    ],
  },
  {
    id: "tenis-urban-run",
    productId: "tenis-urban-run",
    storeId: "passo-firme",
    streetSlug: "rua-dos-calcados",
    shopSlug: "outlet-do-tenis",
    title: "Tênis Urban Run Knit",
    currentPrice: 239.9,
    previousPrice: 299.9,
    rating: 4.7,
    history: [
      { date: "2026-03-08", price: 299.9 },
      { date: "2026-03-15", price: 294.9 },
      { date: "2026-03-22", price: 289.9 },
      { date: "2026-03-26", price: 239.9 },
    ],
  },
  {
    id: "fone-wave-pro",
    productId: "fone-wave-pro",
    storeId: "som-de-bolso",
    streetSlug: "rua-dos-calcados",
    shopSlug: "outlet-do-tenis",
    title: "Fone Bluetooth Wave Pro",
    currentPrice: 179.9,
    previousPrice: 189.9,
    rating: 4.5,
    history: [
      { date: "2026-03-20", price: 189.9 },
      { date: "2026-03-26", price: 179.9 },
    ],
  },
  {
    id: "air-fryer-pratica-5l",
    productId: "air-fryer-pratica-5l",
    storeId: "cozinha-pratica",
    streetSlug: "travessa-dos-achadinhos",
    shopSlug: "achado-do-dia",
    title: "Air Fryer Prática 5L",
    currentPrice: 299.9,
    previousPrice: 419.9,
    rating: 4.4,
    history: [
      { date: "2026-02-27", price: 419.9 },
      { date: "2026-03-06", price: 399.9 },
      { date: "2026-03-13", price: 389.9 },
      { date: "2026-03-20", price: 379.9 },
      { date: "2026-03-26", price: 299.9 },
    ],
  },
];

export const offers: Offer[] = rankOffers(offerInputs);

export const cityDestinations: CityDestination[] = [
  ...streets.map((street) => ({
    id: street.id,
    type: street.kind === "avenue" ? "avenue" : "street",
    name: street.name,
    slug: street.slug,
    summary: street.summary,
    keywords: street.keywords,
    targetRoute: street.targetRoute,
  })),
  ...shops.map((shop) => ({
    id: shop.id,
    type: "shop" as const,
    name: shop.name,
    slug: shop.slug,
    summary: shop.summary,
    keywords: shop.keywords,
    targetRoute: shop.targetRoute,
  })),
  ...offers.slice(0, 4).map((offer) => ({
    id: offer.id,
    type: "offer" as const,
    name: offer.title,
    slug: offer.id,
    summary: offer.verifiedDiscount
      ? "Queda real baseada no histórico desta loja."
      : "Oferta encontrada na cidade.",
    keywords: [offer.title.toLowerCase(), offer.shopSlug, offer.streetSlug],
    targetRoute: `/busca?q=${encodeURIComponent(offer.title)}`,
  })),
];

export function getStreetBySlug(slug: string) {
  return streets.find((street) => street.slug === slug) ?? null;
}

export function getShopBySlug(slug: string) {
  return shops.find((shop) => shop.slug === slug) ?? null;
}

export function getOffersByStreetSlug(streetSlug: string) {
  return offers.filter((offer) => offer.streetSlug === streetSlug);
}

export function getOffersByShopSlug(shopSlug: string) {
  return offers.filter((offer) => offer.shopSlug === shopSlug);
}

export function getStoreById(storeId: string) {
  return stores.find((store) => store.id === storeId) ?? null;
}

export function getTopOffers(limit = 4) {
  return offers.slice(0, limit);
}
