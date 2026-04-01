import { adminDb, FieldValue } from "./firebase-admin";

/**
 * Reputation Service (Trust Graph)
 * - Global: Starts at 100 (Max), loses points for bad behavior (Fake/Spam).
 * - Peer: Bilateral status (Persona Non Grata) between Provider and User.
 */
export async function getUserReputation(userId: string) {
  const userRef = adminDb.collection("user_reputation").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return {
      score: 100,
      isTrusted: true,
      totalDemands: 0,
      status: "new"
    };
  }

  const data = userDoc.data();
  const score = data?.score ?? 100;

  return {
    score,
    isTrusted: score >= 80,
    totalDemands: data?.totalDemands ?? 0,
    status: data?.status ?? "active"
  };
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

export async function penalizeUser(userId: string, penalty: number) {
  const userRef = adminDb.collection("user_reputation").doc(userId);
  await userRef.set({
    score: FieldValue.increment(-penalty),
    lastIncident: new Date()
  }, { merge: true });
}

export async function rewardUser(userId: string, reward: number) {
  const userRef = adminDb.collection("user_reputation").doc(userId);
  await userRef.set({
    score: FieldValue.increment(reward),
    totalDemands: FieldValue.increment(1)
  }, { merge: true });
}
