import { rewardUser } from "@/lib/user-service";

export async function POST(req: NextRequest) {
  try {
    const { id, code } = await req.json();

    if (!id || !code) {
      return NextResponse.json({ error: "ID e Código são necessários" }, { status: 400 });
    }

    const demandDoc = adminDb.collection("demands").doc(id);
    const demandSnapshot = await demandDoc.get();

    if (!demandSnapshot.exists) {
      return NextResponse.json({ error: "Demanda não encontrada" }, { status: 404 });
    }

    const data = demandSnapshot.data();

    if (data?.vCode === code) {
      await demandDoc.update({
        status: "pending",
        verifiedAt: new Date(),
      });

      // RECOMPENSA: Usuário que valida ganha pontos no Sistema de Honra
      if (data?.whatsapp) {
        await rewardUser(data.whatsapp, 2); // +2 pontos por validação bem-sucedida
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }
  } catch (error) {
    console.error("[PesquisaPromo] Erro na verificação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
