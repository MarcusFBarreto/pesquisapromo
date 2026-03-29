import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type DemandSubmitPayload = {
  request: string;
  details?: string;
  name?: string;
  whatsapp: string;
  intendedPartnerSlug?: string | null;
  /** Categories matched by IA — used for routing to partners */
  matchedCategories?: string[];
  sourceUrl?: string;
};

// Evaluate mock mode once at module init
const IS_MOCK_MODE =
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "demo";

// Strip mask from WhatsApp number before saving
function cleanWhatsapp(masked: string): string {
  return masked.replace(/\D/g, "");
}

export async function submitDemand(payload: DemandSubmitPayload) {
  try {
    const cleanPayload = {
      ...payload,
      whatsapp: cleanWhatsapp(payload.whatsapp),
    };

    if (IS_MOCK_MODE) {
      console.warn(
        "[PesquisaPromo] 🟡 Modo demo — demanda salva localmente. " +
          "Preencha NEXT_PUBLIC_FIREBASE_* no .env para ativar o Firestore."
      );
      console.info("[PesquisaPromo] Demanda (mock):", cleanPayload);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true, id: "mock-" + Date.now() };
    }

    // Dynamic import to avoid initializing Firebase when in mock mode
    const { db } = await import("./firebase");
    const docRef = await addDoc(collection(db, "demands"), {
      ...cleanPayload,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("[PesquisaPromo] Erro ao salvar demanda:", error);
    return { success: false, error };
  }
}
