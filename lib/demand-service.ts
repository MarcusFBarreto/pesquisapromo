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

function cleanWhatsapp(masked: string): string {
  return masked.replace(/\D/g, "");
}

export async function submitDemand(payload: DemandSubmitPayload): Promise<DemandResult> {
  try {
    const response = await fetch("/api/demands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
      matchedCategories: data.matchedCategories,
      targetPartnerCount: data.targetPartnerCount || 0,
    };
  } catch (error) {
    console.error("[myLupa] Erro ao salvar demanda:", error);
    return { success: false, error };
  }
}
