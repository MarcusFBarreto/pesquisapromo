import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api-auth";
import { createMagicLink } from "@/lib/magic-link-service";

export async function POST(req: Request) {
  try {
    if (!await isAdminRequest(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { email, type, metadata } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const token = await createMagicLink(email, type || 'partner', metadata);
    
    // Construct the link (in production this should use the real domain)
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = req.headers.get('host') || 'pesquisapromo.com.br';
    const magicLink = `${protocol}://${host}/pro/ativar?token=${token}`;

    return NextResponse.json({ magicLink });
  } catch (error) {
    console.error("[API Admin Magic Link] Erro ao gerar link:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
