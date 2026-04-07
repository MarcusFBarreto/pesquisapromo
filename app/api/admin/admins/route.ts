import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api-auth";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    if (!(await isAdminRequest(req))) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const snapshot = await adminDb.collection("admins").orderBy("createdAt", "desc").get();
    const admins = snapshot.docs.map(doc => ({
      email: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("[API Admin List] Erro:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdminRequest(req))) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    
    await adminDb.collection("admins").doc(lowerEmail).set({
      email: lowerEmail,
      createdAt: new Date(),
      addedBy: "admin_ui"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Admin Add] Erro:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await isAdminRequest(req))) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Prevent deleting the main admin if necessary, 
    // but for now we allow deleting any as long as you're an admin.
    
    await adminDb.collection("admins").doc(email).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Admin Delete] Erro:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
