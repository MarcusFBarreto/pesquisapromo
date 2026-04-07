import { adminDb, adminAuth } from "./firebase-admin";
import { v4 as uuidv4 } from "uuid";

export interface MagicLink {
  token: string;
  email: string;
  expiresAt: Date;
  used: boolean;
  type: 'admin' | 'partner';
  metadata?: Record<string, any>;
}

/**
 * Creates a unique magic link token and stores it in Firestore.
 * Link expires in 24 hours.
 */
export async function createMagicLink(email: string, type: 'admin' | 'partner' = 'partner', metadata?: Record<string, any>): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await adminDb.collection("magic_links").doc(token).set({
    token,
    email: email.toLowerCase().trim(),
    expiresAt,
    used: false,
    type,
    metadata: metadata || {},
    createdAt: new Date(),
  });

  return token;
}

/**
 * Verifies a magic link token.
 * Returns the email associated if valid, or null if invalid/expired.
 */
export async function verifyMagicLink(token: string): Promise<{ email: string; type: string } | null> {
  if (!token) return null;

  const doc = await adminDb.collection("magic_links").doc(token).get();
  
  if (!doc.exists) return null;

  const data = doc.data() as MagicLink;
  
  // Convert Firestore Timestamp to Date if necessary
  const expiresAt = (data.expiresAt as any).toDate ? (data.expiresAt as any).toDate() : new Date(data.expiresAt);

  if (data.used || expiresAt < new Date()) {
    return null;
  }

  // Mark as used
  await doc.ref.update({ used: true, usedAt: new Date() });

  // Generate Firebase Custom Token
  const customToken = await adminAuth.createCustomToken(data.email, {
    role: data.type === 'admin' ? 'admin' : 'partner'
  });

  return { 
    email: data.email, 
    type: data.type, 
    customToken, 
    metadata: data.metadata || {} 
  };
}
