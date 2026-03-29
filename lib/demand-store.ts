import { Demand, DemandStatus } from "./mock-demands";
import { classifyDemand } from "./category-router";
import { isBlocked } from "./blocklist-service";
import { getAllPartners } from "./partner-data";

/**
 * In-memory demand store.
 * 
 * This is the central data layer for demands. In production,
 * this would be Firestore queries. For now, it keeps state
 * in-memory on the server and syncs with the client via API.
 */

// Seed data
const SEED_DEMANDS: Demand[] = [
  {
    id: "d-001",
    request: "50 sacos de cimento CP2",
    details: "Preciso de entrega em Horizonte, obra residencial no bairro Paz. Pode ser CP2 ou CP5 se tiver melhor preço.",
    name: "Marcus",
    whatsapp: "85999991111",
    status: "new",
    matchedCategories: ["Construção e Reforma", "Casa e Eletro"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "d-002",
    request: "Geladeira frost free 375L",
    details: "Voltagem 220V, preferência por Electrolux ou Consul. Preciso de entrega e instalação.",
    name: "Ana Paula",
    whatsapp: "85988882222",
    status: "new",
    matchedCategories: ["Casa e Eletro", "Móveis e Decoração"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "d-003",
    request: "Fogão 5 bocas com forno",
    details: "Pode ser qualquer marca boa, mesa de vidro. Entrega no centro de Horizonte.",
    name: "João Marcos",
    whatsapp: "85966664444",
    status: "responded",
    matchedCategories: ["Casa e Eletro"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

// The live store — starts with seed data
let demands: Demand[] = [...SEED_DEMANDS];
let nextId = 100;

/**
 * Add a new demand to the store.
 * Automatically classifies it by category via the router.
 */
export function addDemand(payload: {
  request: string;
  details?: string;
  name?: string;
  whatsapp: string;
}): Demand {
  const categories = classifyDemand(payload.request, payload.details);
  
  const demand: Demand = {
    id: `d-${++nextId}`,
    request: payload.request,
    details: payload.details,
    name: payload.name || "Anônimo",
    whatsapp: payload.whatsapp.replace(/\D/g, ""),
    status: "new",
    matchedCategories: categories,
    createdAt: new Date(),
  };

  demands.unshift(demand); // newest first
  
  // Log routing info
  const targets = getAllPartners()
    .filter((p) => categories.includes(p.category))
    .filter((p) => !isBlocked(p.slug, demand.whatsapp));
  
  console.info(
    `[PesquisaPromo] ✅ Nova demanda #${demand.id}: "${demand.request}"` +
    `\n  → Categorias: ${categories.join(", ")}` +
    `\n  → Enviada para ${targets.length} parceiro(s): ${targets.map((p) => p.name).join(", ")}`
  );

  return demand;
}

/**
 * Get demands for a specific partner based on their category.
 * Excludes blocked clients.
 */
export function getDemandsForPartner(partnerSlug: string, partnerCategory: string): Demand[] {
  return demands
    .filter((d) => d.matchedCategories.includes(partnerCategory))
    .filter((d) => !isBlocked(partnerSlug, d.whatsapp))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Update the status of a demand.
 */
export function updateDemandStatus(id: string, status: DemandStatus): void {
  const demand = demands.find((d) => d.id === id);
  if (demand) {
    demand.status = status;
  }
}

/**
 * Get all demands (for debugging).
 */
export function getAllDemands(): Demand[] {
  return [...demands];
}
