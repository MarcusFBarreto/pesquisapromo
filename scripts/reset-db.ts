import { adminDb } from "../lib/firebase-admin";

async function deleteCollection(collectionPath: string, batchSize: number = 100) {
  const collectionRef = adminDb.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(query: any, resolve: any) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

async function resetDatabase() {
  console.log("🚀 Starting database reset...");
  
  const collections = [
    "partners",
    "demands",
    "user_reputation",
    "peer_reputation",
    "blocklist",
    "offers",
    "users",
    "brands",
    "products"
  ];

  for (const collection of collections) {
    console.log(`🗑️ Deleting collection: ${collection}`);
    await deleteCollection(collection);
  }

  console.log("✅ Database reset complete!");
  process.exit(0);
}

resetDatabase().catch((err) => {
  console.error("❌ Reset failed:", err);
  process.exit(1);
});
