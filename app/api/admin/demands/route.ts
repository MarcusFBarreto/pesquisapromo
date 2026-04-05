import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { adminDb } from "@/lib/firebase-admin";
import { Demand } from "@/lib/mock-demands";

export async function GET() {
  try {
    const snapshot = await adminDb.collection('demands')
      .orderBy('createdAt', 'desc')
      .get();

    const demands: Demand[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      demands.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Demand);
    });

    return NextResponse.json({ demands });
  } catch (error) {
    console.error("[myLupa] Erro ao buscar todas as demandas:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
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
