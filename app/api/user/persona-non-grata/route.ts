import { NextResponse } from "next/server";
import { markPersonaNonGrata, penalizeUser } from "@/lib/user-service";

export async function POST(req: Request) {
  try {
    const { partnerSlug, clientWhatsapp, reason } = await req.json();

    if (!partnerSlug || !clientWhatsapp) {
      return NextResponse.json(
        { error: "Partner Slug e WhatsApp do Cliente são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanWhatsapp = clientWhatsapp.replace(/\D/g, "");

    // 1. Mark as Persona Non Grata (Bilateral)
    await markPersonaNonGrata(partnerSlug, cleanWhatsapp);

    // 2. Penalize global reputation (Japanese Honor System)
    // A bilateral PNG is a strong signal, so we penalize the global score by 5 points.
    // If the score drops below 80, the user loses "Trusted" status (The Shield).
    await penalizeUser(cleanWhatsapp, 5);

    console.info(`[The Shield 2.2] Usuário ${cleanWhatsapp} marcado como PNG por ${partnerSlug}. Razão: ${reason || "Não informada"}`);

    return NextResponse.json({ 
      success: true, 
      message: "Usuário marcado como Persona Non Grata com sucesso." 
    });
  } catch (error) {
    console.error("[The Shield] Erro ao marcar Persona Non Grata:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}
