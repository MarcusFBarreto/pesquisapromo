import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { adminDb } from "@/lib/firebase-admin";
import { Demand } from "@/lib/mock-demands";
import { isAdminRequest } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    if (!await isAdminRequest(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    // Fetch all without orderBy first to avoid index requirements during debugging
    const snapshot = await adminDb.collection('demands').get();

    const demands: Demand[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      demands.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as any); // Cast to any to avoid strict MockDemand type issues during debug
    });

    // Sort in memory
    demands.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ demands });
  } catch (error: any) {
    console.error("[myLupa] CRITICAL: Erro ao buscar todas as demandas:", error.message, error.stack);
    return NextResponse.json({ error: "Erro interno", details: error.message }, { status: 500 });
  }

}

export async function DELETE(req: Request) {
  try {
    if (!await isAdminRequest(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID da demanda é obrigatório" }, { status: 400 });
    }

    await adminDb.collection('demands').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[myLupa] Erro ao deletar demanda:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
