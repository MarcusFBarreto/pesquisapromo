import { Partner } from "./types";

/**
 * Static partner data (Legacy/Seeded)
 */
const staticPartners: Partner[] = [
  {
    id: "p1",
    slug: "loja-eletro-piloto",
    name: "Eletro Piloto",
    tagline: "Eletrodomesticos e utilidades para o lar",
    category: "Casa e Eletro",
    city: "Piloto",
    region: "CE",
    description: "Loja referência no eixo da Castelo Branco em Piloto. Trabalha com geladeiras, fogões, lavadoras e utilidades domésticas com preço de cidade pequena e atendimento de vizinho.",
    services: ["Geladeiras", "Fogões", "Lavadoras", "Utilidades"],
    whatsapp: "85999990001",
    contact: { whatsapp: "85999990001" },
    featured: true,
    verified: true,
    brands: ["b1", "b2"],
    staffIds: [],
    reputationScore: 100
  },
  {
    id: "p2",
    slug: "papelaria-central-piloto",
    name: "Papelaria Central",
    tagline: "Material escolar, escritório e gráfica rápida",
    category: "Papelaria e Gráfica",
    city: "Piloto",
    region: "CE",
    description: "Papelaria completa no centro de Piloto. Atende escolas, escritórios e quem precisa de impressão, encadernação ou material de última hora.",
    services: ["Material Escolar", "Escritório", "Gráfica Rápida"],
    whatsapp: "85999990002",
    contact: { whatsapp: "85999990002" },
    featured: true,
    verified: true,
    brands: ["b3"],
    staffIds: [],
    reputationScore: 100
  }
];

export function getAllPartners(): Partner[] {
  return staticPartners;
}

export function getPartnerBySlug(slug: string): Partner | undefined {
  return staticPartners.find((p) => p.slug === slug);
}

export async function getPartnerBySlugAsync(slug: string): Promise<Partner | null> {
  // 1. Check static partners
  const staticPartner = getPartnerBySlug(slug);
  if (staticPartner) return staticPartner;

  // 2. Check Firestore
  if (typeof window === "undefined") {
    try {
      const { adminDb } = await import("./firebase-admin");
      const snapshot = await adminDb.collection("partners").where("slug", "==", slug).limit(1).get();
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        return {
          ...data,
          id: snapshot.docs[0].id,
        } as Partner;
      }
    } catch (err) {
      console.error("Error fetching partner from Firestore:", err);
    }
  }

  return null;
}

