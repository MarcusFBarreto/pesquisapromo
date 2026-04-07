import { adminAuth } from "./firebase-admin";

const ADMIN_EMAILS = ["erivaldo@mylupa.com.br", "admin@mylupa.com.br"];

/**
 * Checks if a request comes from an authorized administrator.
 * Expects a Firebase ID Token in the Authorization header: 'Bearer <token>'
 */
export async function isAdminRequest(req: Request): Promise<boolean> {
  try {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // If no token in header, check cookies (optional, but good for some setups)
      return false;
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) return false;

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (!decodedToken || !decodedToken.email) {
      return false;
    }

    // Check if email is in the admin list
    return ADMIN_EMAILS.includes(decodedToken.email);
  } catch (error) {
    console.error("[API Auth] Error verifying admin request:", error);
    return false;
  }
}
