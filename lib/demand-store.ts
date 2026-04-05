import { adminDb } from "./firebase-admin";
import { Demand, DemandStatus } from "./mock-demands";
import { classifyDemand } from "./category-router";
import { isBlocked } from "./blocklist-service";
import { getAllPartners } from "./partner-data";

/**
 * Firestore-backed demand store.
 * Replaces the old in-memory array.
 */

import { getUserReputation } from "./user-service";

export async function addDemand(payload: {
  request: string;
  details?: string;
  name?: string;
  whatsapp: string;
}): Promise<Demand & { verificationRequired: boolean }> {
  const categories = classifyDemand(payload.request, payload.details);
  const reputation = await getUserReputation(payload.whatsapp);
  
  const demandsRef = adminDb.collection('demands');
  const docRef = demandsRef.doc();

  const isTrusted = reputation.isTrusted;

  const demandData = {
    id: docRef.id,
    request: payload.request,
    details: payload.details || "",
    name: payload.name || "Anônimo",
    whatsapp: payload.whatsapp.replace(/\D/g, ""),
    status: isTrusted ? "pending" : "verifying",
    vCode: isTrusted ? null : Math.floor(1000 + Math.random() * 9000).toString(),
    matchedCategories: categories,
    createdAt: new Date(),
  };

  await docRef.set({
    ...demandData,
    createdAt: new Date(), // Saved correctly in Firestore
  });

  const demand = demandData as Demand;

  const staticTargets = getAllPartners()
    .filter((p) => categories.includes(p.category))
    .filter((p) => !isBlocked(p.slug, demand.whatsapp));

  // Count Firestore targets
  const firestoreSnapshot = await adminDb.collection('partners')
    .where('category', 'in', categories.length > 0 ? categories : ["none"])
    .get();
  
  const firestoreTargetsCount = firestoreSnapshot.size;
  const totalTargets = staticTargets.length + firestoreTargetsCount;
  
  console.info(`[myLupa] 🔥 Demanda salva no Firestore: #${demand.id} (Status: ${demand.status})`);
  return { ...demand, verificationRequired: !isTrusted };
}

export async function getDemandsForPartner(partnerSlug: string, partnerCategory: string): Promise<Demand[]> {
  const snapshot = await adminDb.collection('demands')
    .where('matchedCategories', 'array-contains', partnerCategory)
    .where('status', '==', 'pending') // Only show pending demands to partners
    .get();

  // Fetch Persona Non Grata list for this partner
  const pngSnapshot = await adminDb.collection('peer_reputation')
    .where('providerId', '==', partnerSlug)
    .where('status', '==', 'persona_non_grata')
    .get();
  
  const pngUserIds = new Set(pngSnapshot.docs.map(doc => doc.data().userId));

  const demands: Demand[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const whatsapp = data.whatsapp.replace(/\D/g, "");
    
    // Filter out if user is blocked or is Persona Non Grata
    const blocked = await isBlocked(partnerSlug, whatsapp);
    if (!blocked && !pngUserIds.has(whatsapp)) {
      demands.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Demand);
    }
  }

  // Manual sort to avoid index requirement for now
  demands.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return demands;
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
