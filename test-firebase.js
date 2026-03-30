const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

console.log("Testing Firebase Connection...");
console.log("Project ID:", process.env.FIREBASE_PROJECT_ID);
console.log("Client Email:", process.env.FIREBASE_CLIENT_EMAIL);

const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (!privateKey) {
  console.error("ERROR: FIREBASE_PRIVATE_KEY is missing!");
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  console.log("✅ Admin SDK initialized.");
  
  const db = admin.firestore();
  db.collection('test').get()
    .then(() => {
      console.log("✅ Firestore connected successfully!");
      process.exit(0);
    })
    .catch(err => {
      console.error("❌ Firestore connection failed:", err.message);
      process.exit(1);
    });
} catch (error) {
  console.error("❌ Initialization error:", error.message);
  process.exit(1);
}
