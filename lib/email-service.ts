import { adminDb } from "./firebase-admin";
import { Demand } from "./types";

/**
 * Registra um evento de e-mail na coleção "mail", que será interpretado e enviado pela 
 * extensão oficial "Trigger Email" do Firebase.
 * O destinatário está temporariamente chumbado para o administrador na Fase Piloto.
 */
export async function triggerAdminEmail(demand: Demand) {
  try {
    const mailCollection = adminDb.collection("mail");

    // Recipient for Phase 1 Concierge Alerts
    const adminEmail = "oimylupa@pesquisapromo.com.br";
    
    const subject = `🚨 Nova Demanda Ouro: ${demand.request} (${demand.matchedCategories?.join(", ") || "Sem Categoria"})`;
    
    // Fallback Plain Text Version
    const text = `
      Um novo cliente pediu ajuda do myLupa!
      
      Item: ${demand.request}
      Detalhes: ${demand.details || "Nenhum detalhe adicional."}
      Nome do Cliente: ${demand.name || "Anônimo"}
      WhatsApp: ${demand.whatsapp}
      
      Acesse o painel do Firebase Console para visualizar a demanda completa.
    `;

    // Beautiful HTML Version for Gmail/Outlook
    const html = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #0F172A; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #F8FAFC; padding: 20px; border-bottom: 1px solid #E2E8F0; text-align: center;">
          <h2 style="margin: 0; color: #059669; font-size: 24px; font-weight: 900; letter-spacing: -1px;">🚨 Nova Demanda Recebida!</h2>
          <p style="margin: 5px 0 0 0; color: #64748B; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Piloto Concierge</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 15px; margin-bottom: 20px;">
            O cliente <strong style="color: #F97316;">${demand.name || "Anônimo"}</strong> (<a href="https://wa.me/55${demand.whatsapp.replace(/\D/g, '')}" style="color: #059669; text-decoration: none;">${demand.whatsapp}</a>) acaba de acionar o botão de ajuda na plataforma.
          </p>
          
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; margin: 0 0 5px 0; font-weight: bold;">O que o cliente precisa:</p>
            <p style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 15px 0;">${demand.request}</p>
            
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; margin: 0 0 5px 0; font-weight: bold;">Mensagem do Cliente:</p>
            <p style="font-size: 14px; color: #334155; margin: 0; font-style: italic;">"${demand.details || "Nenhum detalhe adicional informado."}"</p>
          </div>

          <p style="font-size: 13px; color: #64748B; margin-bottom: 5px;"><strong>Categorias Automáticas do Banco:</strong></p>
          <p style="font-size: 13px; color: #334155; margin: 0;">${demand.matchedCategories?.join(", ") || "Nenhuma"}</p>
        </div>
        
        <div style="background-color: #F1F5F9; padding: 15px 30px; text-align: center; border-top: 1px solid #E2E8F0;">
          <p style="margin: 0; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
            Automação myLupa - Firebase Trigger Email
          </p>
        </div>
      </div>
    `;

    await mailCollection.add({
      to: adminEmail,
      message: {
        subject,
        text,
        html
      }
    });

    console.info(`[myLupa] 📧 Alerta de E-mail enviado para fila (Demanda: #${demand.id})`);
  } catch (error) {
    console.error("[myLupa] Failed to write trigger email doc:", error);
  }
}

/**
 * Envia um link mágico de acesso para o e-mail do usuário.
 */
export async function sendMagicLinkEmail(email: string, magicLink: string) {
  try {
    const mailCollection = adminDb.collection("mail");

    const subject = "🔗 Seu acesso exclusivo ao myLupa Pro";
    
    const text = `
      Olá! Clique no link abaixo para acessar seu painel no myLupa Pro:
      
      ${magicLink}
      
      Este link é válido por 24 horas e pode ser usado apenas uma vez.
      Se você não solicitou este acesso, ignore este e-mail.
    `;

    const html = `
      <div style="font-family: sans-serif; max-w: 500px; margin: 0 auto; color: #0F172A; border: 1px solid #E2E8F0; border-radius: 24px; overflow: hidden; padding: 40px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #0F172A; font-size: 24px; font-weight: 900; font-style: italic;">myLupa <span style="color: #F97316;">PRO</span></h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #334155; text-align: center;">
          Você solicitou um acesso rápido ao seu painel. Clique no botão abaixo para entrar agora mesmo:
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${magicLink}" style="background-color: #F97316; color: #ffffff; padding: 16px 32px; border-radius: 16px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);">
            Entrar no Painel
          </a>
        </div>
        
        <p style="font-size: 12px; color: #94A3B8; text-align: center; margin-top: 30px;">
          Este link é seguro, de uso único e expira em 24 horas.<br>
          Se o botão não funcionar, copie este endereço: <br>
          <span style="color: #64748B; word-break: break-all;">${magicLink}</span>
        </p>

        <hr style="border: 0; border-top: 1px solid #F1F5F9; margin: 30px 0;">
        
        <p style="font-size: 11px; color: #CBD5E1; text-align: center; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
          © 2026 myLupa - Segurança e Tecnologia
        </p>
      </div>
    `;

    await mailCollection.add({
      to: email,
      message: {
        subject,
        text,
        html
      }
    });

    console.info(`[myLupa] 📧 Magic Link enviado para fila (Destino: ${email})`);
  } catch (error) {
    console.error("[myLupa] Failed to send magic link email:", error);
    throw error;
  }
}
