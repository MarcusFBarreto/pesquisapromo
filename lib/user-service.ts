import { adminDb, FieldValue } from "./firebase-admin";
import { User, UserReputation } from "./types";

/**
 * User Service (Trust Graph & Profile)
 * - Managed in the "users" collection.
 * - Reputation score starts at 100.
 */

export async function getUser(userId: string): Promise<User | null> {
  const userRef = adminDb.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) return null;
  
  const data = userDoc.data();
  return {
    ...data,
    createdAt: data?.createdAt?.toDate() || new Date(),
  } as User;
}

export async function getOrCreateUser(whatsapp: string, name?: string): Promise<User> {
  const cleanWa = whatsapp.replace(/\D/g, "");
  const existing = await getUser(cleanWa);
  
  if (existing) return existing;

  const newUser: User = {
    id: cleanWa,
    whatsapp: cleanWa,
    name: name || "Anônimo",
    role: "buyer",
    reputation: {
      score: 100,
      isTrusted: true,
      totalDemands: 0,
      status: "new"
    },
    createdAt: new Date(),
  };

  await adminDb.collection("users").doc(cleanWa).set(newUser);
  return newUser;
}

export async function getUserReputation(userId: string): Promise<UserReputation> {
  const user = await getUser(userId);
  if (!user) {
    return {
      score: 100,
      isTrusted: true,
      totalDemands: 0,
      status: "new"
    };
  }
  return user.reputation;
}

export async function penalizeUser(userId: string, penalty: number) {
  const userRef = adminDb.collection("users").doc(userId);
  await userRef.update({
    "reputation.score": FieldValue.increment(-penalty),
    "reputation.lastIncident": new Date()
  });
}

export async function rewardUser(userId: string, reward: number) {
  const userRef = adminDb.collection("users").doc(userId);
  await userRef.update({
    "reputation.score": FieldValue.increment(reward),
    "reputation.totalDemands": FieldValue.increment(1)
  });
}

/**
 * Bilateral Reputation (Persona Non Grata)
 */
export async function getPeerReputation(providerId: string, userId: string) {
  const peerRef = adminDb.collection("peer_reputation").doc(`${providerId}_${userId}`);
  const peerDoc = await peerRef.get();

  if (!peerDoc.exists) {
    return { isPersonaNonGrata: false };
  }

  return {
    isPersonaNonGrata: peerDoc.data()?.status === "persona_non_grata"
  };
}

export async function markPersonaNonGrata(providerId: string, userId: string) {
  const peerRef = adminDb.collection("peer_reputation").doc(`${providerId}_${userId}`);
  await peerRef.set({
    providerId,
    userId,
    status: "persona_non_grata",
    createdAt: new Date()
  });
}
