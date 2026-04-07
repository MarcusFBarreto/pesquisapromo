import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { slugify } from "@/lib/utils";
import { isAdminRequest } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    if (!await isAdminRequest(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const snapshot = await adminDb.collection('partner_applications')
      .orderBy('createdAt', 'desc')
      .get();

    const applications: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      applications.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("[myLupa] Erro ao buscar solicitações de parceiros:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!await isAdminRequest(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Campos applicationId e status são obrigatórios" }, { status: 400 });
    }

    const appRef = adminDb.collection('partner_applications').doc(applicationId);
    const appDoc = await appRef.get();

    if (!appDoc.exists) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    }

    const appData = appDoc.data()!;

    // 1. Update application status
    await appRef.update({
      status,
      updatedAt: new Date(),
    });

    // 2. If approved, create/update the partner in 'partners' collection and Auth
    if (status === 'approved') {
      const partnerSlug = slugify(appData.name);
      const email = appData.email || "";
      
      if (!email) {
        return NextResponse.json({ 
          error: "Esta solicitação não possui email cadastrado. Não é possível aprovar parceiros sem email." 
        }, { status: 400 });
      }

      // Create Firebase Auth user
        try {
          await adminAuth.createUser({
            email: email,
            password: appData.cnpj.replace(/\D/g, "").slice(0, 8) || "password123", // Simple temp password
            displayName: appData.name,
          });
          console.log(`[Admin] Usuário Auth criado para ${email}`);
        } catch (authError: any) {
          // If user already exists, we just ignore
          if (authError.code === 'auth/email-already-exists') {
            console.log(`[Admin] Usuário Auth já existe para ${email}`);
          } else {
            console.error(`[Admin] Erro ao criar usuário Auth:`, authError);
            // We continue anyway to create the Firestore doc
          }
        }

      const partnerRef = adminDb.collection('partners').doc(partnerSlug);
      
      // Map partnerType to tier
      let tier = 3; // Default
      if (appData.partnerType === 'autonomo') tier = 1;
      else if (appData.partnerType === 'cpf') tier = 2;

      await partnerRef.set({
        id: partnerRef.id,
        slug: partnerSlug,
        name: appData.name,
        email: email,
        whatsapp: appData.whatsapp,
        cnpj: appData.cnpj,
        partnerType: appData.partnerType || 'cnpj',
        tier,
        documentsVerified: false,
        category: appData.category,
        description: appData.description || "",
        status: 'active',
        needsAccountActivation: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        services: [],
        tagline: `Sua loja de ${appData.category} na Área Piloto`,
        city: "Área Piloto",
        region: "CE"
      }, { merge: true });

      console.log(`[Admin] Parceiro ${appData.name} aprovado e criado como ${partnerSlug} (Tier ${tier})`);

      // 3. Clean up other pending applications with the same CNPJ
      try {
        const redundantApps = await adminDb.collection('partner_applications')
          .where('cnpj', '==', appData.cnpj.replace(/\D/g, ""))
          .where('status', '==', 'pending')
          .get();
        
        const batch = adminDb.batch();
        redundantApps.forEach(doc => {
          if (doc.id !== applicationId) {
            batch.delete(doc.ref);
          }
        });
        await batch.commit();
        if (redundantApps.size > 1) {
          console.log(`[Admin] Removidas ${redundantApps.size - 1} solicitações duplicadas.`);
        }
      } catch (cleanupError) {
        console.error("[Admin] Erro ao limpar duplicados:", cleanupError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[myLupa] Erro ao atualizar solicitação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
