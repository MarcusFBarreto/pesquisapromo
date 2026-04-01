import { NextResponse } from "next/server";
import { blockClient } from "@/lib/blocklist-service";

export async function POST(req: Request) {
  try {
    const { partnerSlug, clientWhatsapp } = await req.json();

    if (!partnerSlug || !clientWhatsapp) {
      return NextResponse.json(
        { error: "Partner Slug e WhatsApp do Cliente são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanWhatsapp = clientWhatsapp.replace(/\D/g, "");

    // Silent block
    await blockClient(partnerSlug, cleanWhatsapp);

    console.info(`[Blocklist] Usuário ${cleanWhatsapp} bloqueado silenciosamente por ${partnerSlug}`);

    return NextResponse.json({ 
      success: true, 
      message: "Usuário bloqueado com sucesso." 
    });
  } catch (error) {
    console.error("[Blocklist] Erro ao bloquear:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}
