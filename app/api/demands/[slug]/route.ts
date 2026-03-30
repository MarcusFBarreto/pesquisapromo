import { NextRequest, NextResponse } from "next/server";
import { getDemandsForPartner, updateDemandStatus } from "@/lib/demand-store";
import { getPartnerBySlugAsync } from "@/lib/partner-data";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

/**
 * GET /api/demands/[slug] — get demands for a specific partner.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const partner = await getPartnerBySlugAsync(slug);

  if (!partner) {
    return NextResponse.json({ error: "Parceiro não encontrado" }, { status: 404 });
  }

  const demands = await getDemandsForPartner(slug, partner.category);

  return NextResponse.json({ demands });
}

/**
 * PATCH /api/demands/[slug] — update demand status.
 * Body: { demandId, status }
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { demandId, status } = body;

    if (!demandId || !status) {
      return NextResponse.json({ error: "Campos: demandId, status" }, { status: 400 });
    }

    await updateDemandStatus(demandId, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PesquisaPromo] Erro ao atualizar demanda:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
