import * as admin from 'firebase-admin';

// Unified initialization check
function ensureFirebaseAdmin() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      try {
        admin.initializeApp({
          projectId: projectId,
          credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey,
          }),
        });
        console.log('[FirebaseAdmin] Initialized successfully.');
      } catch (error) {
        console.error('[FirebaseAdmin] Initialization error:', error);
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.warn('[FirebaseAdmin] Missing environment variables. Skipping init.');
      }
    }
  }
}

// Proxied exports for Lazy Initialization
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop) {
    ensureFirebaseAdmin();
    if (admin.apps.length === 0) {
      throw new Error(`Firebase Admin not initialized. Cannot access firestore property: ${String(prop)}`);
    }
    const db = admin.firestore();
    return (db as any)[prop];
  }
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(target, prop) {
    ensureFirebaseAdmin();
    if (admin.apps.length === 0) {
      throw new Error(`Firebase Admin not initialized. Cannot access auth property: ${String(prop)}`);
    }
    const auth = admin.auth();
    return (auth as any)[prop];
  }
});
