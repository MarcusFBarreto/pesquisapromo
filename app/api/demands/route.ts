import { NextRequest, NextResponse } from "next/server";
import { addDemand } from "@/lib/demand-store";

/**
 * POST /api/demands — submit a new demand.
 * This is the real submission endpoint used by the demand form.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, details, name, whatsapp } = body;

    if (!request || !whatsapp) {
      return NextResponse.json(
        { error: "Campos obrigatórios: request, whatsapp" },
        { status: 400 }
      );
    }

    const demand = addDemand({
      request,
      details,
      name,
      whatsapp,
    });

    return NextResponse.json({
      success: true,
      id: demand.id,
      matchedCategories: demand.matchedCategories,
    });
  } catch (error) {
    console.error("[PesquisaPromo] Erro ao criar demanda:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
