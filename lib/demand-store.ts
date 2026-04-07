import { adminDb } from "./firebase-admin";
import { Demand as MockDemand, DemandStatus as MockStatus } from "./mock-demands";
import { Demand } from "./types";
import { classifyDemand } from "./category-router";
import { isBlocked } from "./blocklist-service";
import { getAllPartners } from "./partner-data";
import { getOrCreateUser, getUserReputation } from "./user-service";
import { triggerAdminEmail } from "./email-service";

/**
 * Firestore-backed demand store.
 * Replaces the old in-memory array.
 */

export async function addDemand(payload: {
  request: string;
  details?: string;
  name?: string;
  whatsapp: string;
}): Promise<Demand & { verificationRequired: boolean }> {
  const categories = classifyDemand(payload.request, payload.details);
  
  // 1. Ensure user exists and get reputation
  const user = await getOrCreateUser(payload.whatsapp, payload.name);
  const reputation = user.reputation;
  
  const demandsRef = adminDb.collection('demands');
  const docRef = demandsRef.doc();

  const isTrusted = reputation.isTrusted;
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // 2. Initial matching to get targetPartnerIds
  const partners = getAllPartners().filter((p) => categories.includes(p.category));
  const blockChecks = await Promise.all(
    partners.map(async (p) => ({
      ...p,
      blocked: await isBlocked(p.slug, user.whatsapp),
    }))
  );
  const targetPartnerIds = blockChecks.filter((p) => !p.blocked).map(p => p.id || p.slug);

  const demandData: Demand = {
    id: docRef.id,
    userId: user.id,
    request: payload.request,
    details: payload.details || "",
    name: payload.name || user.name,
    whatsapp: user.whatsapp,
    status: isTrusted ? "pending" : "verifying",
    vCode: isTrusted ? null : Math.floor(1000 + Math.random() * 9000).toString(),
    matchedCategories: categories,
    targetPartnerIds,
    createdAt,
    expiresAt,
  };

  await docRef.set(demandData);

  console.info(`[myLupa] 🔥 Demanda salva no Firestore: #${demandData.id} (Status: ${demandData.status})`);
  
  if (isTrusted) {
    await triggerAdminEmail(demandData);
  }

  return { ...demandData, verificationRequired: !isTrusted };
}

export async function getDemandsForPartner(partnerSlug: string, partnerCategory: string): Promise<Demand[]> {
  const snapshot = await adminDb.collection('demands')
    .where('matchedCategories', 'array-contains', partnerCategory)
    .where('status', '==', 'pending') 
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
        expiresAt: data.expiresAt?.toDate() || new Date(),
      } as Demand);
    }
  }

  // Manual sort to avoid index requirement for now
  demands.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return demands;
}

export async function updateDemandStatus(id: string, status: Demand["status"]): Promise<void> {
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
      expiresAt: data.expiresAt?.toDate() || new Date(),
    } as Demand);
  });
  return demands;
}
