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
        console.log('[FirebaseAdmin] Initialized with Service Account Key (Local/Dev).');
      } catch (error) {
        console.error('[FirebaseAdmin] Dev Initialization error:', error);
      }
    } else {
      // PROD: Use Default Cloud Run / App Hosting Credentials (ADC)
      try {
        admin.initializeApp();
        console.log('[FirebaseAdmin] Initialized with Application Default Credentials (Cloud).');
      } catch (error) {
        console.error('[FirebaseAdmin] Cloud Initialization error:', error);
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

// For atomic increments and server timestamps
export const FieldValue = admin.firestore.FieldValue;

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
