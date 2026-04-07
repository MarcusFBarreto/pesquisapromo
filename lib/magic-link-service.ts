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
export async function verifyMagicLink(token: string): Promise<{ email: string; type: string; customToken: string; metadata: any } | null> {
  if (!token) {
    console.warn("[MagicLink] Token não fornecido");
    return null;
  }

  console.log(`[MagicLink] Verificando token: ${token}`);
  const doc = await adminDb.collection("magic_links").doc(token).get();
  
  if (!doc.exists) {
    console.warn(`[MagicLink] Token não encontrado no Firestore: ${token}`);
    return null;
  }

  const data = doc.data() as MagicLink;
  console.log(`[MagicLink] Dados encontrados para: ${data.email} (${data.type})`);
  
  // Convert Firestore Timestamp to Date if necessary
  let expiresAt;
  try {
    expiresAt = (data.expiresAt as any).toDate ? (data.expiresAt as any).toDate() : new Date(data.expiresAt);
  } catch (e) {
    console.error("[MagicLink] Erro ao converter data de expiração", e);
    return null;
  }

  if (data.used) {
    console.warn(`[MagicLink] Token já utilizado: ${token}`);
    return null;
  }

  if (expiresAt < new Date()) {
    console.warn(`[MagicLink] Token expirado: ${token} (exp em ${expiresAt})`);
    return null;
  }

  // Mark as used
  console.log(`[MagicLink] Marcando token como usado...`);
  await doc.ref.update({ used: true, usedAt: new Date() });

  // Generate Firebase Custom Token
  console.log(`[MagicLink] Gerando Custom Token para ${data.email}...`);
  try {
    const customToken = await adminAuth.createCustomToken(data.email, {
      role: data.type === 'admin' ? 'admin' : 'partner'
    });
    console.log(`[MagicLink] Custom Token gerado com sucesso.`);
    return { 
      email: data.email, 
      type: data.type, 
      customToken, 
      metadata: data.metadata || {} 
    };
  } catch (authError) {
    console.error("[MagicLink] Erro crítico ao gerar Custom Token:", authError);
    throw authError; // Rethrow to trigger 500 in the API route
  }
}
