import { getAllPartners } from "./partner-data";

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  brand: string;
  producer: string;
  endDate: Date;
  supplierSlug: string;
  category: string;
  image?: string;
}

// Mock Offers for myPromos v1.2.0
export const mockOffers: Offer[] = [
  {
    id: "o-001",
    title: "Geladeira Brastemp Frost Free 375L",
    description: "Branca, 220V. Ideal para famílias pequenas.",
    price: 2899,
    originalPrice: 3499,
    discountPercentage: 17,
    brand: "Brastemp",
    producer: "Whirlpool",
    endDate: new Date("2026-04-15"),
    supplierSlug: "j-erivaldo-cia",
    category: "Casa e Eletro",
  },
  {
    id: "o-002",
    title: "Kit Escolar Completo 2026",
    description: "12 itens essenciais para o 5º ano.",
    price: 94.90,
    originalPrice: 129.90,
    discountPercentage: 27,
    brand: "Faber-Castell",
    producer: "Faber-Castell",
    endDate: new Date("2026-04-30"),
    supplierSlug: "art-ton-papelaria",
    category: "Papelaria e Gráfica",
  },
  {
    id: "o-003",
    title: "Vitamina C 1g + Zinco",
    description: "Tubo com 30 comprimidos efervescentes.",
    price: 39.90,
    originalPrice: 55.00,
    discountPercentage: 27,
    brand: "Redoxon",
    producer: "Bayer",
    endDate: new Date("2026-04-10"),
    supplierSlug: "farmacia-caminho-popular",
    category: "Saúde e Bem-estar",
  },
  {
    id: "o-004",
    title: "Air Fryer Mondial 4L Family",
    description: "Preta, 1500W. Controle de temperatura até 200°C.",
    price: 299.00,
    originalPrice: 449.00,
    discountPercentage: 33,
    brand: "Mondial",
    producer: "Mondial",
    endDate: new Date("2026-04-05"),
    supplierSlug: "loja-eletro-piloto",
    category: "Casa e Eletro",
  },
  {
    id: "o-005",
    title: "Cimento CP2 Zebu 50kg",
    description: "Ideal para todas as fases da obra.",
    price: 38.00,
    originalPrice: 42.00,
    discountPercentage: 9,
    brand: "Zebu",
    producer: "Votorantim",
    endDate: new Date("2026-04-20"),
    supplierSlug: "loja-eletro-piloto",
    category: "Construção e Reforma",
  }
];

export type OfferSort = "promo" | "price_asc" | "price_desc" | "date";

export interface OfferFilters {
  producer?: string;
  brand?: string;
  supplierSlug?: string;
  category?: string;
}

/**
 * Get offers with filtering and sorting
 */
export function getOffers(sort: OfferSort = "promo", filters?: OfferFilters): Offer[] {
  let result = [...mockOffers];

  // Filters
  if (filters) {
    if (filters.producer) result = result.filter(o => o.producer.toLowerCase().includes(filters.producer!.toLowerCase()));
    if (filters.brand) result = result.filter(o => o.brand.toLowerCase() === filters.brand!.toLowerCase());
    if (filters.supplierSlug) result = result.filter(o => o.supplierSlug === filters.supplierSlug);
    if (filters.category) result = result.filter(o => o.category === filters.category);
  }

  // Sorting
  switch (sort) {
    case "promo":
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
      break;
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "date":
      result.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
      break;
  }

  return result;
}

export function getSupplierName(slug: string): string {
  const partner = getAllPartners().find(p => p.slug === slug);
  return partner ? partner.name : slug;
}

