import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { verifyMagicLink } from "@/lib/magic-link-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 });
    }

    const result = await verifyMagicLink(token);

    if (!result) {
      return NextResponse.json({ error: "Link inválido ou expirado" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      customToken: result.customToken,
      email: result.email,
      role: result.type
    });
  } catch (error: any) {
    console.error("[API Magic Link] Erro na verificação:", error);
    return NextResponse.json({ 
      error: "Erro interno no servidor"
    }, { status: 500 });
  }
}
