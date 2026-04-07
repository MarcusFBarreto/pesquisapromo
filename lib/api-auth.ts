import { adminAuth, adminDb } from "./firebase-admin";

/**
 * Verifica se um token é de um administrador.
 * Agora utiliza a coleção "admins" no Firestore para validação dinâmica.
 */
export async function isAdminRequest(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return false;

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (!decodedToken.email) return false;

    // Check if email exists in the "admins" collection
    const adminDoc = await adminDb.collection("admins").doc(decodedToken.email.toLowerCase()).get();
    
    return adminDoc.exists;
  } catch (error) {
    console.error("[API Auth] Admin verify error:", error);
    return false;
  }
}
