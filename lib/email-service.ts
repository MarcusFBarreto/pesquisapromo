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
