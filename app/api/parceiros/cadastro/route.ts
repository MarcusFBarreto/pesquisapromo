import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, cnpj, category, whatsapp, description } = body;

    // Validate
    if (!name || !cnpj || !category || !whatsapp) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const applicationRef = adminDb.collection("partner_applications").doc();

    await applicationRef.set({
      id: applicationRef.id,
      name,
      cnpj: cnpj.replace(/\D/g, ""),
      category,
      whatsapp: whatsapp.replace(/\D/g, ""),
      description: description || "",
      status: "pending", // Important: must be approved by admin
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error) {
    console.error("[PesquisaPromo] Erro ao cadastrar parceiro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
