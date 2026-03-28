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
    slug: "grandes-promocoes",
    kind: "avenue",
    summary: "Destaques fortes da cidade, com ofertas priorizadas por evidência e confiança.",
    keywords: ["promoções", "promocoes", "descontos", "ofertas", "avenida"],
    targetRoute: "/avenidas/grandes-promocoes",
  },
  {
    id: "rua-da-casa",
    name: "Rua da Casa",
    slug: "casa",
    kind: "street",
    summary: "Eletrodomésticos e itens de casa com foco em utilidade real.",
    keywords: ["geladeira", "air fryer", "casa", "cozinha", "eletrodomésticos", "eletrodomesticos"],
    targetRoute: "/ruas/casa",
  },
  {
    id: "rua-dos-calcados",
    name: "Rua dos Calçados",
    slug: "calcados",
    kind: "street",
    summary: "Tênis, sandálias e vitrines para quem quer comparar antes de decidir.",
    keywords: ["tênis", "tenis", "calçados", "calcados", "sapato"],
    targetRoute: "/ruas/calcados",
  },
  {
    id: "rua-dos-testes",
    name: "Rua dos Testes",
    slug: "testes",
    kind: "street",
    summary: "Laboratório vivo da cidade, onde experiências, buscas e vitrines são validadas.",
    keywords: ["testes", "laboratorio", "sandbox", "achado", "achado do dia"],
    targetRoute: "/ruas/testes",
  },
  {
    id: "rua-dos-servicos",
    name: "Rua dos Serviços",
    slug: "servicos",
    kind: "street",
    summary: "Apoios, conveniências e atalhos úteis para quem quer resolver rápido.",
    keywords: ["serviços", "servicos", "fone", "acessorios", "utilidade"],
    targetRoute: "/ruas/servicos",
  },
];

export const shops: Shop[] = [
  {
    id: "comparador-de-geladeiras",
    name: "Comparador de Geladeiras",
    slug: "comparador-de-geladeiras",
    streetSlug: "casa",
    kind: "comparison",
    summary: "Compara modelos e destaca quedas reais de preço dentro da própria loja.",
    keywords: ["geladeira", "refrigerador", "frost free", "duplex"],
    targetRoute: "/lojas/comparador-de-geladeiras",
  },
  {
    id: "achado-do-dia",
    name: "Achado do Dia",
    slug: "achado-do-dia",
    streetSlug: "testes",
    kind: "daily-deal",
    summary: "Uma oferta central com leitura rápida e sinais de confiança, validada primeiro no laboratório da cidade.",
    keywords: ["achado", "oferta do dia", "desconto verificado", "sandbox", "testes"],
    targetRoute: "/lojas/achado-do-dia",
  },
  {
    id: "outlet-do-tenis",
    name: "Outlet do Tênis",
    slug: "outlet-do-tenis",
    streetSlug: "calcados",
    kind: "general",
    summary: "Tênis em vitrines comparáveis, com leitura rápida de preço recente.",
    keywords: ["tenis", "corrida", "casual", "esportivo"],
    targetRoute: "/lojas/outlet-do-tenis",
  },
  {
    id: "lojinha-alfa",
    name: "Lojinha Alfa",
    slug: "lojinha-alfa",
    streetSlug: "testes",
    kind: "general",
    summary: "Sandbox oficial da cidade para validar experiências, busca e vitrine.",
    keywords: ["lojinha alfa", "sandbox", "testes", "laboratorio"],
    targetRoute: "/lojas/lojinha-alfa",
  },
];

const offerInputs: OfferInput[] = [
  {
    id: "geladeira-brastemp-1",
    productId: "geladeira-brastemp-bro85",
    storeId: "loja-frio-certo",
    streetSlug: "casa",
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
    streetSlug: "casa",
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
    streetSlug: "calcados",
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
    streetSlug: "servicos",
    shopSlug: "lojinha-alfa",
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
    streetSlug: "testes",
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
  {
    id: "sandbox-alpha-1",
    productId: "sandbox-alpha-1",
    storeId: "som-de-bolso",
    streetSlug: "testes",
    shopSlug: "lojinha-alfa",
    title: "Oferta Sandbox Alpha",
    currentPrice: 129.9,
    previousPrice: 159.9,
    rating: 4.3,
    history: [
      { date: "2026-03-04", price: 159.9 },
      { date: "2026-03-11", price: 154.9 },
      { date: "2026-03-18", price: 149.9 },
      { date: "2026-03-26", price: 129.9 },
    ],
  },
];

export const offers: Offer[] = rankOffers(offerInputs);

export const cityDestinations: CityDestination[] = [
  ...streets.map((street) => ({
    id: street.id,
    type: street.kind === "avenue" ? ("avenue" as const) : ("street" as const),
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
