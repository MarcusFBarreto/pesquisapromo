import { adminDb } from "./firebase-admin";

/**
 * Technical Blocklist Service (Trust Graph)
 * - Persistent: Stores blocks in Firestore "blocklist" collection.
 * - Silent: Neither party is notified when blocked.
 */

export type BlockEntry = {
  type: "partner-blocks-client" | "client-blocks-partner";
  partnerSlug: string;
  clientWhatsapp: string;
  createdAt: Date;
};

/**
 * Partner blocks a client from receiving their future demands.
 */
export async function blockClient(partnerSlug: string, clientWhatsapp: string) {
  const clean = clientWhatsapp.replace(/\D/g, "");
  const blockId = `block_${partnerSlug}_${clean}`;
  
  await adminDb.collection("blocklist").doc(blockId).set({
    type: "partner-blocks-client",
    partnerSlug,
    clientWhatsapp: clean,
    createdAt: new Date(),
  });

  console.info(`[Blocklist] Partner ${partnerSlug} blocked client ${clean}`);
}

/**
 * Check if there's a block between a partner and client (any direction).
 */
export async function isBlocked(partnerSlug: string, clientWhatsapp: string): Promise<boolean> {
  const clean = clientWhatsapp.replace(/\D/g, "");
  const blockId = `block_${partnerSlug}_${clean}`;
  
  const docSnap = await adminDb.collection("blocklist").doc(blockId).get();
  return docSnap.exists;
}

/**
 * Clears blocklist (Legacy/Testing)
 */
export async function clearBlocklist() {
  // In production, we don't clear the whole collection easily.
  console.warn("clearBlocklist called - ignored in production Firestore mode.");
}
