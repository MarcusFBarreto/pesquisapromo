import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, whatsapp } = body;

    // Validate essentials only
    if (!name || !category || !whatsapp) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    // Check for duplicate by WhatsApp
    const partnerCheck = await adminDb.collection("partners")
      .where("whatsapp", "==", cleanWhatsapp)
      .limit(1)
      .get();
    
    if (!partnerCheck.empty) {
      return NextResponse.json({ 
        error: "Este WhatsApp já está vinculado a um parceiro ativo. Tente fazer login." 
      }, { status: 400 });
    }

    // Check for duplicate pending application
    const pendingCheck = await adminDb.collection("partner_applications")
      .where("whatsapp", "==", cleanWhatsapp)
      .where("status", "==", "pending")
      .limit(1)
      .get();
    
    if (!pendingCheck.empty) {
      return NextResponse.json({ 
        error: "Já recebemos uma solicitação com este WhatsApp. Em breve entraremos em contato!" 
      }, { status: 400 });
    }

    const applicationRef = adminDb.collection("partner_applications").doc();

    await applicationRef.set({
      id: applicationRef.id,
      name,
      category,
      whatsapp: cleanWhatsapp,
      status: "pending",
      createdAt: new Date(),
    });

    console.info(`[myLupa] 🏪 Nova aplicação de parceiro: ${name} (${category})`);

    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error: any) {
    console.error("[myLupa] Erro ao cadastrar parceiro:", error);
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}
