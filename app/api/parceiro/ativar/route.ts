import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

// POST: Validar se o parceiro precisa de ativação
export async function POST(req: Request) {
  try {
    const { email, cnpj } = await req.json();

    if (!email || !cnpj) {
      return NextResponse.json({ error: "Email e CNPJ são obrigatórios" }, { status: 400 });
    }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    const normalizedEmail = email.trim().toLowerCase();

    const snapshot = await adminDb.collection('partners')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Parceiro não encontrado" }, { status: 404 });
    }

    const partnerDoc = snapshot.docs[0];
    const partnerData = partnerDoc.data();

    // Validar CNPJ
    const savedCnpj = partnerData.cnpj.replace(/\D/g, "");
    if (savedCnpj !== cleanCnpj) {
      return NextResponse.json({ error: "Dados não conferem" }, { status: 401 });
    }

    if (!partnerData.needsAccountActivation) {
      return NextResponse.json({ 
        message: "Esta conta já foi ativada.", 
        alreadyActive: true 
      });
    }

    return NextResponse.json({ 
      success: true, 
      name: partnerData.name,
      needsActivation: true 
    });

  } catch (error) {
    console.error("[Ativação] Erro ao validar:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PATCH: Realizar a ativação (definir senha)
export async function PATCH(req: Request) {
  try {
    const { email, cnpj, newPassword } = await req.json();

    if (!email || !cnpj || !newPassword) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 });
    }

    const snapshot = await adminDb.collection('partners')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Parceiro não encontrado" }, { status: 404 });
    }

    const partnerDoc = snapshot.docs[0];
    const partnerData = partnerDoc.data();

    // Validar CNPJ novamente por segurança
    const savedCnpj = partnerData.cnpj.replace(/\D/g, "");
    if (savedCnpj !== cleanCnpj) {
      return NextResponse.json({ error: "Dados não conferem" }, { status: 401 });
    }

    if (!partnerData.needsAccountActivation) {
      return NextResponse.json({ error: "Conta já ativada" }, { status: 400 });
    }

    // 1. Localizar usuário no Firebase Auth
    try {
      let uid: string;
      try {
        const userRecord = await adminAuth.getUserByEmail(normalizedEmail);
        uid = userRecord.uid;
        await adminAuth.updateUser(uid, { password: newPassword });
      } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
          const newUser = await adminAuth.createUser({
            email: normalizedEmail,
            password: newPassword,
            displayName: partnerData.name
          });
          uid = newUser.uid;
        } else {
          throw e;
        }
      }

      // 3. Atualizar flag no Firestore
      await partnerDoc.ref.update({
        needsAccountActivation: false,
        updatedAt: new Date()
      });

      return NextResponse.json({ success: true, message: "Conta ativada com sucesso!" });
    } catch (authError: any) {
      console.error("[Ativação] Erro no Auth:", authError);
      
      if (authError.code === 'auth/configuration-not-found') {
        return NextResponse.json({ 
          error: "O Firebase Authentication não parece estar habilitado no Console do Firebase para este projeto. Por favor, habilite o provedor Email/Senha." 
        }, { status: 500 });
      }

      return NextResponse.json({ error: "Erro ao atualizar senha no sistema de autenticação" }, { status: 500 });
    }

  } catch (error) {
    console.error("[Ativação] Erro ao processar:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
