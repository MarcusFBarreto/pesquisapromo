/**
 * Silent mutual blocklist system.
 * 
 * In production, this reads/writes from Firestore collection "blocklist".
 * For now, state is kept in memory (resets on page reload).
 *
 * Neither party is notified when blocked — the system silently
 * stops routing demands between them.
 */

export type BlockEntry = {
  type: "partner-blocks-client" | "client-blocks-partner";
  partnerSlug: string;
  clientWhatsapp: string;
  createdAt: Date;
};

// In-memory store (will be Firestore in production)
let blocklist: BlockEntry[] = [];

/**
 * Partner blocks a client from receiving their future demands.
 */
export function blockClient(partnerSlug: string, clientWhatsapp: string): void {
  const clean = clientWhatsapp.replace(/\D/g, "");
  if (isBlocked(partnerSlug, clean)) return; // already blocked

  blocklist.push({
    type: "partner-blocks-client",
    partnerSlug,
    clientWhatsapp: clean,
    createdAt: new Date(),
  });

  console.info(`[Blocklist] Parceiro ${partnerSlug} bloqueou cliente ${clean}`);
}

/**
 * Client blocks a partner from sending them proposals.
 */
export function blockPartner(clientWhatsapp: string, partnerSlug: string): void {
  const clean = clientWhatsapp.replace(/\D/g, "");
  if (isBlocked(partnerSlug, clean)) return;

  blocklist.push({
    type: "client-blocks-partner",
    partnerSlug,
    clientWhatsapp: clean,
    createdAt: new Date(),
  });

  console.info(`[Blocklist] Cliente ${clean} bloqueou parceiro ${partnerSlug}`);
}

/**
 * Check if there's a block between a partner and client (in either direction).
 */
export function isBlocked(partnerSlug: string, clientWhatsapp: string): boolean {
  const clean = clientWhatsapp.replace(/\D/g, "");
  return blocklist.some(
    (b) => b.partnerSlug === partnerSlug && b.clientWhatsapp === clean
  );
}

/**
 * Filter out blocked partners for a given client.
 * Used during demand routing.
 */
export function filterBlockedPartners(
  partnerSlugs: string[],
  clientWhatsapp: string
): string[] {
  const clean = clientWhatsapp.replace(/\D/g, "");
  return partnerSlugs.filter((slug) => !isBlocked(slug, clean));
}

/**
 * Filter out blocked clients for a given partner.
 * Used when displaying demands in the partner dashboard.
 */
export function filterBlockedClients(
  clientWhatsapps: string[],
  partnerSlug: string
): string[] {
  return clientWhatsapps.filter(
    (wp) => !isBlocked(partnerSlug, wp.replace(/\D/g, ""))
  );
}

/**
 * Get all blocks (for debugging / future admin panel).
 */
export function getBlocklist(): BlockEntry[] {
  return [...blocklist];
}

/**
 * Clear blocklist (for testing).
 */
export function clearBlocklist(): void {
  blocklist = [];
}
