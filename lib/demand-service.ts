import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { classifyDemand, getTargetPartners } from "./category-router";
import { filterBlockedPartners } from "./blocklist-service";

export type DemandSubmitPayload = {
  request: string;
  details?: string;
  name?: string;
  whatsapp: string;
  intendedPartnerSlug?: string | null;
  matchedCategories?: string[];
  sourceUrl?: string;
};

export type DemandResult = {
  success: boolean;
  id?: string;
  matchedCategories?: string[];
  targetPartnerCount?: number;
  error?: unknown;
};

// Evaluate mock mode once at module init
const IS_MOCK_MODE =
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "demo";

function cleanWhatsapp(masked: string): string {
  return masked.replace(/\D/g, "");
}

export async function submitDemand(payload: DemandSubmitPayload): Promise<DemandResult> {
  try {
    const cleanWa = cleanWhatsapp(payload.whatsapp);

    // 7C: Classify demand into categories
    const categories = classifyDemand(payload.request, payload.details);

    // Find target partners (by category)
    const allTargets = getTargetPartners(categories);

    // 7D: Filter out blocked partners for this client
    const allowedSlugs = filterBlockedPartners(
      allTargets.map((p) => p.slug),
      cleanWa
    );

    const cleanPayload = {
      ...payload,
      whatsapp: cleanWa,
      matchedCategories: categories,
      targetPartners: allowedSlugs,
    };

    if (IS_MOCK_MODE) {
      console.warn(
        "[PesquisaPromo] 🟡 Modo demo — demanda salva localmente."
      );
      console.info("[PesquisaPromo] Demanda (mock):", cleanPayload);
      console.info(
        `[PesquisaPromo] Roteamento: ${categories.join(", ")} → ${allowedSlugs.length} parceiro(s)`
      );
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        id: "mock-" + Date.now(),
        matchedCategories: categories,
        targetPartnerCount: allowedSlugs.length,
      };
    }

    const { db } = await import("./firebase");
    const docRef = await addDoc(collection(db, "demands"), {
      ...cleanPayload,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      id: docRef.id,
      matchedCategories: categories,
      targetPartnerCount: allowedSlugs.length,
    };
  } catch (error) {
    console.error("[PesquisaPromo] Erro ao salvar demanda:", error);
    return { success: false, error };
  }
}
