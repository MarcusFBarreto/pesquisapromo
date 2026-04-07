import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { isAdminRequest } from "@/lib/api-auth";
import { createMagicLink } from "@/lib/magic-link-service";
import { adminDb } from "@/lib/firebase-admin";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    if (!await isAdminRequest(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
 
    const { email, type, metadata, name } = await req.json();
 
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    let partnerSlug = metadata?.partnerSlug;

    // 1. If 'name' is provided, we ensure a partner record exists (Manual Invitation Flow)
    if (name) {
      partnerSlug = partnerSlug || slugify(name);
      
      const partnerRef = adminDb.collection("partners").doc(partnerSlug);
      const partnerDoc = await partnerRef.get();
      
      if (!partnerDoc.exists) {
        console.log(`[API Admin Magic Link] Criando novo parceiro via convite: ${name}`);
        await partnerRef.set({
          name,
          email: lowerEmail,
          slug: partnerSlug,
          status: 'approved',
          createdAt: new Date(),
          invitedBy: 'admin',
          source: 'manual_invite'
        });
      }
    }

    const finalMetadata = { ...metadata, partnerSlug };
 
    const token = await createMagicLink(lowerEmail, type || 'partner', finalMetadata);
    
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
