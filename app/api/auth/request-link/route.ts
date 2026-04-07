import { NextResponse } from "next/server";
import { createMagicLink } from "@/lib/magic-link-service";
import { sendMagicLinkEmail } from "@/lib/email-service";
import { adminDb } from "@/lib/firebase-admin";


export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    let partnerInfo = null;
    let type: 'admin' | 'partner' = 'partner';

    // 1. Check if Admin
    const adminDoc = await adminDb.collection("admins").doc(lowerEmail).get();
    
    if (adminDoc.exists) {
      type = 'admin';
      partnerInfo = { slug: 'admin' };
    } else {
      // 2. Check if Partner in Firestore
      const snapshot = await adminDb.collection("partners").where("email", "==", lowerEmail).limit(1).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0].data();
        partnerInfo = { slug: doc.slug };
      }
    }

    // If not found, we don't reveal it for security, but we don't send the email
    if (!partnerInfo) {
      console.warn(`[API Request Link] Email não encontrado: ${lowerEmail}`);
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ success: true, message: "Se o e-mail estiver cadastrado, você receberá um link em breve." });
    }

    // 3. Generate Link
    const token = await createMagicLink(lowerEmail, type, { partnerSlug: partnerInfo.slug });
    
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = req.headers.get('host') || 'pesquisapromo.com.br';
    const magicLink = `${protocol}://${host}/pro/ativar?token=${token}`;

    // 4. Send Email
    await sendMagicLinkEmail(lowerEmail, magicLink);

    return NextResponse.json({ 
      success: true, 
      message: "Se o e-mail estiver cadastrado, você receberá um link em breve." 
    });

  } catch (error) {
    console.error("[API Request Link] Erro:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
