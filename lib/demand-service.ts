import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type DemandSubmitPayload = {
  request: string;
  name: string;
  whatsapp: string;
  intendedPartnerSlug?: string | null;
  sourceUrl?: string;
};

// Evaluate mock mode once at module init — avoids a per-call runtime check
const IS_MOCK_MODE =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo";

export async function submitDemand(payload: DemandSubmitPayload) {
  try {
    if (IS_MOCK_MODE) {
      console.warn(
        "[PesquisaPromo] 🟡 Modo demo ativo — demanda não enviada ao Firebase real. " +
          "Preencha NEXT_PUBLIC_FIREBASE_* no seu .env para ativar."
      );
      // Simulate network latency so the UI flow is realistic during development
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true, id: "mock-" + Date.now() };
    }

    const docRef = await addDoc(collection(db, "demands"), {
      ...payload,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("[PesquisaPromo] Erro ao salvar demanda:", error);
    return { success: false, error };
  }
}
