import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, cnpj, category, whatsapp, description, email, partnerType } = body;

    // Validate
    if (!name || !cnpj || !category || !whatsapp || !email || !partnerType) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if already a partner
    const partnerCheck = await adminDb.collection("partners")
      .where("cnpj", "==", cleanCnpj)
      .limit(1)
      .get();
    
    if (!partnerCheck.empty) {
      return NextResponse.json({ 
        error: "Identificamos que este CNPJ já está ativo em nossa rede. Se você esqueceu sua senha, use a opção de recuperação no login." 
      }, { status: 400 });
    }

    const emailCheck = await adminDb.collection("partners")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();
    
    if (!emailCheck.empty) {
      return NextResponse.json({ 
        error: "Este email já está vinculado a um parceiro ativo. Tente fazer login ou use outro email." 
      }, { status: 400 });
    }

    // 2. Check for duplicate pending application
    const pendingCheck = await adminDb.collection("partner_applications")
      .where("cnpj", "==", cleanCnpj)
      .where("status", "==", "pending")
      .limit(1)
      .get();
    
    if (!pendingCheck.empty) {
      return NextResponse.json({ 
        error: "Já recebemos uma solicitação com este CNPJ e ela está em análise. Em breve entraremos em contato via WhatsApp!" 
      }, { status: 400 });
    }

    const applicationRef = adminDb.collection("partner_applications").doc();

    await applicationRef.set({
      id: applicationRef.id,
      name,
      email: normalizedEmail,
      cnpj: cleanCnpj,
      partnerType,
      category,
      whatsapp: whatsapp.replace(/\D/g, ""),
      description: description || "",
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error: any) {
    console.error("[myLupa] Erro ao cadastrar parceiro:", error);
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}
