import { adminDb } from "./firebase-admin";
import { Demand, DemandStatus } from "./mock-demands";
import { classifyDemand } from "./category-router";
import { isBlocked } from "./blocklist-service";
import { getAllPartners } from "./partner-data";

/**
 * Firestore-backed demand store.
 * Replaces the old in-memory array.
 */

export async function addDemand(payload: {
  request: string;
  details?: string;
  name?: string;
  whatsapp: string;
}): Promise<Demand> {
  const categories = classifyDemand(payload.request, payload.details);
  
  const demandsRef = adminDb.collection('demands');
  const docRef = demandsRef.doc();

  const demandData = {
    id: docRef.id,
    request: payload.request,
    details: payload.details || "",
    name: payload.name || "Anônimo",
    whatsapp: payload.whatsapp.replace(/\D/g, ""),
    status: "new",
    matchedCategories: categories,
    createdAt: new Date(),
  };

  await docRef.set({
    ...demandData,
    createdAt: new Date(), // Saved correctly in Firestore
  });

  const demand = demandData as Demand;

  const targets = getAllPartners()
    .filter((p) => categories.includes(p.category))
    .filter((p) => !isBlocked(p.slug, demand.whatsapp));
  
  console.info(`[PesquisaPromo] 🔥 Demanda salva no Firestore: #${demand.id} (${targets.length} alvos)`);
  return demand;
}

export async function getDemandsForPartner(partnerSlug: string, partnerCategory: string): Promise<Demand[]> {
  const snapshot = await adminDb.collection('demands')
    .where('matchedCategories', 'array-contains', partnerCategory)
    .orderBy('createdAt', 'desc')
    .get();

  const demands: Demand[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    demands.push({
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Demand);
  });

  return demands.filter((d) => !isBlocked(partnerSlug, d.whatsapp));
}

export async function updateDemandStatus(id: string, status: DemandStatus): Promise<void> {
  await adminDb.collection('demands').doc(id).update({ status });
}

export async function getAllDemands(): Promise<Demand[]> {
  const snapshot = await adminDb.collection('demands').orderBy('createdAt', 'desc').get();
  const demands: Demand[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    demands.push({
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Demand);
  });
  return demands;
}
